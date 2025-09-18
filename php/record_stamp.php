<?php
// php/record_stamp.php (本番用)

// 必要な設定ファイルや関数を読み込みます。
require_once __DIR__ . '/../../app_files/config.php';
require_once __DIR__ . '/../../app_files/db.php';
require_once __DIR__ . '/session_check.php';

// 応答形式をJSONに設定します。
header('Content-Type: application/json; charset=UTF-8');

try {
    // 認証チェックとユーザーUUIDの取得
    $user_uuid = check_login_status();

    // JavaScriptから送られてきたJSONデータを取得します。
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    // stamp_idが含まれているか確認します。
    if (!isset($data['stamp_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'スタンプIDが指定されていません。']);
        exit;
    }

    $stamp_id = $data['stamp_id'];
    $conn = get_db_connection();

    // stampsテーブルにデータを挿入します。カラム名は「stamp_id」に修正済みです。
    $stmt = $conn->prepare("INSERT INTO stamps (uuid, stamp_id) VALUES (?, ?)");
    $stmt->bind_param("si", $user_uuid, $stamp_id);
    
    if ($stmt->execute()) {
        // 成功した場合
        echo json_encode(['success' => true, 'message' => 'スタンプを記録しました。']);
    } else {
        // 失敗した場合
        http_response_code(500);
        echo json_encode(['error' => 'データベースへの記録に失敗しました。']);
    }
    
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'サーバーエラーが発生しました: ' . $e->getMessage()]);
}
?>