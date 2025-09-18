<?php
// データベース接続用のファイルを読み込む
require_once __DIR__ . '/../app_files/db.php';

// =================================================================
// 1. 設定項目
// =================================================================

// --- カウント対象のテーブル名 ---
$db_table = 'initial_survey_answers';

$secret_token = 'kR8vP2nXbEaGzJ4mYtU9sQdF6cH1wI0p'; // ← あなただけの秘密の文字列に変更
if (!isset($_GET['token']) || $_GET['token'] !== $secret_token) {
    die('Invalid access token.'); // トークンが一致しない場合は処理を中断
}

// --- 書き出すCSVファイルの名前 ---
// このPHPスクリプトと同じ場所に作成されます
$csv_file_path = __DIR__ . '/database_count_log.csv';


// =================================================================
// 2. MySQLから件数を取得
// =================================================================

$count = 0; // 件数を保存する変数

try {
    // db.php内の関数を使ってデータベースに接続
    $conn = get_db_connection();

    // SQLを実行して件数を取得
    $sql = "SELECT COUNT(*) AS total_count FROM {$db_table}";
    $result = $conn->query($sql);
    
    if ($result) {
        $row = $result->fetch_assoc();
        $count = $row['total_count'];
        $result->free(); // 結果セットを解放
    }
    
    // データベース接続を閉じる
    $conn->close();

} catch (Exception $e) {
    die("データベース処理エラー: " . $e->getMessage());
}

echo "データベースから件数を取得しました。件数: {$count}\n";


// =================================================================
// 3. CSVファイルに1行追記する
// =================================================================

try {
    // ファイルを追記モードで開く ('a'はappendの略)
    $file = fopen($csv_file_path, 'a');

    // ファイルが新規作成された場合、ヘッダー行を書き込む
    if (filesize($csv_file_path) == 0) {
        fputcsv($file, ['日付', '件数']);
    }
    
    // 追記するデータを作成
    $date = date('Y-m-d');
    $data_row = [$date, $count];

    // データをCSV形式でファイルに書き込む
    fputcsv($file, $data_row);

    // ファイルを閉じる
    fclose($file);

    echo "CSVファイルへの追記が完了しました。\n";

} catch (Exception $e) {
    die("ファイル書き込みエラー: " . $e->getMessage());
}

?>