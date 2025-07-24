<?php
// login.php

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../validation.php';
require_once __DIR__ . '/../db.php'; 

use Firebase\JWT\JWT;

// 1. 最初にDB接続を確立
$conn = get_db_connection();

// レートリミットのロジック
$ip_address = $_SERVER['REMOTE_ADDR'];
$failure_check_stmt = $conn->prepare(
    "SELECT COUNT(*) as failure_count FROM login_failures WHERE ip_address = ? AND attempt_time > (NOW() - INTERVAL 5 MINUTE)"
);
$failure_check_stmt->bind_param("s", $ip_address);
$failure_check_stmt->execute();
$result = $failure_check_stmt->get_result();
$failures = $result->fetch_assoc();
$failure_check_stmt->close();

// 失敗回数が5回以上の場合、リクエストをブロック
if ($failures['failure_count'] >= 5) {
    header("Content-Type: application/json");
    http_response_code(429); // 429 Too Many Requests
    echo json_encode(['error' => '試行回数が多すぎます。5分後に再度お試しください。']);
    $conn->close();
    exit;
}


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    header("Content-Type: application/json");

    $errors = validation($_POST, false, $conn);

    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['errors' => $errors]);
        $conn->close(); 
        exit;
    }

    $email = $_POST['email'];
    $password = $_POST['password'];


    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $username_db, $password_hash);
        $stmt->fetch();

        $user = [
            'id' => $id,
            'username' => $username_db,
            'password' => $password_hash
        ];

        if (password_verify($password, $user['password'])) {
            // ログイン成功時、失敗ログを削除
            $delete_stmt = $conn->prepare("DELETE FROM login_failures WHERE ip_address = ?");
            $delete_stmt->bind_param("s", $ip_address);
            $delete_stmt->execute();
            $delete_stmt->close();

            // JWTペイロードの作成
            $iat = time();
            $exp = $iat + (60 * 60); // 有効期限1時間
            $iss = "http://localhost/token-login-example";

            $payload = [
                'iss' => $iss, 'iat' => $iat, 'exp' => $exp,
                'data' => [
                    'userId' => $user['id'],
                    'username' => $user['username']
                ]
            ];
            
            $jwt = JWT::encode($payload, JWT_SECRET_KEY, JWT_ALGORITHM);

            http_response_code(200);
            echo json_encode(['message' => 'Login successful.', 'token' => $jwt]);
        } else {
            // ログイン失敗時、ログを記録
            $insert_stmt = $conn->prepare("INSERT INTO login_failures (ip_address, attempt_time) VALUES (?, NOW())");
            $insert_stmt->bind_param("s", $ip_address);
            $insert_stmt->execute();
            $insert_stmt->close();

            http_response_code(401);
            echo json_encode(['error' => 'メールアドレスまたはパスワードが正しくありません。']);
        }
    } else {
        // ユーザーが存在しない場合も、ログを記録
        $insert_stmt = $conn->prepare("INSERT INTO login_failures (ip_address, attempt_time) VALUES (?, NOW())");
        $insert_stmt->bind_param("s", $ip_address);
        $insert_stmt->execute();
        $insert_stmt->close();
        
        http_response_code(401);
        echo json_encode(['error' => 'メールアドレスまたはパスワードが正しくありません。']);
    }
    
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
    exit;
}
?>