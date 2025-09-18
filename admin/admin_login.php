<?php
session_start();
require_once __DIR__ . '/admin_config.php';

$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($name !== '' && $password !== '') {
        try {
            $pdo = getPDO();

            // ユーザー取得
            $stmt = $pdo->prepare("SELECT * FROM admin_user WHERE name = :name LIMIT 1");
            $stmt->execute([':name' => $name]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                // ログイン成功 → admin_logに記録
                $stmt = $pdo->prepare(
                    "INSERT INTO admin_log (id, usetime, action) VALUES (:id, NOW(), :action)"
                );
                $stmt->execute([
                    ':id' => $user['id'],
                    ':action' => 'login'
                ]);

                // セッションに保存
                $_SESSION['admin_id'] = $user['id'];
                $_SESSION['admin_name'] = $user['name'];

                header("Location: get_csvfile.php");
                exit;
            } else {
                $message = "⚠️ ユーザー名またはパスワードが間違っています。";
            }
        } catch (Exception $e) {
            $message = "⚠️ DB接続エラー: " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8');
        }
    } else {
        $message = "⚠️ ユーザー名とパスワードを入力してください。";
    }
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>管理者ページ</title>
    <link rel="stylesheet" href="admin_login.css">
</head>
<body>
  <div class="login-container">
    <div class="logo">
      <img src="../image/logo.png" alt="Admin ロゴ">
    </div>

    <h1 class="login-title">管理者ページ</h1>

    <?php if ($message): ?>
      <div class="error-message"><?php echo $message; ?></div>
    <?php endif; ?>

    <form method="post" class="login-form">
      <div class="input-wrapper">
        <input type="text" name="name" placeholder="ユーザー名" required>
      </div>
      <div class="input-wrapper">
        <input type="password" name="password" placeholder="パスワード" required>
      </div>
      <button type="submit" class="login-button"></button>

    </form>
  </div>
</body>
</html>
