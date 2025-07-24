<?php
// verify_token.php

require_once 'auth.php'; // ★ 変更: 新しいauthモジュールを使用

// ★ 変更: 全てのトークン検証ロジックがこの単一の関数呼び出しに集約
$decoded = authenticate_user();

// この時点に到達すればトークンは有効
http_response_code(200);
echo json_encode([
    'message' => 'Access granted.',
    'data' => [
        'welcomeMessage' => 'ようこそ、' . htmlspecialchars($decoded->data->username) . 'さん！',
        'userId' => $decoded->data->userId
    ]
]);
?>