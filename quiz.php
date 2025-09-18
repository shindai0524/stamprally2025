<?php
// PHPファイルの先頭でセッションを開始します
session_start();

// ログインしているか確認し、していなければログインページへリダイレクト
// $_SESSION['user_uuid'] の部分は、実際のセッションで使っている変数名に置き換えてください
if (!isset($_SESSION['uuid'])) {
    header('Location: login.php'); // ログインページのパス
    exit();
}

// セッションからユーザーのUUIDを取得
$user_uuid = $_SESSION['uuid'];
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  </head>
<body data-uuid="<?php echo htmlspecialchars($user_uuid, ENT_QUOTES, 'UTF-8'); ?>">
  
  <script>
    const questions = [
      // (中略)
    ];

    // (中略: questionやDOM要素の取得)

    // checkAnswer関数を非同期処理(async)に対応させます
    async function checkAnswer(selected) {
      if (selected === question.answer) {
        // localStorageへの保存は残しても問題ありません
        const obtained = JSON.parse(localStorage.getItem("obtainedStamps")) || {};
        obtained[`stamp${question.id}`] = {
          date: new Date().toLocaleString()
        };
        localStorage.setItem("obtainedStamps", JSON.stringify(obtained));

        // ★★★ ここからがデータベース連携処理です ★★★
        
        // 1. ページに埋め込まれたユーザーUUIDを取得
        const userUuid = document.body.dataset.uuid;
        // 2. データベースに保存するためのデータを準備
        const postData = {
          uuid: userUuid,
          stamp_id: question.id
        };

        try {
          // 3. fetch APIを使ってサーバーのPHPファイルにデータを送信
          const response = await fetch('save_stamp.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
          });
          
          // 4. サーバーからの応答をJSON形式で受け取る
          const result = await response.json();

          if (result.success) {
            // 保存に成功したら正解画面を表示
            quizSection.classList.add("hidden");
            correctSection.classList.remove("hidden");
          } else {
            // 保存に失敗した場合のエラー処理
            alert('データベースへの保存に失敗しました: ' + result.message);
          }
        } catch (error) {
          console.error('Error:', error);
          alert('サーバーとの通信中にエラーが発生しました。');
        }
        
      } else {
        quizSection.classList.add("hidden");
        wrongSection.classList.remove("hidden");
      }
    }

    function retryQuiz() {
      // (変更なし)
    }

    function goHome() {
      // (変更なし)
    }
  </script>
</body>
</html>