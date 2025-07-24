window.onload = function () {
  const fields = ["name", "tel", "zip", "address", "email"];
  fields.forEach(id => {
    const input = document.getElementById(id);
    input.value = localStorage.getItem(id) || "";
    input.addEventListener("input", () => {
      localStorage.setItem(id, input.value);
    });
  });

  const getStampCounts = () => {
    const stored = JSON.parse(localStorage.getItem("stampList") || "{}");
    let countYakisobaOrBrand = 0;
    let countAinu = 0;
    let total = 0;

    for (let id in stored) {
      if (stored[id].obtained) {
        const numId = parseInt(id.replace("stamp", ""));
        total++;
        if (numId >= 1 && numId <= 19) countYakisobaOrBrand++;
        else if (numId >= 20 && numId <= 36) countYakisobaOrBrand++;
        else if (numId >= 37 && numId <= 48) countAinu++;
      }
    }

    return { countYakisobaOrBrand, countAinu, total };
  };

  const checkEligibility = (type) => {
    const { countYakisobaOrBrand, countAinu, total } = getStampCounts();

    switch (type) {
      case "participation":
        return countYakisobaOrBrand >= 2 && countAinu >= 1;
      case "b":
        return countYakisobaOrBrand >= 2 && countAinu >= 2;
      case "a":
        return countYakisobaOrBrand >= 3 && countAinu >= 3;
      case "special":
        return countYakisobaOrBrand >= 2 && countAinu >= 1 && total >= 9;
      default:
        return false;
    }
  };

  document.querySelectorAll(".entry-button").forEach(btn => {
    const type = btn.dataset.prize;
    if (!checkEligibility(type)) {
      btn.disabled = true;
    }

    btn.addEventListener("click", () => {
      alert(`「${btn.parentElement.querySelector("h3").innerText}」に応募しました！`);
    });
  });
};
