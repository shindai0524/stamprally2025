<?php
// config_test.php

echo "<h1>Config Test</h1>";

echo "Attempting to load config.php...<br>";

// ★★★ あなたの環境に合わせて、このパスを修正してください ★★★
// 例: 非公開ディレクトリが 'app_files' の場合
$config_path = __DIR__ . '/../../app_files/config.php';

if (file_exists($config_path)) {
    require_once $config_path;
    echo "✅ Success! config.php was found and loaded.<br><br>";
    
    echo "<h2>Defined Constants:</h2>";
    echo "ENVIRONMENT: " . (defined('ENVIRONMENT') ? ENVIRONMENT : 'NOT DEFINED') . "<br>";
    echo "DB_HOST: " . (defined('DB_HOST') ? DB_HOST : 'NOT DEFINED') . "<br>";
    echo "DB_USER: " . (defined('DB_USER') ? DB_USER : 'NOT DEFINED') . "<br>";
    echo "DB_NAME: " . (defined('DB_NAME') ? DB_NAME : 'NOT DEFINED') . "<br>";
    echo "ALLOWED_ORIGIN: " . (defined('ALLOWED_ORIGIN') ? ALLOWED_ORIGIN : 'NOT DEFINED') . "<br>";

} else {
    echo "❌ Failure! config.php was not found at the specified path.<br>";
    echo "Path checked: " . $config_path;
}
?>