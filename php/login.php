<?php
// login.php (最終修正版)

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../app_files/config.php';
require_once __DIR__ . '/../../app_files/vendor/autoload.php';
require_once __DIR__ . '/../../app_files/validation.php';
require_once __DIR__ . '/../../app_files/db.php'; 

$conn = get_db_connection();

$ip_address = $_SERVER['REMOTE_ADDR'];
$failure_check_stmt = $conn->prepare(
    "SELECT COUNT(*) as failure_count FROM login_failures WHERE ip_address = ? AND attempt_time > (NOW() - INTERVAL 5 MINUTE)"
);
$failure_check_stmt->bind_param("s", $ip_address);
$failure_check_stmt->execute();
$result = $failure_check_stmt->get_result();
$failures = $result->fetch_assoc();
$failure_check_stmt->close();

// レートリミットが必要な場合はコメントアウト解除
/*
if ($failures['failure_count'] >= 5) {
    header("Content-Type: application/json; charset=UTF-8");
    http_response_code(429);
    echo json_encode(['error' => '試行回数が多すぎます。5分後に再度お試しください。']);
    $conn->close();
    exit;
}
*/

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    header("Content-Type: application/json; charset=UTF-8");

    $errors = validation($_POST, false, $conn);

    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['errors' => $errors]);
        $conn->close(); 
        exit;
    }

    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT id, email, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $email_db, $password_hash);
        $stmt->fetch();

        $user = [
            'id' => $id,
            'email' => $email_db,
            'password' => $password_hash
        ];

        if (password_verify($password, $user['password'])) {
            // 成功時
            $delete_stmt = $conn->prepare("DELETE FROM login_failures WHERE ip_address = ?");
            $delete_stmt->bind_param("s", $ip_address);
            $delete_stmt->execute();
            $delete_stmt->close();

            $session_id = Ramsey\Uuid\Uuid::uuid4()->toString();
            $user_id = $user['id'];
            $expires_at_db = date('Y-m-d H:i:s', strtotime('+2 months +15 days'));

            $session_stmt = $conn->prepare("INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?)");
            $session_stmt->bind_param("sss", $session_id, $user_id, $expires_at_db);
            $session_stmt->execute();
            $session_stmt->close();

            // ① stampsテーブル取得（スタンプ情報）
            $stamp_stmt = $conn->prepare("SELECT stamp_id, acquired_at FROM stamps WHERE uuid = ?");
            $stamp_stmt->bind_param("s", $user_id);
            $stamp_stmt->execute();
            $result = $stamp_stmt->get_result();

            $acquired_stamps = [];
            while ($row = $result->fetch_assoc()) {
                $acquired_stamps[] = [
                    'stamp_id' => $row['stamp_id'],
                    'acquired_at' => date('Y/n/j H:i:s', strtotime($row['acquired_at']))
                ];
            }
            $stamp_stmt->close();

            // ② formsテーブル取得（応募情報）
            $form_stmt = $conn->prepare("SELECT name, tel, zip, address, email, prize_type FROM forms WHERE uuid = ?");
            $form_stmt->bind_param("s", $user_id);
            $form_stmt->execute();
            $result = $form_stmt->get_result();

            $user_info = [
                'name' => '',
                'tel' => '',
                'zip' => '',
                'address' => '',
                'email' => '',
                'appliedProducts' => []
            ];

            while ($row = $result->fetch_assoc()) {
                // 最初の応募データの情報でユーザー情報を埋める（上書きしない）
                if (empty($user_info['name'])) {
                    $user_info['name'] = $row['name'];
                    $user_info['tel'] = $row['tel'];
                    $user_info['zip'] = $row['zip'];
                    $user_info['address'] = $row['address'];
                    $user_info['email'] = $row['email'];
                }
                $user_info['appliedProducts'][] = $row['prize_type'];
            }
            $form_stmt->close();

            // ③ alertテーブル取得（表示済みアラート）
            $alert_stmt = $conn->prepare("SELECT alert FROM alert WHERE uuid = ?");
            $alert_stmt->bind_param("s", $user_id);
            $alert_stmt->execute();
            $result = $alert_stmt->get_result();

            $unlockedPrizes = [
                'participation' => false,
                'b' => false,
                'a' => false,
                'special' => false
            ];

            while ($row = $result->fetch_assoc()) {
                $alert_key = $row['alert'];
                if (array_key_exists($alert_key, $unlockedPrizes)) {
                    $unlockedPrizes[$alert_key] = true;
                }
            }

            $alert_stmt->close();

            // --- 初回アンケートのチェック ---
            $survey_check_stmt = $conn->prepare("SELECT COUNT(*) as count FROM initial_survey_answers WHERE user_id = ?");
            $survey_check_stmt->bind_param("s", $user_id);
            $survey_check_stmt->execute();
            $survey_result = $survey_check_stmt->get_result()->fetch_assoc();
            $survey_check_stmt->close();

            // 回答記録がなければ($countが0なら)、フラグをtrueにする
            $show_survey = ($survey_result['count'] === 0);

            // レスポンス送信
            http_response_code(200);
            echo json_encode([
                'message' => 'Login successful.',
                'session_id' => $session_id,
                'acquired_stamps' => $acquired_stamps,
                'user_info' => $user_info,
                'unlockedPrizes' => $unlockedPrizes,
                'show_survey' => $show_survey
            ]);
        } else {
            // パスワード不一致
            $insert_stmt = $conn->prepare("INSERT INTO login_failures (ip_address, attempt_time) VALUES (?, NOW())");
            $insert_stmt->bind_param("s", $ip_address);
            $insert_stmt->execute();
            $insert_stmt->close();

            http_response_code(401);
            echo json_encode(['error' => 'メールアドレスまたはパスワードが正しくありません。']);
        }
    } else {
        // ユーザーが見つからない場合
        $insert_stmt = $conn->prepare("INSERT INTO login_failures (ip_address, attempt_time) VALUES (?, NOW())");
        $insert_stmt->bind_param("s", $ip_address);
        $insert_stmt->execute();
        $insert_stmt->close();
        
        http_response_code(401);
        echo json_encode(['error' => 'メールアドレスまたはパスワードが正しくありません。']);
    }

    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
    exit;
}
?>