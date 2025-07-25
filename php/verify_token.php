@ -0,0 +1,18 @@
<?php
// verify_token.php

require_once __DIR__ . '/../../app_files/auth.php';

// ★ 変更: 全てのトークン検証ロジックがこの単一の関数呼び出しに集約
$decoded = authenticate_user();

// この時点に到達すればトークンは有効
echo json_encode([
    'message' => 'Access granted.',
    'data' => [
        'welcomeMessage' => 'ようこそ、' . htmlspecialchars($decoded->data->email) . 'さん！',
        'userId' => $decoded->data->userId
    ]
]);
?>