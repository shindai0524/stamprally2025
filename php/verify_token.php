<?php
// validation.php

function validation($datas, $confirm = true, $conn = null)
{
    $errors = [];

    if (empty($datas['email'])) {
        $errors['email'] = 'メールアドレスを入力してください。';
    } else if (!filter_var($datas['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = '正しいメールアドレスの形式で入力してください。';
    }
    
    if ($conn && empty($errors['email'])) {
        try {
            // ★★★ 修正点: カラム名を username から email に変更 ★★★
            $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->bind_param("s", $datas['email']);
            $stmt->execute();
            $stmt->store_result();
            if ($stmt->num_rows > 0) {
                if ($confirm) {
                    $errors['email'] = 'このメールアドレスは既に使用されています。';
                }
            }
            $stmt->close();
        } catch (Exception $e) {
            $errors['db'] = 'データベースエラーが発生しました。';
        }
    }

    if (empty($datas["password"])) {
        $errors['password']  = "パスワードを入力してください。";
    } else if (!preg_match('/\A[a-z\d]{8,100}\z/i', $datas["password"])) {
        $errors['password'] = "8文字以上の半角英数字でパスワードを設定してください。";
    }

    if ($confirm) {
        if (empty($datas["confirm_password"])) {
            $errors['confirm_password']  = "確認用パスワードを入力してください。";
        } else if (empty($errors['password']) && ($datas["password"] != $datas["confirm_password"])) {
            $errors['confirm_password'] = "パスワードが一致しません。";
        }
    }
    return $errors;
}
?>