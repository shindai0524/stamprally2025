<?php
session_start();
require_once __DIR__ . '/admin_config.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

// 未ログイン時はログイン画面へ
if (!isset($_SESSION['admin_id'])) {
    header("Location: admin_login.php");
    exit;
}

$pdo = getPDO();

// ▼ 現在の登録者数（usersテーブルの9月1日以降）
$stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE created_at >= '2025-09-01 00:00:00'");
$stmt->execute();
$currentCount = $stmt->fetchColumn();

// ▼ 日ごとの登録者数を取得（9月1日～10月31日）
$stmt = $pdo->prepare("
    SELECT DATE(created_at) as d, COUNT(*) as cnt
    FROM users
    WHERE created_at >= '2025-09-01 00:00:00' AND created_at < '2025-11-01 00:00:00'
    GROUP BY DATE(created_at)
    ORDER BY d ASC
");
$stmt->execute();
$dailyCounts = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

// ▼ CSVダウンロード処理
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['table'])) {
    $table = $_POST['table'];

    // ログ記録
    $stmt = $pdo->prepare("INSERT INTO admin_log (id, usetime, action) VALUES (:id, NOW(), :action)");
    $stmt->execute([
        ':id' => $_SESSION['admin_id'],
        ':action' => $table === 'allzip' ? 'getcsv_allzip' : "getcsv_" . $table
    ]);

    $timestamp = date("YmdHis");

    // ▼ 一括ダウンロード（ZIP形式）
    if ($table === 'allzip') {
        $tables = [
            'users',
            'stamps',              // ← ここも特別処理にする（stamp_nameを含める）
            'stamps_total',        // 集計は特別処理
            'participation_survey_answers',
            'initial_survey_answers',
            'forms'
        ];
        $zip = new ZipArchive();
        $zipFilename = tempnam(sys_get_temp_dir(), 'csvzip_') . '.zip';

        if ($zip->open($zipFilename, ZipArchive::CREATE) !== TRUE) {
            exit("Zipファイル作成に失敗しました");
        }

        $dateCols = [
            'users' => 'created_at',
            'stamps' => 'acquired_at',
            'participation_survey_answers' => 'submitted_at',
            'initial_survey_answers' => 'submitted_at',
            'forms' => 'applied_at'
        ];

        foreach ($tables as $t) {
            $csvData = fopen('php://temp', 'r+');

            if ($t === 'stamps_total') {
                // --- 各スタンプごとの現時点の獲得数 ---
                $headers = ['stamp_id', 'stamp_name', 'count'];
                fputcsv($csvData, array_map(fn($col) => mb_convert_encoding($col, "SJIS-win", "UTF-8"), $headers));

                $stmt = $pdo->prepare("
                    SELECT i.stamp_id, i.stamp_name, COUNT(s.stamp_id) AS count
                    FROM stamp_info i
                    LEFT JOIN stamps s
                      ON i.stamp_id = s.stamp_id
                      AND s.acquired_at >= '2025-09-01 00:00:00'
                    GROUP BY i.stamp_id, i.stamp_name
                    ORDER BY i.stamp_id ASC
                ");
                $stmt->execute();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $converted = array_map(fn($val) => mb_convert_encoding($val, "SJIS-win", "UTF-8"), $row);
                    fputcsv($csvData, $converted);
                }

            } elseif ($t === 'stamps') {
                // --- 獲得スタンプ（stamp_name 付き） ---
                $headers = ['uuid', 'stamp_id', 'stamp_name', 'acquired_at'];
                fputcsv($csvData, array_map(fn($col) => mb_convert_encoding($col, "SJIS-win", "UTF-8"), $headers));

                $stmt = $pdo->prepare("
                    SELECT s.uuid, s.stamp_id, i.stamp_name, s.acquired_at
                    FROM stamps s
                    LEFT JOIN stamp_info i ON i.stamp_id = s.stamp_id
                    WHERE s.acquired_at >= '2025-09-01 00:00:00'
                    ORDER BY s.acquired_at ASC
                ");
                $stmt->execute();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    // NULL も含めて変換（NULLは空文字にしておく）
                    $converted = array_map(function($val){
                        $val = $val === null ? '' : $val;
                        return mb_convert_encoding($val, "SJIS-win", "UTF-8");
                    }, $row);
                    fputcsv($csvData, $converted);
                }

            } else {
                // --- 通常テーブルのCSV出力 ---
                $stmt = $pdo->query("SHOW COLUMNS FROM `{$t}`");
                $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
                fputcsv($csvData, array_map(fn($col) => mb_convert_encoding($col, "SJIS-win", "UTF-8"), $columns));

                $dateCol = $dateCols[$t] ?? null;
                if ($dateCol) {
                    $stmt = $pdo->prepare("SELECT * FROM `{$t}` WHERE `$dateCol` >= '2025-09-01 00:00:00' ORDER BY `$dateCol` ASC");
                } else {
                    $stmt = $pdo->prepare("SELECT * FROM `{$t}`");
                }
                $stmt->execute();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $converted = array_map(function($val){
                        $val = $val === null ? '' : $val;
                        return mb_convert_encoding($val, "SJIS-win", "UTF-8");
                    }, $row);
                    fputcsv($csvData, $converted);
                }
            }

            // --- zipに追加 ---
            rewind($csvData);
            $csvContent = stream_get_contents($csvData);
            fclose($csvData);
            if ($csvContent === false) $csvContent = "";

            $zip->addFromString("{$t}.csv", $csvContent);
        }

        $zip->close();
        $downloadName = "all_tables-{$timestamp}.zip";
        header("Content-Type: application/zip");
        header("Content-Disposition: attachment; filename={$downloadName}");
        header("Content-Length: " . filesize($zipFilename));
        readfile($zipFilename);
        unlink($zipFilename);
        exit;
    }

    // ▼ 個別CSV出力
    $dateCols = [
        'users' => 'created_at',
        'stamps' => 'acquired_at',
        'participation_survey_answers' => 'submitted_at',
        'initial_survey_answers' => 'submitted_at',
        'forms' => 'applied_at'
    ];

    $dateCol = $dateCols[$table] ?? null;

    header("Content-Type: text/csv; charset=Shift_JIS");
    header("Content-Disposition: attachment; filename={$table}-{$timestamp}.csv");

    $output = fopen('php://output', 'w');

    if ($table === 'stamps_total') {
        // --- 各スタンプごとの現時点の獲得数 ---
        $headers = ['stamp_id', 'stamp_name', 'count'];
        fputcsv($output, array_map(fn($col) => mb_convert_encoding($col, "SJIS-win", "UTF-8"), $headers));

        $stmt = $pdo->prepare("
            SELECT i.stamp_id, i.stamp_name, COUNT(s.stamp_id) AS count
            FROM stamp_info i
            LEFT JOIN stamps s
              ON i.stamp_id = s.stamp_id
              AND s.acquired_at >= '2025-09-01 00:00:00'
            GROUP BY i.stamp_id, i.stamp_name
            ORDER BY i.stamp_id ASC
        ");
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $converted = array_map(function($val){
                $val = $val === null ? '' : $val;
                return mb_convert_encoding($val, "SJIS-win", "UTF-8");
            }, $row);
            fputcsv($output, $converted);
        }

        fclose($output);
        exit;

    } elseif ($table === 'stamps') {
        // --- 獲得スタンプ（stamp_name 付き） ---
        $headers = ['uuid', 'stamp_id', 'stamp_name', 'acquired_at'];
        fputcsv($output, array_map(fn($col) => mb_convert_encoding($col, "SJIS-win", "UTF-8"), $headers));

        $stmt = $pdo->prepare("
            SELECT s.uuid, s.stamp_id, i.stamp_name, s.acquired_at
            FROM stamps s
            LEFT JOIN stamp_info i ON i.stamp_id = s.stamp_id
            WHERE s.acquired_at >= '2025-09-01 00:00:00'
            ORDER BY s.acquired_at ASC
        ");
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $converted = array_map(function($val){
                $val = $val === null ? '' : $val;
                return mb_convert_encoding($val, "SJIS-win", "UTF-8");
            }, $row);
            fputcsv($output, $converted);
        }

        fclose($output);
        exit;
    }

    // --- 通常のテーブル出力 ---
    $stmt = $pdo->query("SHOW COLUMNS FROM `{$table}`");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    fputcsv($output, array_map(fn($col) => mb_convert_encoding($col, "SJIS-win", "UTF-8"), $columns));

    if ($dateCol) {
        $stmt = $pdo->prepare("SELECT * FROM `{$table}` WHERE `$dateCol` >= '2025-09-01 00:00:00' ORDER BY `$dateCol` ASC");
    } else {
        $stmt = $pdo->prepare("SELECT * FROM `{$table}`");
    }
    $stmt->execute();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $converted = array_map(function($val){
            $val = $val === null ? '' : $val;
            return mb_convert_encoding($val, "SJIS-win", "UTF-8");
        }, $row);
        fputcsv($output, $converted);
    }

    fclose($output);
    exit;
}

/**
 * カレンダー生成関数
 */
function renderCalendar($year, $month, $dailyCounts) {
    $firstDay = new DateTime("{$year}-{$month}-01");
    $lastDay = (clone $firstDay)->modify('last day of this month');
    $startWeekDay = (int)$firstDay->format('w');
    $totalDays = (int)$lastDay->format('j');

    echo '<table class="calendar">';
    echo '<thead><tr>';
    echo '<th>日</th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th>土</th>';
    echo '</tr></thead><tbody><tr>';

    for ($i = 0; $i < $startWeekDay; $i++) echo '<td class="empty"></td>';

    for ($day = 1; $day <= $totalDays; $day++) {
        $dateStr = sprintf("%04d-%02d-%02d", $year, $month, $day);
        $count = $dailyCounts[$dateStr] ?? 0;

        echo '<td>';
        echo '<div class="day">' . $day . '</div>';
        if ($count > 0) echo '<span class="count">' . $count . '人</span>';
        echo '</td>';

        if ((($day + $startWeekDay) % 7) == 0) echo '</tr><tr>';
    }

    $endWeekDay = (int)$lastDay->format('w');
    for ($i = $endWeekDay; $i < 6; $i++) echo '<td class="empty"></td>';

    echo '</tr></tbody></table>';
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>CSV出力ページ</title>
  <link rel="stylesheet" href="get_csvfile.css">
</head>
<body>
  <div class="header">
    <div class="logo"><img src="../image/logo.png" alt="Adminロゴ"></div>
    <h1>CSV出力ページ</h1>
  </div>

  <div class="content">
    <p class="info">現在の登録者数: <?php echo (int)$currentCount; ?> 人</p>

    <div class="calendar-controls">
      <button onclick="showMonth(9)">◀ 9月</button>
      <span id="calendar-title">2025年9月</span>
      <button onclick="showMonth(10)">10月 ▶</button>
    </div>

    <div id="calendar-sep" style="display:block;"><?php renderCalendar(2025, 9, $dailyCounts); ?></div>
    <div id="calendar-oct" style="display:none;"><?php renderCalendar(2025, 10, $dailyCounts); ?></div>

    <h2>ダウンロードしたいCSVファイルを選択してください。</h2>
    <form method="post">
      <button type="submit" name="table" value="users">ユーザー情報</button>
      <button type="submit" name="table" value="stamps">ユーザー別獲得スタンプ一覧</button>
      <button type="submit" name="table" value="stamps_total">スポット別スタンプ獲得数集計</button>
      <button type="submit" name="table" value="participation_survey_answers">参加賞応募後アンケート</button>
      <button type="submit" name="table" value="initial_survey_answers">初回ログイン後アンケート</button>
      <button type="submit" name="table" value="forms">応募情報</button>
      <br><br>
      <button type="submit" name="table" value="allzip" class="allzip">一括ダウンロード</button>
    </form>
  </div>

  <script>
    function showMonth(month) {
      document.getElementById("calendar-sep").style.display = (month === 9 ? "block" : "none");
      document.getElementById("calendar-oct").style.display = (month === 10 ? "block" : "none");
      document.getElementById("calendar-title").textContent = "2025年" + month + "月";
    }
  </script>
</body>
</html>
