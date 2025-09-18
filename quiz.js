// --- ハッシュ → ID 対応マップ（本番では48個すべて登録してください） ---
const hashToIdMap = {
  "onista_g7f2": 1,
  "onista_m9a1": 2,
  "onista_b3k4": 3,
  "onista_x0d5": 4,
  "onista_q1n8": 5,
  "onista_l6e3": 6,
  "onista_z2c7": 7,
  "onista_h5t9": 8,
  "onista_v8b2": 9,
  "onista_j4r6": 10,
  "onista_y3w1": 11,
  "onista_s6u8": 12,
  "onista_d7p0": 13,
  "onista_k1q9": 14,
  "onista_r9y4": 15,
  "onista_n2z6": 16,
  "onista_t0m3": 17,
  "onista_e5a7": 18,
  "onista_f3x8": 19,
  "onista_a9l0": 20,
  "onista_w7e2": 21,
  "onista_c8d1": 22,
  "onista_u6v9": 23,
  "onista_o4g3": 24,
  "onista_p3b7": 25,
  "onista_i2t6": 26,
  "onista_v1z9": 27,
  "onista_h8q5": 28,
  "onista_j6s0": 29,
  "onista_k5n2": 30,
  "onista_m3x7": 31,
  "onista_n1c4": 32,
  "onista_b0r6": 33,
  "onista_y9d8": 34,
  "onista_a3f2": 35,
  "onista_s4l9": 36,
  "onista_t5w0": 37,
  "onista_z6p3": 38,
  "onista_q7g4": 39,
  "onista_x8v1": 40,
  "onista_d2k7": 41,
  "onista_e4m5": 42,
  "onista_c9b6": 43,
  "onista_l0t8": 44,
  "onista_u2z1": 45,
  "onista_f1n3": 46,
  "onista_r6a0": 47,
  "onista_o5x2": 48
};


// --- クイズ問題リスト（例） ---
      const questions = [
      // yakisoba (1〜19)
      { id: 1, course: "yakisoba", question: "登別閻魔やきそばの会と㈱わかさいも本舗のコラボレーションにより誕生したお土産にぴったりなオリジナル商品「登別閻魔〇〇」。〇〇に入るのは？", options: ["せんべい", "まんじゅう", "だんご"], answer: 0 },
      { id: 2, course: "yakisoba", question: "登別閻魔やきそばの掟その２「閻魔大王指定の〇〇を使え」。〇〇に入るのは？", options: ["ソース", "コショウ", "タレ"], answer: 2 },
      { id: 3, course: "yakisoba", question: "令和7年4月時点で、登別市内で登別閻魔やきそばを提供している店舗は何店舗？", options: ["13", "23", "33"], answer: 1 },
      { id: 4, course: "yakisoba", question: "令和7年4月時点で、登別市内で登別閻魔やきそばを提供している店舗は何店舗？", options: ["13", "23", "33"], answer: 1 },
      { id: 5, course: "yakisoba", question: "登別閻魔やきそばの掟その３「〇〇産または〇〇近郊の食材を使え」。〇〇に入るのは？", options: ["登別", "日本", "太平洋"], answer: 0 },
      { id: 6, course: "yakisoba", question: "登別閻魔やきそばを提供するしない飲食店等で組織された団体を何という？", options: ["登別閻魔やきそば団", "チーム登別閻魔やきそば", "登別閻魔やきそばの会"], answer: 2 },
      { id: 7, course: "yakisoba", question: "登別閻魔やきそばの掟その１「北海道産小麦の〇〇を使え」。〇〇に入るのは？", options: ["太麺", "平麵", "ちぢれ麺"], answer: 1 },
      { id: 8, course: "yakisoba", question: "登別まちづくり㈱と㈱望月製麺所が共同開発した登別閻魔やきそばに相性バツグンのラー油「えんまの〇〇」。〇〇に入るのは？", options: ["なみだ", "汗", "あぶら"], answer: 0 },
      { id: 9, course: "yakisoba", question: "登別閻魔やきそばの掟その２「閻魔大王指定の〇〇を使え」。〇〇に入るのは？", options: ["ソース", "コショウ", "タレ"], answer: 2 },
      { id: 10, course: "yakisoba", question: "北の湯の国、登別の地にある地獄谷に住む閻魔様が大好物のご当地グルメ「登別〇〇やきそば」。〇〇に入るのは？", options: ["地獄", "閻魔", "温泉"], answer: 1 },
      { id: 11, course: "yakisoba", question: "登別まちづくり㈱と㈱望月製麺所が共同開発した登別閻魔やきそばに相性バツグンのラー油「えんまの〇〇」。〇〇に入るのは？", options: ["なみだ", "汗", "あぶら"], answer: 0 },
      { id: 12, course: "yakisoba", question: "登別閻魔やきそばが開発され、登別市内飲食店等で提供されたのは何年？", options: ["平成17年", "平成27年", "令和7年"], answer: 1 },
      { id: 13, course: "yakisoba", question: "登別閻魔やきそばの掟その１「北海道産小麦の〇〇を使え」。〇〇に入るのは？", options: ["太麺", "平麵", "ちぢれ麺"], answer: 1 },
      { id: 14, course: "yakisoba", question: "登別閻魔やきそばの掟その３「〇〇産または〇〇近郊の食材を使え」。〇〇に入るのは？", options: ["登別", "日本", "太平洋"], answer: 0 },
      { id: 15, course: "yakisoba", question: "登別閻魔やきそばのモチーフである“閻魔様”が見られる場所は？", options: ["JR登別駅前", "登別伊達時代村", "登別温泉の閻魔堂（えんまどう）"], answer: 2 },
      { id: 16, course: "yakisoba", question: "登別閻魔やきそばの会と㈱わかさいも本舗のコラボレーションにより誕生したお土産にぴったりなオリジナル商品「登別閻魔〇〇」。〇〇に入るのは？", options: ["せんべい", "まんじゅう", "だんご"], answer: 0 },
      { id: 17, course: "yakisoba", question: "登別閻魔やきそばが開発され、登別市内飲食店等で提供されたのは何年？", options: ["平成17年", "平成27年", "令和7年"], answer: 1 },
      { id: 18, course: "yakisoba", question: "登別閻魔やきそばのモチーフである“閻魔様”が見られる場所は？", options: ["JR登別駅前", "登別伊達時代村", "登別温泉の閻魔堂（えんまどう）"], answer: 2 },
      { id: 19, course: "yakisoba", question: "北の湯の国、登別の地にある地獄谷に住む閻魔様が大好物のご当地グルメ「登別〇〇やきそば」。〇〇に入るのは？", options: ["地獄", "閻魔", "温泉"], answer: 1 },

      // brand (20〜36)
      { id: 20, course: "brand", question: "温泉市場で製造されている登別ブランド推奨品の商品名はどれ？", options: ["北海大だこ地獄", "北海大えび地獄漬", "北海大まぐろ地獄漬"], answer: 0 },
      { id: 21, course: "brand", question: "祝いの宿　登別グランドホテルで製造されている登別ブランド推奨品の商品名はどれ？", options: ["手づくりパンケーキ", "手づくりバウムクーヘン", "手づくりアップルパイ"], answer: 1 },
      { id: 22, course: "brand", question: "大黒屋民芸店で製造されている登別ブランド推奨品の商品名はどれ？", options: ["湯の香ひょうたん大福", "湯の香ひょうたんせんべい", "湯の香ひょうたん飴"], answer: 2 },
      { id: 23, course: "brand", question: "Pizzeria ASTRAで製造されている登別ブランド推奨品の商品名はどれ？", options: ["究極のマリナーラ", "究極のビアンカ", "究極のマルゲリータ"], answer: 2 },
      { id: 24, course: "brand", question: "藤崎わさび園で製造されている登別ブランド推奨品の商品名はどれ？", options: ["わさび漬", "わさび和え", "わさび海苔"], answer: 0 },
      { id: 25, course: "brand", question: "㈱のぼりべつ酪農館で製造されている登別ブランド推奨品の商品名はどれ？", options: ["のぼりべつなめらかプリン", "のぼりべつぷるぷるプリン", "のぼりべつとろ～りプリン"], answer: 2 },
      { id: 26, course: "brand", question: "㈲マルフク武澤水産で製造されている登別ブランド推奨品の商品名はどれ？", options: ["らんぼっけのたらこ", "らんぼっけのすじこ", "らんぼっけのいくら"], answer: 0 },
      { id: 27, course: "brand", question: "㈲肉のあさひで製造されている登別ブランド推奨品の商品名はどれ？", options: ["登別牛ジン", "登別豚ジン", "登別鹿ジン"], answer: 1 },
      { id: 28, course: "brand", question: "㈱わかさいも本舗で製造されている登別ブランド推奨品の商品名はどれ？", options: ["鬼伝説　赤鬼ワイン", "鬼伝説　赤鬼レッドエール", "鬼伝説　赤鬼サワー"], answer: 1 },
      { id: 29, course: "brand", question: "令和７年４月時点の登別ブランド推奨品認定数は？？", options: ["21", "31", "41"], answer: 1 },
      { id: 30, course: "brand", question: "㈱望月製麺所で製造されている登別ブランド推奨品の商品名はどれ？", options: ["登別地獄らーめん", "登別閻魔らーめん", "登別温泉らーめん"], answer: 1 },
      { id: 31, course: "brand", question: "㈲かめやで製造されている登別ブランド推奨品の商品名はどれ？", options: ["登別牛乳カステラ", "登別牛乳パイ", "登別牛乳ロールケーキ"], answer: 0 },
      { id: 32, course: "brand", question: "登別の豊かな自然や文化から生み出される製品の中でも、特に優れた製品を登別ブランド推進協議会が認定したものを「登別ブランド〇〇〇」という。〇〇〇に入るのは？", options: ["認定品", "推奨品", "優良品"], answer: 1 },
      { id: 33, course: "brand", question: "道南平塚食品㈱で製造されている登別ブランド推奨品の商品名はどれ？", options: ["文吉の鹿角納豆", "文志朗の鹿角納豆", "文之介の鹿角納豆"], answer: 1 },
      { id: 34, course: "brand", question: "㈱わかさいも本舗で製造されている登別ブランド推奨品の商品名はどれ？", options: ["鬼伝説　青鬼ピルスナー", "鬼伝説　青鬼ハイボール", "鬼伝説　青鬼サワー"], answer: 0 },
      { id: 35, course: "brand", question: "㈲かめやで製造されている登別ブランド推奨品の商品名はどれ？", options: ["ノボール", "のぼ～る", "NOBO～る"], answer: 1 },
      { id: 36, course: "brand", question: "㈱冷鮮工房うす田で製造されている登別ブランド推奨品の商品名はどれ？", options: ["のぼりべつアワビ燻", "のぼりべつホッキ燻", "のぼりべつホタテ燻"], answer: 2 },

      // ainu (37〜48)
      { id: 37, course: "ainu", question: "アイヌ語で「クマ（熊）」はなんという？", options: ["キムンカムイ", "ホロケウカムイ", "セタカムイ"], answer: 0 },
      { id: 38, course: "ainu", question: "アイヌ語で「クジラ（鯨）」はなんという？", options: ["エサマン", "フンぺ", "エタシペ"], answer: 1 },
      { id: 39, course: "ainu", question: "アイヌ語で「銀」はなんという？", options: ["コンカニ", "フレカニ", "シロカニ"], answer: 2 },
      { id: 40, course: "ainu", question: "アイヌ語で「シカ（鹿）」はなんという？", options: ["チロンヌプ", "ユク", "イセポ"], answer: 1 },
      { id: 41, course: "ainu", question: "アイヌ語で「シマフクロウ」はなんという？", options: ["パシクル", "コタンコロカムイ", "サロルンチリ"], answer: 1 },
      { id: 42, course: "ainu", question: "アイヌ語で「ネコ（猫）」はなんという？", options: ["エルム", "モユク", "チャペ"], answer: 2 },
      { id: 43, course: "ainu", question: "アイヌ語で「サケ（鮭）」はなんという？", options: ["カムイチェプ", "スサム", "ユペ"], answer: 0 },
      { id: 44, course: "ainu", question: "アイヌ語で「森」はなんという？", options: ["キナ", "ニタイ", "ノンノ"], answer: 1 },
      { id: 45, course: "ainu", question: "アイヌ語で「山」はなんという？", options: ["ウパシ", "シララ", "ヌプリ"], answer: 2 },
      { id: 46, course: "ainu", question: "アイヌ語で「海」はなんという？", options: ["アトゥイ", "ペッ", "ト"], answer: 0 },
      { id: 47, course: "ainu", question: "アイヌ語で「村」はなんという？", options: ["モシリ", "コタン", "ウタリ"], answer: 1 },
      { id: 48, course: "ainu", question: "アイヌ語で「夏」はなんという？", options: ["パイカラ", "マタ", "サク"], answer: 2 }
    ];

// =========================
// セッション確認（未ログインなら注意ページ）
// =========================
// =========================
// セッション確認（未ログインなら注意ページ）
// =========================
window.addEventListener("DOMContentLoaded", () => {
  const sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    window.location.href = "https://stamp.onista-noboribetsu.com";
  }
});

// --- 要素 ---
let quizQuestion, quizOptions, quizSection, correctSection, wrongSection;
let backHomeBtn, backHomeOKBtn;
let question = null;

// ★ 共通：ホーム戻りボタンに配線する関数
function wireHomeButtons(course) {
  const btns = [backHomeBtn, backHomeOKBtn].filter(Boolean);
  btns.forEach(btn => {
    btn.setAttribute("type", "button");
    btn.onclick = (e) => {
      e.preventDefault();
      goHome(course);
    };
    btn.classList.remove("hidden");
  });
}

// =========================
// 初期化
// =========================
document.addEventListener("DOMContentLoaded", () => {
  quizQuestion   = document.getElementById("quizQuestion");
  quizOptions    = document.getElementById("quizOptions");
  quizSection    = document.getElementById("quizSection");
  correctSection = document.getElementById("correctSection");
  wrongSection   = document.getElementById("wrongSection");

  backHomeOKBtn  = document.getElementById("goHomeFromCorrect");

  // クエリから id → 質問
  const params   = new URLSearchParams(window.location.search);
  const quizHash = params.get("id");
  const quizId   = hashToIdMap[quizHash];
  question       = questions.find(q => q.id === quizId);

  console.log("quizHash:", quizHash, "quizId:", quizId, "question:", question);

  // ID不明
  if (!question) {
    if (quizQuestion) {
      quizQuestion.innerHTML = `<p>このIDに対応する問題はありません。</p>`;
    }
    document.getElementById("quizExtraButtons").innerHTML =
      `<button id="backHomeBtn" class="back-home-btn"></button>`;
    backHomeBtn = document.getElementById("backHomeBtn");
    wireHomeButtons("yakisoba"); // デフォルト
    return;
  }

  // 既に獲得済み？
  const stampKey = `stamp${question.id}`;
  const obtained = JSON.parse(localStorage.getItem("obtainedStamps")) || {};
  if (obtained[stampKey]) {
    if (quizSection) {
      quizSection.innerHTML = `<h2>${getResultMessage(question.id, true)}（獲得済み）</h2>`;
    }
    document.getElementById("quizExtraButtons").innerHTML =
      `<button id="backHomeBtn" class="back-home-btn"></button>`;
    backHomeBtn = document.getElementById("backHomeBtn");
    wireHomeButtons(question.course);
    return;
  }

  // 問題表示
  if (quizQuestion) quizQuestion.textContent = question.question;
  if (quizOptions) {
    quizOptions.innerHTML = "";
    question.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.className = "choice";
      btn.type = "button";
      btn.addEventListener("click", () => checkAnswer(index));
      quizOptions.appendChild(btn);
    });
  }
});

// =========================
// 回答チェック
// =========================
function checkAnswer(selected) {
  if (!question) return;

  if (selected === question.answer) {
    const sessionId = localStorage.getItem("session_id");
    fetch("php/record_stamp.php", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + sessionId },
      body: JSON.stringify({ stamp_id: question.id })
    })
    .then(r => r.json())
    .then(result => {
      if (!result.success) {
        alert("データベースへの記録に失敗しました: " + result.error);
        return;
      }

      // ローカル保存
      const obtained = JSON.parse(localStorage.getItem("obtainedStamps")) || {};
      obtained[`stamp${question.id}`] = {
        date: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
      };
      localStorage.setItem("obtainedStamps", JSON.stringify(obtained));

      // UI 切替
      document.querySelector(".question-icon")?.style && (document.querySelector(".question-icon").style.display = "none");
      document.querySelector(".quiz-container")?.style && (document.querySelector(".quiz-container").style.backgroundImage = "none");
      quizSection?.classList.add("hidden");
      quizOptions?.classList.add("hidden");

      // ★ messages.js の関数を利用
      const okH3 = document.getElementById("correctMessage");
      if (okH3) {
        okH3.textContent = getResultMessage(question.id, true);
      }

      // スタンプ画像（範囲を明確化）
      const correctImg = document.getElementById("correctStampImg");
      if (correctImg) {
        if (question.id >= 1 && question.id <= 19) {
          correctImg.src = "/image/get_stamp_yakisoba.png";
        } else if (question.id >= 20 && question.id <= 36) {
          correctImg.src = "/image/get_stamp_ainu.png";
        } else if (question.id >= 37 && question.id <= 48) {
          correctImg.src = "/image/get_stamp_brand.png";
        }
      }

      // 表示
      correctSection?.classList.remove("hidden");

      // 正解画面の戻るボタン
      wireHomeButtons(question.course);
    })
    .catch(err => {
      console.error(err);
      alert("サーバーとの通信中にエラーが発生しました。");
    });

  } else {
    // 不正解画面
    document.querySelector(".question-icon")?.style && (document.querySelector(".question-icon").style.display = "none");
    document.querySelector(".quiz-container")?.style && (document.querySelector(".quiz-container").style.backgroundImage = "none");
    quizSection?.classList.add("hidden");
    quizOptions?.classList.add("hidden");

    // ★ 不正解メッセージも messages.js から
    const ngH3 = document.querySelector("#wrongSection h3");
    if (ngH3) {
      ngH3.textContent = getResultMessage(question.id, false);
    }

    wrongSection?.classList.remove("hidden");
  }
}

// =========================
// 再挑戦
// =========================
function retryQuiz() {
  wrongSection?.classList.add("hidden");
  quizSection?.classList.remove("hidden");
  quizOptions?.classList.remove("hidden");
  document.querySelector(".question-icon")?.style && (document.querySelector(".question-icon").style.display = "block");
  const qc = document.querySelector(".quiz-container");
  if (qc) qc.style.backgroundImage = "url('image/quiz_text.png')";
}

function goHome(course) {
  let tab = "";
  switch (course) {
    case "yakisoba": tab = "yakisoba"; break;
    case "brand":    tab = "brand";    break;
    case "ainu":     tab = "ainu";     break;
    default:         tab = "";         break;
  }
  if (tab) {
    window.location.href = `home.php?tab=${tab}`;
  } else {
    window.location.href = "home.php";
  }
}
