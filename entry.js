window.onload = function () {
  const fields = ["name", "tel", "zip", "address", "email"];

  // 入力フィールドの初期化と保存
  fields.forEach(id => {
    const input = document.getElementById(id);
    const value = localStorage.getItem(id) || "";
    input.value = value;

    input.addEventListener("input", () => {
      localStorage.setItem(id, input.value);
    });
  });

  const unlockedPrizes = JSON.parse(localStorage.getItem("unlockedPrizes") || "{}");
  const appliedList = JSON.parse(localStorage.getItem("appliedProducts") || "[]");

  // 応募ボタンの状態を設定
  document.querySelectorAll(".entry-button").forEach(btn => {
    const type = btn.dataset.prize;

    if (!unlockedPrizes[type]) {
      btn.disabled = true;
      btn.style.opacity = 0.5;
      btn.style.pointerEvents = "none";
    }

    if (appliedList.includes(type)) {
      btn.disabled = true;
      btn.innerHTML = '<img src="/image/applied.png" alt="応募済み" style=" width:140px; height:auto;">';
      btn.classList.add("disabled");
    }

    btn.addEventListener("click", () => {
      // 入力チェック
      for (let id of fields) {
        const value = document.getElementById(id).value.trim();
        if (!value) {
          alert("すべての個人情報を入力してください。");
          return;
        }
      }

      // 念のため eligibility チェックも残す
      if (!unlockedPrizes[type]) {
        alert("この景品には応募できません。");
        return;
      }

      if (appliedList.includes(type)) {
        alert("この景品にはすでに応募済みです。");
        return;
      }

      const sessionId = localStorage.getItem("session_id");
      if (!sessionId) {
        alert("ログインしていません。ログイン後に再度お試しください。");
        return;
      }

      const entryData = {
        name: document.getElementById("name").value,
        tel: document.getElementById("tel").value,
        zip: document.getElementById("zip").value,
        address: document.getElementById("address").value,
        email: document.getElementById("email").value,
        prize_type: type
      };

      fetch("php/record_entry.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + sessionId
        },
        body: JSON.stringify(entryData)
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          appliedList.push(type);
          localStorage.setItem("appliedProducts", JSON.stringify(appliedList));

          // サーバーからアンケート表示フラグがtrueで返ってきたかチェック
          if (result.show_participation_survey === true) {
              // trueなら、localStorageに目印を保存
              localStorage.setItem('show_participation_survey', 'true');
          }

          let prizeName = "";
          switch (type) {
            case "participation": prizeName = "参加賞"; break;
            case "b": prizeName = "抽選賞B"; break;
            case "a": prizeName = "抽選賞A"; break;
            case "special": prizeName = "特賞（登別温泉宿泊券）"; break;
          }

          localStorage.setItem("appliedProduct", prizeName);
          localStorage.setItem("appliedPrizeType", type);

          window.location.href = "entry_complete.html";
        } else {
          alert("サーバーへの応募登録に失敗しました: " + result.error);
        }
      })
      .catch(error => {
        console.error("応募送信エラー:", error);
        alert("応募情報の送信中にエラーが発生しました。");
      });
    });
  });
};
