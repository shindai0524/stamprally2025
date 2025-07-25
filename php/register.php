<?php
// php/register.php

require_once __DIR__ . '/../../app_files/config.php';
require_once __DIR__ . '/../../app_files/validation.php';
require_once __DIR__ . '/../../app_files/db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    header("Content-Type: application/json; charset=UTF-8");

    $conn = get_db_connection();
    $errors = validation($_POST, true, $conn);

    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['errors' => $errors]);
        $conn->close();
        exit;
    }
    
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // ★★★ 修正点: カラム名を username から email に変更 ★★★
    $stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $hashed_password);

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