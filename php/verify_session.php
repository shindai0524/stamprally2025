<?php
// php/verify_session.php - 修正版

// 本番環境用の設定
ini_set('display_errors', 0);
error_reporting(0);

// ★★★ パスを他のPHPファイルと合わせて修正 ★★★
require_once __DIR__ . '/../../app_files/config.php';
require_once __DIR__ . '/../../app_files/db.php';

// AuthorizationヘッダーからセッションIDを取得する関数
function get_session_id_from_header() {
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        if (preg_match('/^Bearer\s+(.+)$/', $authHeader, $matches)) {
            return $matches[1];
        }
    }
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

$session_id = get_session_id_from_header();
$is_valid = false;

if ($session_id) {
    $conn = null; // DB接続変数を初期化
    try {
        $conn = get_db_connection();
        if ($conn) {
            $stmt = $conn->prepare("SELECT user_id FROM sessions WHERE session_id = ? AND expires_at > NOW()");
            $stmt->bind_param("s", $session_id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 1) {
                $is_valid = true;
            }
            $stmt->close();
            $conn->close();
        }
    } catch (Exception $e) {
            // DB接続エラーなどが発生した場合、ログに記録
            error_log("Session verification error: " . $e->getMessage());
            $is_valid = false;
            // ★★★ Corrected line: Simply check if $conn is an object before closing ★★★
            if ($conn) {
                $conn->close();
            }
        }
    }

header('Content-Type: application/json; charset=UTF-8');
if ($is_valid) {
    http_response_code(200);
    echo json_encode(['message' => 'Session is valid.']);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Session is not valid.']);
}
?>