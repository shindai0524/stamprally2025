// alert.js または home.js 内
function recordAlertsToServer(alertsArray) {
  if (!Array.isArray(alertsArray) || alertsArray.length === 0) return;

  const sessionId = localStorage.getItem("session_id"); // または sessionStorage
  if (!sessionId) {
    console.error("セッションIDが見つかりません。ログインしてください。");
    return;
  }

  fetch("php/record_alert.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + sessionId  // ← ここが重要！
    },
    body: JSON.stringify({ alerts: alertsArray })
  })
    .then(res => res.json())
    .then(result => {
      if (!result.success) {
        console.error("サーバーへのalert登録失敗:", result.error);
      } else {
        console.log("登録成功:", result.inserted);
      }
    })
    .catch(error => {
      console.error("通信エラー:", error);
    });
}


function recordAlertToServer(alertType) {
  recordAlertsToServer([alertType]);
}
