<?php
// config.php

/**
 * 環境設定
 * 開発中は 'development'、本番環境では 'production' に設定してください。
 */
define('ENVIRONMENT', 'development'); // ← 本番サーバーに設置する際は 'production' に変更

// =================================================================
// 環境に応じたエラーレポート設定
// =================================================================
if (ENVIRONMENT === 'development') {
    // --- 開発環境の設定 ---
    // 全てのエラーを画面に表示する
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    // --- 本番環境の設定 ---
    // エラーを画面には表示しない
    ini_set('display_errors', 0);
    // 致命的なエラーのみをログに記録する（NOTICEやDEPRECATEDは除く）
    error_reporting(E_ALL & ~E_DEPRECATED);
    // エラーロギングを有効にする
    ini_set('log_errors', 'On');
    // エラーログの保存先を指定
    // ※注意: このパスはWebからアクセスできない、安全なディレクトリに変更してください。
    // 例: ini_set('error_log', '/var/log/php/php-error.log');
    ini_set('error_log', __DIR__ . '/php-error.log');
}

/**
 * 許可するオリジン（フロントエンドのURL）
 * 開発時はローカルサーバーのURL、本番時は公開URLを指定します。
 * 本番サーバーに公開する際は、必ずあなたのWebサイトの正式なURL（例: https://www.your-app-domain.com）に書き換えてください。
 * 例: define('ALLOWED_ORIGIN', 'https://your-domain.com');
 */
define('ALLOWED_ORIGIN', 'http://localhost');


// --- データベース接続設定 ---
define('DB_HOST', 'localhost');
define('DB_USER', 'root'); // XAMPPのデフォルトユーザー
define('DB_PASS', '');     // XAMPPのデフォルトパスワードは空
define('DB_NAME', 'token_auth_db');

// --- JWT設定 ---
define('JWT_SECRET_KEY', 'TV8F5G3PrNS2I3HWzzHDLaZBzXxu4EA7bi7NH5IMgzFgtwbhh3y8OosN3SeqnulFSk0XKfIKGtYgIV1y/5bCHA=='); // 必ず自分だけの秘密鍵に変更してください
define('JWT_ALGORITHM', 'HS256');


// CORS（クロスオリジンリソース共有）ヘッダーを設定
// これにより、異なるオリジン（ドメイン）からのJavaScriptリクエストを受け入れる
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// OPTIONSメソッドのリクエストに対する事前応答
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}
?>