<?php
/**
 * save_stamp.php
 * クライアントからスタンプ情報を取得し、データベースに保存するAPI
 */

// 1. 設定ファイルを読み込む
// これにより、DB接続情報やCORS設定が適用されます。
require_once __DIR__ . '/../app_files/config.php';

// 2. このAPIのレスポンス形式をJSONに指定
header('Content-Type: application/json');


// 3. POSTされてきたJSONデータを取得・デコード
$json = file_get_contents('php://input');
$data = json_decode($json);

// 4. 必要なデータが存在するかチェック
if (!$data || !isset($data->uuid) || !isset($data->stamp_id)) {
    echo json_encode(['success' => false, 'message' => '送信されたデータが不正です。']);
    exit();
}

$uuid = $data->uuid;
$stamp_id = $data->stamp_id;


// 5. DSN(データソースネーム)を組み立てる
// config.phpの定数を使ってDSNを生成します。
$dsn = sprintf('mysql:dbname=%s;host=%s;charset=utf8mb4', DB_NAME, DB_HOST);


try {
    // 6. config.phpの定数を使ってデータベースに接続
    $dbh = new PDO($dsn, DB_USER, DB_PASS);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // --- 重複登録チェック ---
    $sql_check = "SELECT COUNT(*) FROM stamps WHERE uuid = :uuid AND stamp_id = :stamp_id";
    $stmt_check = $dbh->prepare($sql_check);
    $stmt_check->bindParam(':uuid', $uuid, PDO::PARAM_STR);
    $stmt_check->bindParam(':stamp_id', $stamp_id, PDO::PARAM_INT);
    $stmt_check->execute();
    
    if ($stmt_check->fetchColumn() > 0) {
        echo json_encode(['success' => true, 'message' => '既に獲得済みのスタンプです。']);
        exit();
    }

    // --- データ挿入処理 ---
    $sql = "INSERT INTO stamps (uuid, stamp_id) VALUES (:uuid, :stamp_id)";
    $stmt = $dbh->prepare($sql);
    $stmt->bindParam(':uuid', $uuid, PDO::PARAM_STR);
    $stmt->bindParam(':stamp_id', $stamp_id, PDO::PARAM_INT);
    $stmt->execute();

    // 成功レスポンスを返す
    echo json_encode(['success' => true, 'message' => 'スタンプを正常に獲得しました。']);

} catch (PDOException $e) {
    // エラーログはconfig.phpの設定に従って記録されます
    error_log('Database Error: ' . $e->getMessage()); 
    // クライアントには一般的なエラーメッセージを返す
    echo json_encode(['success' => false, 'message' => 'データベース処理中にエラーが発生しました。']);
} finally {
    $dbh = null;
}