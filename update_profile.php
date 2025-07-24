<?php
// update_profile.php

require_once 'config.php';
require_once 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Content-Type: application/json");

// --- トークン認証 ---
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? null;
if (!$authHeader) {
    http_response_code(401);
    echo json_encode(['error' => 'Access denied. No token provided.']);
    exit;
}
list($type, $token) = explode(' ', $authHeader, 2);
if (strcasecmp($type, 'Bearer') != 0 || !$token) {
    http_response_code(401);
    echo json_encode(['error' => 'Access denied. Malformed token.']);
    exit;
}

try {
    $decoded = JWT::decode($token, new Key(JWT_SECRET_KEY, JWT_ALGORITHM));
    $userId = $decoded->data->userId;

    // --- 新しいメッセージの取得 ---
    $data = json_decode(file_get_contents("php://input"));
    $newMessage = $data->message ?? null;

    if ($newMessage === null) {
        http_response_code(400);
        echo json_encode(['error' => 'No message provided.']);
        exit;
    }

    // --- データベース接続と更新 ---
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed.']);
        exit;
    }
    
    $stmt = $conn->prepare("UPDATE users SET profile_message = ? WHERE id = ?");
    $stmt->bind_param("si", $newMessage, $userId);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        // --- 更新成功後、新しい情報でトークンを再発行 ---
        $iat = time();
        $exp = $decoded->exp; // 有効期限は元のトークンを引き継ぐ
        $payload = [
            'iss' => $decoded->iss,
            'iat' => $iat,
            'exp' => $exp,
            'data' => [
                'userId' => $userId,
                'username' => $decoded->data->username,
                'profileMessage' => $newMessage
            ]
        ];
        $newJwt = JWT::encode($payload, JWT_SECRET_KEY, JWT_ALGORITHM);

        http_response_code(200);
        echo json_encode([
            'message' => 'Profile updated successfully.',
            'newToken' => $newJwt // 新しいトークンを返す
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update profile.']);
    }
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Access denied. Invalid token.', 'details' => $e->getMessage()]);
}
?>