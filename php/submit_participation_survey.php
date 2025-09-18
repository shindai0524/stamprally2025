<?php
// php/submit_participation_survey.php

require_once __DIR__ . '/session_check.php'; 

$user_id = check_login_status();
if (!$user_id) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST request required.']);
    exit;
}

// 新しいアンケートのPOSTデータを受け取る
$know_method = $_POST['know_method'] ?? null;
// ▼▼▼ この行を修正 ▼▼▼
$knew_is_not_is_yakisoba = $_POST['knew_is_not_is_yakisoba'] ?? null; 
$knew_is_not_brand = $_POST['knew_is_not_brand'] ?? null;
$think_is_not_is = $_POST['think_is_not_is'] ?? null;
$know_can_be_is_not_is = $_POST['know_can_be_is_not_is'] ?? null;

// バリデーション
if (!$know_method || !$knew_is_not_is_yakisoba || !$knew_is_not_brand || !$think_is_not_is || !$know_can_be_is_not_is) { 
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required.']);
    exit;
}

$conn = get_db_connection();

// 新しいテーブルに、新しいデータを挿入
$stmt = $conn->prepare(
    "INSERT INTO participation_survey_answers (user_id, know_method, knew_is_not_is_yakisoba, knew_is_not_brand, think_is_not_is, know_can_be_is_not_is) VALUES (?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param("ssssss", $user_id, $know_method, $knew_is_not_is_yakisoba, $knew_is_not_brand, $think_is_not_is, $know_can_be_is_not_is);

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