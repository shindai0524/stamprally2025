<?php
// auth.php

require_once __DIR__.'/config.php';
require_once __DIR__.'/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;

/**
 * AuthorizationヘッダーのJWTを検証してユーザーを認証する関数
 * 認証に失敗した場合は、401レスポンスを送信してスクリプトを終了します。
 * @return object トークンが有効な場合にデコードされたJWTペイロード
 */
function authenticate_user()
{
    header("Content-Type: application/json");

    $authHeader = getallheaders()['Authorization'] ?? null;

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
        return JWT::decode($token, new Key(JWT_SECRET_KEY, JWT_ALGORITHM));
    } catch (ExpiredException $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Access denied. Token has expired.']);
        exit;
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Access denied. Invalid token.']);
        exit;
    }
}
?>