<?php
// php/record_alert.php

require_once __DIR__ . '/../../app_files/config.php';
require_once __DIR__ . '/../../app_files/db.php';
require_once __DIR__ . '/session_check.php';

header('Content-Type: application/json; charset=UTF-8');

try {
    // セッションからuuid取得（ログインチェック）
    $uuid = check_login_status();  // ← 有効なセッションから取得

    // POSTされたJSONを読み込む
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    // alertsが存在し、配列であることを確認
    if (!isset($data['alerts']) || !is_array($data['alerts'])) {
        http_response_code(400);
        echo json_encode(['error' => 'alerts配列が正しく送信されていません。']);
        exit;
    }

    $alerts = $data['alerts'];

    // DB接続
    $conn = get_db_connection();

    // 既に登録済みのalertを取得
    $stmt = $conn->prepare("SELECT alert FROM alert WHERE uuid = ?");
    $stmt->bind_param("s", $uuid);
    $stmt->execute();
    $result = $stmt->get_result();

    $existing_alerts = [];
    while ($row = $result->fetch_assoc()) {
        $existing_alerts[] = $row['alert'];
    }
    $stmt->close();

    // 新しいalertのみ挿入
    $insert_stmt = $conn->prepare("INSERT INTO alert (uuid, alert) VALUES (?, ?)");
    $inserted = [];

    foreach ($alerts as $alert) {
        if (!in_array($alert, $existing_alerts)) {
            $insert_stmt->bind_param("ss", $uuid, $alert);
            if ($insert_stmt->execute()) {
                $inserted[] = $alert;
            }
        }
    }

    $insert_stmt->close();
    $conn->close();

    echo json_encode([
        'success' => true,
        'inserted' => $inserted
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'サーバーエラーが発生しました: ' . $e->getMessage()]);
}
