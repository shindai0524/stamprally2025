<?php
// php/submit_survey.php (新規作成)

// ログイン状態をチェックするファイルを読み込む
require_once __DIR__ . '/session_check.php'; 

// ログイン中のユーザーIDを取得
$user_id = check_login_status();
if (!$user_id) {
    // check_login_statusがfalseを返した場合（通常は中でexitするが念のため）
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// レスポンスの形式をJSONに設定
header('Content-Type: application/json; charset=UTF-8');

// POSTリクエスト以外は受け付けない
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST request required.']);
    exit;
}

// POSTデータを受け取る
$age = $_POST['age'] ?? null;
$sex = $_POST['sex'] ?? null;
$residence = $_POST['residence'] ?? null;

// 簡単なバリデーション
if (!$age || !$sex || !$residence) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required.']);
    exit;
}

// データベースに接続
$conn = get_db_connection();

// データをDBに挿入
$stmt = $conn->prepare(
    "INSERT INTO initial_survey_answers (user_id, age, sex, residence) VALUES (?, ?, ?, ?)"
);
$stmt->bind_param("ssss", $user_id, $age, $sex, $residence);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Survey submitted successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Database insert failed.']);
}

$stmt->close();
$conn->close();
?>