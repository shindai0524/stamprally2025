window.onload = function () {
  const unlockedPrizes = JSON.parse(localStorage.getItem("unlockedPrizes") || "{}");
  const appliedList = JSON.parse(localStorage.getItem("appliedProducts") || "[]");

  // 応募状態を反映するだけ（クリックしても何もしない）
  document.querySelectorAll(".entry-button").forEach(btn => {
    const type = btn.dataset.prize;

    // 応募条件を満たしていない場合
    if (!unlockedPrizes[type]) {
      btn.disabled = true;
      btn.style.opacity = 0.5;
      btn.style.pointerEvents = "none";
    }

    // 応募済みの場合
    if (appliedList.includes(type)) {
      btn.disabled = true;
      btn.innerHTML = '<img src="/image/applied.png" alt="応募済み" style="width:140px; height:auto;">';
      btn.classList.add("disabled");
    }

    // 👇クリックは無効化（何もしない）
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      alert("このページでは景品の確認のみ可能です。");
    });
  });
};
