<?php
// admin_config.php

define('DB_HOST', '127.0.0.1:3307');     // DBサーバー
define('DB_NAME', 'stamp');  // DB名
define('DB_USER', 'sradmin');  // ユーザー名
define('DB_PASS', 'sradmin2023');  // パスワード
define('DB_CHARSET', 'utf8mb4');    // 文字コード

function getPDO() {
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        die("DB接続失敗: " . $e->getMessage());
    }
}
