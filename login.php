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

// レートリミットのロジック
$ip_address = $_SERVER['REMOTE_ADDR'];
$failure_check_stmt = $conn->prepare(
    "SELECT COUNT(*) as failure_count FROM login_failures WHERE ip_address = ? AND attempt_time > (NOW() - INTERVAL 5 MINUTE)"
);
$failure_check_stmt->bind_param("s", $ip_address);
$failure_check_stmt->execute();
$result = $failure_check_stmt->get_result();
$failures = $result->fetch_assoc();
$failure_check_stmt->close();

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
        echo json_encode(['errors' => 'メールアドレスまたはパスワードが正しくありません。']);
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
            $delete_stmt = $conn->prepare("DELETE FROM login_failures WHERE ip_address = ?");
            $delete_stmt->bind_param("s", $ip_address);
            $delete_stmt->execute();
            $delete_stmt->close();

            $session_id = Ramsey\Uuid\Uuid::uuid4()->toString();
            $user_id = $user['id'];
            $expires_at_db = date('Y-m-d H:i:s', time() + (60 * 60 * 24 * 30));

            $session_stmt = $conn->prepare("INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?)");
            $session_stmt->bind_param("sss", $session_id, $user_id, $expires_at_db);
            $session_stmt->execute();
            $session_stmt->close();

            // ユーザーの獲得済みスタンプIDと取得日時を取得
            $stamp_stmt = $conn->prepare("SELECT stamp_id, acquired_at FROM stamps WHERE uuid = ?");
            $stamp_stmt->bind_param("s", $user_id);
            $stamp_stmt->execute();
            $result = $stamp_stmt->get_result();

            $acquired_stamps = [];
            while ($row = $result->fetch_assoc()) {
                $stamp_key = 'stamp' . $row['stamp_id'];
                $formatted_date = date('Y/n/j H:i:s', strtotime($row['acquired_at']));
                $acquired_stamps[$stamp_key] = ['date' => $formatted_date];
            }
            $stamp_stmt->close();

            // セッションIDと獲得済みスタンプリストをJSONに含めて返す
            http_response_code(200);
            echo json_encode([
                'message' => 'Login successful.',
                'session_id' => $session_id,
                'acquired_stamps' => $acquired_stamps
            ]);

        } else {
            // パスワード失敗時の処理
            $insert_stmt = $conn->prepare("INSERT INTO login_failures (ip_address, attempt_time) VALUES (?, NOW())");
            $insert_stmt->bind_param("s", $ip_address);
            $insert_stmt->execute();
            $insert_stmt->close();

            http_response_code(401);
            echo json_encode(['error' => 'メールアドレスまたはパスワードが正しくありません。']);
        }
    } else {
        // ユーザーが存在しない場合の処理
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