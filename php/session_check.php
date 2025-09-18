<?php
// php/session_check.php

// このファイルはログインが必要なページの先頭で必ず読み込む

require_once __DIR__ . '/../../app_files/config.php';
require_once __DIR__ . '/../../app_files/db.php';

// AuthorizationヘッダーからセッションIDを取得する関数
function get_session_id_from_header() {
    // まず、標準的な方法を試す
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        if (preg_match('/^Bearer\s+(.+)$/', $authHeader, $matches)) {
            return $matches[1];
        }
    }

    // getallheaders()が利用可能な場合、フォールバックとして試す
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            if (preg_match('/^Bearer\s+(.+)$/', $headers['Authorization'], $matches)) {
                return $matches[1];
            }
        }
    }
    
    return null;
}

// ログイン状態をチェックするメインの関数
function check_login_status() {
    // localStorage方式では、PHPは直接セッションIDを知ることができない。
    // そのため、JavaScriptから送られてくるヘッダーを確認する。
    $session_id = get_session_id_from_header();

    if ($session_id === null) {
        // ヘッダーにセッションIDがなければ、未ログインと判断
        return false;
    }

    $conn = get_db_connection();

    // DBでセッションIDを検証
    $stmt = $conn->prepare("SELECT user_id FROM sessions WHERE session_id = ? AND expires_at > NOW()");
    $stmt->bind_param("s", $session_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        // ログイン成功
        $session_data = $result->fetch_assoc();
        $stmt->close();
        $conn->close();
        return $session_data['user_id']; // ログインしているユーザーIDを返す
    } else {
        // セッションIDが無効または期限切れ
        $stmt->close();
        $conn->close();
        return false;
    }
}

// ★★★ ページ保護の実行部分 ★★★
// ログイン状態をチェックし、していなければログインページへ飛ばす
// APIで利用されることを想定しているため、未認証の場合はJSONで401エラーを返す
if (check_login_status() === false) {
    http_response_code(401);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

?>