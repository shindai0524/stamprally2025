<?php
// php/register.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../app_files/config.php';
require_once __DIR__ . '/../../app_files/validation.php';
require_once __DIR__ . '/../../app_files/db.php';
// ramsey/uuidライブラリを読み込む
require_once __DIR__ . '/../../app_files/vendor/autoload.php';

use Ramsey\Uuid\Uuid;

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
    
    // ユーザーIDとしてUUIDを生成
    $user_id = Uuid::uuid4()->toString();
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // idカラムにも値を挿入するように変更
    $stmt = $conn->prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)");
    // 型にs (string) を追加し、変数をバインド
    $stmt->bind_param("sss", $user_id, $email, $hashed_password);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(['message' => 'ユーザー登録が完了しました。']);
    } else {
        http_response_code(500);
        // エラーメッセージを少し具体的にするとデバッグしやすくなります
        echo json_encode(['error' => '登録に失敗しました: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
    exit;
}
?>