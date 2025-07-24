<?php
// db.php

require_once __DIR__.'/config.php';

/**
 * データベース接続を確立し、返す関数
 * 失敗した場合は、500エラーでスクリプトを終了します。
 * @return mysqli データベース接続オブジェクト
 */
function get_db_connection()
{
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        http_response_code(500);
        header("Content-Type: application/json");
        echo json_encode(['error' => 'データベース接続に失敗しました: ' . $conn->connect_error]);
        exit;
    }
    return $conn;
}
?>