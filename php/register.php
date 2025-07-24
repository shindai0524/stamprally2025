<?php
// php/register.php

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../validation.php';
require_once __DIR__ . '/../db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    header("Content-Type: application/json; charset=UTF-8");

    // 1. 最初にデータベース接続を確立します
    $conn = get_db_connection();

    // 2. バリデーション関数に確立した $conn を渡します
    $errors = validation($_POST, true, $conn);

    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['errors' => $errors]);
        $conn->close(); // エラーがあっても接続は閉じる
        exit;
    }
    
    $username = trim($_POST['email']);
    $password = $_POST['password'];
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // バリデーションで重複チェック済みなので、ここでは単純にINSERTします
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $hashed_password);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(['message' => 'ユーザー登録が完了しました。']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => '登録に失敗しました。管理者にお問い合わせください。']);
    }

    $stmt->close();
    $conn->close();
    exit;
}
?>