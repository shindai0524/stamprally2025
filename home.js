// メニュー・ヘルプの表示切り替え
const menuBtn = document.getElementById("menuBtn");
const helpBtn = document.getElementById("helpBtn");
const menuList = document.getElementById("menuList");
const helpList = document.getElementById("helpList");

menuBtn.addEventListener("click", () => {
  menuList.classList.toggle("hidden");
  helpList.classList.add("hidden");
   document.body.classList.add("modal-open"); // ★追加 
});

helpBtn.addEventListener("click", () => {
  helpList.classList.toggle("hidden");
  menuList.classList.add("hidden");
   document.body.classList.add("modal-open"); // ★追加 
});

// メニューを閉じる
document.querySelector('#menuList .close-btn')?.addEventListener('click', () => {
  document.getElementById('menuList')?.classList.add('hidden');
  document.body.classList.remove('modal-open');
});

// ヘルプリストを閉じる
document.querySelector('#helpList .close-btn')?.addEventListener('click', () => {
  document.getElementById('helpList')?.classList.add('hidden');
  document.body.classList.remove('modal-open');
});

// ① タブ切替リスナーをセット（←あなたの現行コード）
document.querySelectorAll("#tabButtons button").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.getAttribute("data-tab");

    // すべてのタブコンテンツを非表示
    document.querySelectorAll(".tab-content").forEach(div => {
      div.classList.add("hidden");
    });
    document.getElementById(`tab-${tab}`).classList.remove("hidden");

    // activeの付け替え
    document.querySelectorAll("#tabButtons button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

function applyInitialTab() {
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab") || "yakisoba";

  // ボタンに data-tab="yakisoba|brand|ainu" が付いている前提
  const targetBtn = document.querySelector(`#tabButtons button[data-tab="${tab}"]`);
  if (targetBtn) {
    targetBtn.click();          // ← 既存のリスナーを使って中身も切替
  } else {
    // 念のためフォールバック
    document.querySelector('#tabButtons button[data-tab="yakisoba"]')?.click();
  }
}


// ===== ヘルプ画像（カテゴリ別） =====
const HELP_IMAGES = {
  home: ["image/home13.png", "image/home23.png", "image/home33.png"],
  qr:   ["image/qr12.png","image/qr22.png"]
};

// ===== ヘルプ表示用の状態 =====
const helpState = {
  category: "home",
  index: 0
};

// ===== 要素参照（ヘルプ専用：他と被らないID） =====
const helpViewerEl  = document.getElementById("helpViewer");     // 新：ページ内ビューア
const helpImgEl     = document.getElementById("helpImage");       // メイン画像
const helpPrevBtnEl = document.getElementById("helpPrevBtn");     // 左矢印（画像ボタン）
const helpNextBtnEl = document.getElementById("helpNextBtn");     // 右矢印（画像ボタン）
const helpCloseEl   = document.getElementById("helpCloseBtn");    // 閉じる（画像ボタン）

// ===== ヘルプを開く（ヘルプリストのボタンから呼ばれる） =====
function openHelp(category) {
  helpState.category = category;
  helpState.index = 0;

  // メニューやヘルプリストは閉じる（存在すれば）
  document.getElementById("menuList")?.classList.add("hidden");
  document.getElementById("helpList")?.classList.add("hidden");

  document.body.classList.add("modal-open"); // ★追加

  // ビューアを表示 & 画像適用
  helpViewerEl?.classList.remove("hidden");
  updateHelpView();
}

// ===== 画像と矢印の表示制御（1枚目は右だけ / 中間は両方 / 最後は左だけ / 1枚なら両方非表示） =====
function updateHelpView() {
  const list = HELP_IMAGES[helpState.category] || [];
  if (!list.length || !helpImgEl) return;

  helpImgEl.src = list[helpState.index];

  if (list.length === 1) {
    helpPrevBtnEl?.classList.add("hidden");
    helpNextBtnEl?.classList.add("hidden");
  } else {
    helpPrevBtnEl?.classList.toggle("hidden", helpState.index === 0);
    helpNextBtnEl?.classList.toggle("hidden", helpState.index === list.length - 1);
  }
}

// ===== 次へ／前へ（ヘルプ専用の関数名にして衝突回避） =====
function gotoNextHelp() {
  const list = HELP_IMAGES[helpState.category] || [];
  if (helpState.index < list.length - 1) {
    helpState.index++;
    updateHelpView();
  }
}
function gotoPrevHelp() {
  if (helpState.index > 0) {
    helpState.index--;
    updateHelpView();
  }
}

// ===== 閉じる（ホームのみ残す。メニューは再表示しない） =====
function closeHelpViewer() {
  helpViewerEl?.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

// ===== イベント付与（他のモーダルと独立） =====
helpPrevBtnEl?.addEventListener("click", gotoPrevHelp);
helpNextBtnEl?.addEventListener("click", gotoNextHelp);
helpCloseEl?.addEventListener("click", closeHelpViewer);

// ===== インライン onclick 用にグローバルへエクスポート（必要な場合のみ） =====
window.openHelp        = openHelp;
window.gotoNextHelp    = gotoNextHelp;
window.gotoPrevHelp    = gotoPrevHelp;
window.closeHelpViewer = closeHelpViewer;


let currentImageIndex = 0;
let currentImages = [];

function showPopup(stamp) {
  currentImages = Array.isArray(stamp.storeImages) ? stamp.storeImages : [];
  currentImageIndex = 0;

  // 1枚だけならナビゲーション非表示
  const prevBtn = document.getElementById("prevImage");
  const nextBtn = document.getElementById("nextImage");
  if (currentImages.length <= 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  } else {
    prevBtn.style.display = "block";
    nextBtn.style.display = "block";
  }

updatePopupImage();

// ラベルをスタンプIDごとに切り替え
let label = "店舗名"; // デフォルト

if (stamp.id >= 37 && stamp.id <= 39) {
  label = "施設名";
} else if (stamp.id >= 40 && stamp.id <= 48) {
  label = "史跡名";
}

document.getElementById("popupStoreName").textContent =
  `${label}: ${stamp.name}`;

document.getElementById("popupPhone").textContent = `電話番号: ${stamp.tel}`;
document.getElementById("popupZip").textContent = `郵便番号: ${stamp.zip}`;
document.getElementById("popupAddress").textContent = `住所: ${stamp.address}`;
document.getElementById("popupDate").textContent =
  stamp.date ? `取得日時: ${stamp.date}` : `未取得`;



  // ▼ 追加：マップリンクを設定（spotId を渡す）
// ▼ 追加：マップリンクを設定（spotId を渡す）
  const mapLinkEl = document.getElementById("popupMapLink");
  if (stamp.id != null) {
    // stamp.id をそのままクエリパラメータに
    mapLinkEl.href = `map.html?spotId=${encodeURIComponent(stamp.id)}`;
    mapLinkEl.style.display = "inline-block";
  } else {
    mapLinkEl.removeAttribute("href");
    mapLinkEl.style.display = "none";
  }

  document.getElementById("popup").classList.remove("hidden");
  document.body.classList.add("modal-open");
}



function updatePopupImage() {
  const popupImage = document.getElementById("popupImage");
  if (currentImages.length > 0) {
    popupImage.src = currentImages[currentImageIndex];
  } else {
    popupImage.src = "";
  }
}

document.getElementById("prevImage").addEventListener("click", () => {
  if (currentImages.length > 1) {
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    updatePopupImage();
  }
});

document.getElementById("nextImage").addEventListener("click", () => {
  if (currentImages.length > 1) {
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updatePopupImage();
  }
});


function closePopup() {
  document.getElementById("popup").classList.add("hidden");
  document.body.classList.remove("modal-open");
}

// スタンプデータ（ここは必要に応じて追加/編集）
const stampList = [
  { id: 1, name: "温泉市場\n(登別閻魔焼きそば)", tel: "0143-84-2560", zip: "059-0551", address: "北海道登別市登別温泉町50", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/36_温泉市場（コンベンション協会）.jpg","/enma_img/yakisoba/36_温泉市場【温泉エリア】.JPG"], course: "yakisoba" },
  { id: 2, name: "食事処　松前", tel: "0143-84-2101", zip: "059-0551", address: "北海道登別市登別温泉町154", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/40_食事処　松前（登別グランドホテルHP）.jpg","/enma_img/yakisoba/40_松前【温泉エリア】.JPG"], course: "yakisoba" },
  { id: 3, name: "喫茶　田園", tel: "-", zip: "059-0551", address: "北海道登別市登別温泉町76", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/42_喫茶　田園（コンベンション協会）.jpg","/enma_img/yakisoba/42_喫茶田園【温泉エリア】.JPG"], course: "yakisoba" },
  { id: 4, name: "いせくら", tel: "0143-84-3123", zip: "059-0551", address: "北海道登別市登別温泉町71", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/34_いせくら（コンベンション協会）.png","/enma_img/yakisoba/34_いせくら【温泉エリア】.jpg"], course: "yakisoba" },
  { id: 5, name: "コーヒー&ビストロきっさ点", tel: "0143-83-2527", zip: "059-0464", address: "北海道登別市登別東町3丁目3−2", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/33_きっさ点（推進協議会）.jpg","/enma_img/yakisoba/33_きっさ点【東エリア】.jpg"], course: "yakisoba" },
  { id: 6, name: "やきとりの一平　登別店", tel: "0143-83-1818", zip: "059-0464", address: "北海道登別市登別東町2丁目26−2", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/39_やきとりの一平　登別店（公式HP）.jpg","/enma_img/yakisoba/39_一平　登別店【東エリア】.JPG"], course: "yakisoba" },
  { id: 7, name: "登別カントリー倶楽部レストラン", tel: "0143-88-1123", zip: "059-0552", address: "北海道登別市上登別町9−1", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/47_登別カントリー倶楽部レストラン（公式HP）.jpg","/enma_img/yakisoba/47_カントリー倶楽部【東エリア】.jpg"], course: "yakisoba" },
  { id: 8, name: "ピアチェーレ・ノーチェ", tel: "0143-50-6602", zip: "059-0466", address: "北海道登別市登別港町1丁目4番地9", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/46_ピアチェーレ・ノーチェ（公式インスタグラム）.jpg","/enma_img/yakisoba/46_ピアチェーレ・ノーチェ【東エリア】.JPG"], course: "yakisoba" },
  { id: 9, name: "食事&喫茶eファミリー", tel: "0143-83-2836", zip: "059-0464", address: "北海道登別市登別東町2丁目2−2", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/32_食事＆喫茶eファミリー（推進協議会）.JPG","/enma_img/yakisoba/32_eファミリー【東エリア】.jpg"], course: "yakisoba" },
  { id: 10, name: "ほろべつ屋台村　箸遊　佳乃", tel: "090-7650-3005", zip: "059-0012", address: "北海道登別市中央町2丁目6", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/37_ほろべつ屋台村　箸遊　佳乃（推進協議会）.jpg","/enma_img/yakisoba/37_箸遊　佳乃【中央エリア】.JPG"], course: "yakisoba" },
  { id: 11, name: "ソーダ食堂", tel: "0143-88-0690", zip: "059-0003", address: "北海道登別市千歳町6丁目1−98", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/30_ソーダ食堂（推進協議会）.jpg","/enma_img/yakisoba/30_ソーダ食堂【中央エリア】.jpg"], course: "yakisoba" },
  { id: 12, name: "焼肉居酒屋　ぐうちょきぱ", tel: "0143-85-8323", zip: "059-0012", address: "北海道登別市中央町1丁目2−3", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/38_焼肉居酒屋ぐうちょきぱ（公式Facebook）.jpg","/enma_img/yakisoba/38_焼肉居酒屋ぐうちょきぱ【中央エリア】.jpg"], course: "yakisoba" },
  { id: 13, name: "ぱぴあ", tel: "0143-81-2149", zip: "059-0012", address: "北海道登別市中央町4丁目11", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/31_ぱぴあ（撮影）.jpg","/enma_img/yakisoba/31_ぱぴあ【中央エリア】.jpg"], course: "yakisoba" },
  { id: 14, name: "旬の台所くる美", tel: "0143-85-0838", zip: "059-0012", address: "北海道登別市中央町2丁目14−2", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/41_旬の台所くる美（推進協議会）.JPG","/enma_img/yakisoba/41_くる美【中央エリア】.jpg"], course: "yakisoba" },
  { id: 15, name: "旬の華　和か菜", tel: "0143-85-4567", zip: "059-0012", address: "北海道登別市中央町5丁目8−1", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/35_旬の華　和か菜（推進協議会）.jpg","/enma_img/yakisoba/35_和か菜【中央エリア】.jpg"], course: "yakisoba" },
  { id: 16, name: "つぼ八 幌別店", tel: "0143-88-1008", zip: "059-0012", address: "北海道登別市中央町1丁目4-10", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/44_つぼ八幌別店.png","/enma_img/yakisoba/44_つぼ八【中央エリア】.jpg"], course: "yakisoba" },
  { id: 17, name: "すまいるキッチンひなまり", tel: "0143-57-6741", zip: "059-0012", address: "北海道登別市中央町1丁目4−10", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/48_ひなまり.jpeg","/enma_img/yakisoba/48_ひなまり【中央エリア】.jpeg"], course: "yakisoba" },
  { id: 18, name: "室蘭やきとり一平若草店", tel: "0143-86-4488", zip: "059-0035", address: "北海道登別市若草町2丁目1−7", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/43_室蘭やきとり一平若草店(一平HP).jpg","/enma_img/yakisoba/43_一平若草店【西エリア】.jpg"], course: "yakisoba" },
  { id: 19, name: "カフェアンジュリエ", tel: "0143-84-1310", zip: "059-0032", address: "北海道登別市新生町3丁目10-17", image: "/image/stamp_yakisoba.png", storeImages: ["/enma_img/45_カフェ アンジュリエ.png","/enma_img/yakisoba/45_カフェアンジュリエ【西エリア】.jpg"], course: "yakisoba" },

  { id: 20, name: "温泉市場(登別ブランド)", tel: "0143-84-2560", zip: "059-0551", address: "北海道登別市登別温泉町50", image: "/image/stamp_brand.png", storeImages: ["/brand_img/24_温泉市場（コンベンション協会HP）.jpg","/brand_img/products/24-1_北海大だこ地獄漬_24996_marked.jpg","/brand_img/products/24-2_登別たらこ地獄漬_27357_marked.jpg"], course: "brand" },
  { id: 21, name: "祝いの宿　登別グランドホテル", tel: "0143-84-2101", zip: "059-0551", address: "北海道登別市登別温泉町154", image: "/image/stamp_brand.png", storeImages: ["/brand_img/28_祝いの宿登別グランドホテル(コンベンション協会HP).jpg","/brand_img/products/28-1_手作りバウムクーヘン.jpg","/brand_img/products/28-2_手作りバウムクーヘン.jpg"], course: "brand" },
  { id: 22, name: "大黒屋民芸店", tel: "0143-80-3114", zip: "059-0551", address: "北海道登別市登別温泉町60", image: "/image/stamp_brand.png", storeImages: ["/brand_img/25_大黒屋民芸店(コンベンション協会HP).jpg","/brand_img/products/25-1_湯の香ひょうたん飴_16414_marked.jpg","/brand_img/products/25-2_北海道熊笹そば_13568_marked.jpg","/brand_img/products/25-3_北海道熊笹そば_22716_marked.jpg"], course: "brand" },
  { id: 23, name: "Pizzeria ASTRA", tel: "070-5605-7702", zip: "059-0551", address: "北海道登別市登別温泉町60", image: "/image/stamp_brand.png", storeImages: ["/brand_img/27_Pizzeria ASTRA.jpeg", "/brand_img/products/27_究極のマルゲリータ.jpg"], course: "brand" },
  { id: 24, name: "藤崎わさび園", tel: "0143-84-2017", zip: "059-0551", address: "北海道登別市登別温泉町49", image: "/image/stamp_brand.png", storeImages: ["/brand_img/14_藤崎わさび園(コンベンション協会HP).jpg", "/brand_img/products/14_.わさび漬け_23146_marked.jpg"], course: "brand" },
  { id: 25, name: "のぼりべつ酪農館", tel: "0143-85-3184", zip: "059-0461", address: "北海道登別市札内町73−3", image: "/image/stamp_brand.png", storeImages: ["/brand_img/19_のぼりべつ酪農館（酪農館HP）.jpg","/brand_img/products/19-1_ぼりべつ牛乳_16628_marked.jpg","/brand_img/products/19-2_のぼりべつ牛乳プリン.jpg","/brand_img/products/19-3_のぼりべつとろ～りプリン.jpg","/brand_img/products/19-4_登別チーズ　ニュービアンカ（乳白華）.jpg","/brand_img/products/19-5_元鬼豚生ハム.jpg"], course: "brand" },
  { id: 26, name: "マルフク武澤水産", tel: "0143-83-3466", zip: "059-0462", address: "北海道登別市富浦町1丁目24−6", image: "/image/stamp_brand.png", storeImages: ["/brand_img/23_マルフク武澤水産.png","/brand_img/products/23-1_らんぼっけのたらこ_15342_marked.jpg","/brand_img/products/23-2_らんぼっけのたらこ_13354_marked.jpg"], course: "brand" },
  { id: 27, name: "肉のあさひ", tel: "0143-83-2180", zip: "059-0464", address: "北海道登別市登別東町2丁目15−11", image: "/image/stamp_brand.png", storeImages: ["/brand_img/15_肉のあさひ.png","/brand_img/products/15-1_のぼりべつ豚ハンバーグ（粗挽）jpg_22073_marked.jpg","/brand_img/products/15-2_のぼりべつ豚ロース（味噌漬け）_21301_marked.jpg","/brand_img/products/15-3_登別豚ジン.jpg"], course: "brand" },
  { id: 28, name: "わかさいも本舗登別東店", tel: "0143-83-2180", zip: "059-0463", address: "北海道登別市中登別町96−6", image: "/image/stamp_brand.png", storeImages: ["/brand_img/22_わかさいも本舗登別東店(コンベンション協会HP).jpg", "/brand_img/products/21.22_鬼伝説（赤鬼レッドエール、青鬼ピルスナー、金鬼ペールエール）.jpg"], course: "brand" },
  { id: 29, name: "登別観光交流センター「ヌプル」(登別ブランド)", tel: "0143-50-6602", zip: "059-0466", address: "北海道登別市登別港町1丁目4番地9", image: "/image/stamp_brand.png", storeImages: ["/brand_img/29-1_ヌプル（外観）.jpg", "/brand_img/29-2_ヌプル（売店）.jpeg", "/brand_img/products/29_登別ブランド推奨品.png"], course: "brand" },
  { id: 30, name: "望月製麺所", tel: "0143-85-2236", zip: "059-0001", address: "北海道登別市新栄町1-14", image: "/image/stamp_brand.png", storeImages: ["/brand_img/13_望月製麺所.jpeg","/brand_img/products/13-1_登別閻魔らーめん.jpg","/brand_img/products/13-2_登別閻魔らーめん.jpg"], course: "brand" },
  { id: 31, name: "かめやアーニス店", tel: "0143-88-1286", zip: "059-0012", address: "北海道登別市中央町4丁目11", image: "/image/stamp_brand.png", storeImages: ["/brand_img/16_かめやアーニス店(アーニスHP).jpg","/brand_img/products/16.17-1_のぼ～る.jpg","/brand_img/products/16.17-2_のぼ～る.jpg","/brand_img/products/16.17-3_登別牛乳カステラ.jpg","/brand_img/products/16.17-4_登別牛乳カステラ.jpg"], course: "brand" },
  { id: 32, name: "のぼりべつブランドショップ", tel: "0143-81-2121", zip: "059-0012", address: "北海道登別市中央町4丁目11", image: "/image/stamp_brand.png", storeImages: ["/brand_img/26_のぼりべつブランドショップ(撮影).jpg","/brand_img/products/26_登別ブランド推奨品.png"], course: "brand" },
  { id: 33, name: "道南平塚食品", tel: "0143-85-2167", zip: "059-0013", address: "北海道登別市幌別町4-12-1", image: "/image/stamp_brand.png", storeImages: ["/brand_img/18_道南平塚食品.png", "/brand_img/products/18-1_文志朗の鹿角納豆.jpg","/brand_img/products/18-2_文志郎の鹿角納豆.jpg","/brand_img/products/18-3_北海道のわら納豆（登別わさび漬）_18935_marked.jpg","/brand_img/products/18-4_北海道のわら納豆（ビックリ激辛）_14140_marked.jpg"], course: "brand" },
  { id: 34, name: "わかさいも本舗登別本店", tel: "0143-85-4110", zip: "059-0026", address: "北海道登別市若山町2丁目29−3", image: "/image/stamp_brand.png", storeImages: ["/brand_img/21_わかさいも本舗登別本店.JPG", "/brand_img/products/21.22_鬼伝説（赤鬼レッドエール、青鬼ピルスナー、金鬼ペールエール）.jpg"], course: "brand" },
  { id: 35, name: "かめや本店", tel: "0537-86-2125", zip: "059-0034", address: "北海道登別市鷲別町3丁目20−10", image: "/image/stamp_brand.png", storeImages: ["/brand_img/17_かめや本店.png","/brand_img/products/16.17-1_のぼ～る.jpg","/brand_img/products/16.17-2_のぼ～る.jpg","/brand_img/products/16.17-3_登別牛乳カステラ.jpg", "/brand_img/products/16.17-4_登別牛乳カステラ.jpg"], course: "brand" },
  { id: 36, name: "冷鮮工房うす田", tel: "0143-87-0480", zip: "059-0033", address: "北海道登別市栄町3丁目22‐19", image: "/image/stamp_brand.png", storeImages: ["/brand_img/20_㈱冷鮮工房うす田.png", "/brand_img/products/20_のぼりべつホタテ燻_15986_marked.jpg"], course: "brand" },

  { id: 37, name: "ユーカラの里(のぼりべつクマ牧場内)", tel: "0143-84-2225", zip: "059-0551", address: "北海道登別市登別温泉町224", image: "/image/stamp_ainu.png", storeImages: ["/ainu_img/1-1_ユーカラの里.jpg", "/ainu_img/1-2_ユーカラの里.jpg", "/ainu_img/1-3_ユーカラの里（クマ牧場）.jpg"], course: "ainu" },
  { id: 38, name: "登別観光交流センター「ヌプル」(アイヌ文化)", tel: "0143-50-6602", zip: "059-0466", address: "北海道登別市登別港町1丁目4番地9", image: "/image/stamp_ainu.png", storeImages: ["/ainu_img/2-1_ヌプル（外観）.jpg", "/ainu_img/2-2_ヌプル.jpg"], course: "ainu" },
  { id: 39, name: "知里幸恵 銀のしずく記念館", tel: "0143-83-5666", zip: "059-0465", address: "北海道登別市登別本町2丁目34−7", image: "/image/stamp_ainu.png", storeImages: ["/ainu_img/3_銀のしずく記念館.JPG"], course: "ainu" },
  { id: 40, name: "知里幸恵の墓・金成マツの碑", tel: "-", zip: "059-0462", address: "北海道登別市富浦町", image: "/image/stamp_ainu.png", storeImages: ["/ainu_img/4_知里幸恵の墓・金成マツの碑.JPG"], course: "ainu" },
  { id: 41, name: "知里真志保の碑", tel: "-", zip: "059-0465", address: "北海道登別市登別本町3丁目7", image: "/image/stamp_ainu.png", storeImages: ["/ainu_img/5_知里真志保の碑.JPG"], course: "ainu" },
  { id: 42, name: "カムイワッカ", tel: "-", zip: "059-0463", address: "北海道登別市中登別町80ー1", image: "/image/stamp_ainu.png", storeImages: ["/ainu_img/6_カムイワッカ.JPG"], course: "ainu" },
  { id: 43, name: "ヌプルペッ(登別川)", tel: "-", zip: "059-0465", address: "北海道登別市登別本町3丁目", image: "/image/stamp_ainu.png", storeImages: ["/ainu_img/7_ヌプルペッ（登別川）.JPG"], course: "ainu" },
  { id: 44, name: "アフンルパル", tel: "-", zip: "059-0465", address: "北海道登別市登別本町3丁目", image: "/image/stamp_ainu.png", storeImages: ["/ainu_img/8_アフンルパル.JPG"], course: "ainu" },
  { id: 45, name: "フンペサパ(フンベ山)", tel: "-", zip: "059-0466", address: "北海道登別市登別港町1丁目", image: "/image/stamp_ainu.png", storeImages: ["/ainu_img/9_フンペサパ（フンベ山）.JPG"], course: "ainu" },
  { id: 46, name: "愛隣学校跡", tel: "-", zip: "059-0013", address: "北海道登別市幌別町5-2-1", image: "/image/stamp_ainu.png", storeImages: ["/ainu_img/10_愛隣学校跡.jpg"], course: "ainu" },
  { id: 47, name: "オカシペッ(岡志別)", tel: "-", zip: "059-0003", address: "北海道登別市千歳町97番地", image: "/image/stamp_ainu.png", storeImages: ["/ainu_img/11_オカシペッ（岡志別）.jpg"], course: "ainu" },
  { id: 48, name: "キウシト湿原", tel: "-", zip: "059-0026", address: "北海道登別市若山町2丁目21", image: "/image/stamp_ainu.png", storeImages: ["/ainu_img/12-1_キウシト湿原.jpg", "/ainu_img/12-2_キウシト湿原.jpg"], course: "ainu" }
];


function getObtainedStamps() {
  const raw = localStorage.getItem("obtainedStamps");
  return raw ? JSON.parse(raw) : {};
}

function renderStamps() {
  const container = document.getElementById("stampContainer");
  container.innerHTML = "";
  const obtained = getObtainedStamps();

  const courses = ["yakisoba", "brand", "ainu"];
  const courseNames = {
    yakisoba: "登別閻魔やきそば",
    brand: "登別ブランド推奨品",
    ainu: "アイヌ文化施設・史跡"
  };

  courses.forEach(course => {
    const courseStamps = stampList.filter(s => s.course === course);
    const block = document.createElement("div");
    block.className = "genre-block tab-content";
    block.id = `tab-${course}`;
    block.classList.add(`course-${course}`);
    if (course !== "yakisoba") block.classList.add("hidden");

    const title = document.createElement("div");
    title.className = "genre-title";
    const obtainedCount = courseStamps.filter(s => obtained[`stamp${s.id}`]).length;
    title.textContent = `${courseNames[course]} ${obtainedCount}/${courseStamps.length}`;
    block.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "stamp-grid";
    grid.classList.add(`course-${course}`);

    courseStamps.forEach(stamp => {
      const item = document.createElement("div");
      item.className = "stamp";

      const icon = document.createElement("div");
      icon.className = "stamp-icon";

      const img = document.createElement("img");
      img.src = stamp.image;
      img.alt = stamp.name;

      const stampKey = `stamp${stamp.id}`;
      if (!obtained[stampKey]) {
        img.classList.add("semi-transparent");
      } else {
        // ここでlocalStorageから日付を取得している
        stamp.date = obtained[stampKey].date;
      }

      icon.appendChild(img);
      item.appendChild(icon);

      const name = document.createElement("div");
      name.className = "stamp-name";
      name.textContent = stamp.name;
      item.appendChild(name);

      item.addEventListener("click", () => showPopup(stamp));

      grid.appendChild(item);
    });

    block.appendChild(grid);
    container.appendChild(block);
  });
}

// warning ポップアップの表示
document.querySelector('.menu-warning')?.addEventListener('click', function (e) {
  e.preventDefault();
  document.getElementById('warningPopup')?.classList.remove('hidden');
});

// warning ポップアップの非表示（閉じるボタン）
document.getElementById('closeWarningBtn')?.addEventListener('click', function () {
  console.log('閉じるボタンがクリックされました');
  document.getElementById('warningPopup')?.classList.add('hidden');
});

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // ✅ 残したいキーの値を一時保存
      const keepKeys = ["noboribetsuMapVisited", "hasAgreed"];
      const keepData = {};

      keepKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value !== null) keepData[key] = value;
      });

      // ✅ 全削除
      localStorage.clear();

      // ✅ 残したいキーを再保存
      Object.entries(keepData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      // ✅ login.htmlへ遷移
      window.location.href = "login.html";
    });
  }
});


// ページの読み込みが完了したら、サーバーから最新のスタンプ情報を取得する
document.addEventListener('DOMContentLoaded', () => {
  const sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    // セッションIDがない場合は、home.php内のスクリプトがログインページにリダイレクトするはず
    return;
  }
    renderStamps();
    
    applyInitialTab();

    // --- ここからが初回アンケートの処理 ---
    const surveyPopup = document.getElementById('popup-overlay');
    const surveyForm = document.getElementById('survey-form');

    const hideSurveyPopup = () => {
    if(surveyPopup) {
        surveyPopup.classList.add('hidden');
    }
  };

    // ★ 1. 目印をチェックしてポップアップ表示
    if (localStorage.getItem('show_survey') === 'true') {
        if(surveyPopup) { surveyPopup.classList.remove('hidden'); }
        // ★ 2. 一度使ったらすぐに目印を削除
        localStorage.removeItem('show_survey');
    }

    // ★ 3. 送信ボタンの処理
        if(surveyForm) {
        surveyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(surveyForm);
            const sessionId = localStorage.getItem('session_id');

            fetch('php/submit_survey.php', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionId
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('ご協力ありがとうございました！');
                    hideSurveyPopup();
                } else {
                    alert('エラーが発生しました: ' + (data.error || '不明なエラー'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('送信に失敗しました。');
            });
        });
    }
});

function checkEntryConditions() {
  const obtained = getObtainedStamps();

  let yakisobaCount = 0;
  let brandCount = 0;
  let ainuCount = 0;

  Object.keys(obtained).forEach(key => {
    const id = parseInt(key.replace("stamp", ""), 10);
    const stamp = stampList.find(s => s.id === id);
    if (!stamp) return;
    if (stamp.course === "yakisoba") yakisobaCount++;
    else if (stamp.course === "brand") brandCount++;
    else if (stamp.course === "ainu") ainuCount++;
  });

  const ybTotal = yakisobaCount + brandCount;

  // ローカルストレージから現在の達成情報を取得（なければ初期化）
  let unlocked = JSON.parse(localStorage.getItem("unlockedPrizes")) || {
    participation: false,
    b: false,
    a: false,
    special: false
  };

  let updated = false;

  // 参加賞：やきそば1以上 ＆ ブランド1以上 ＆ アイヌ1以上
  if (!unlocked.participation &&
      yakisobaCount >= 1 && brandCount >= 1 && ainuCount >= 1) {
    alert("🎉 参加賞の応募条件を満たしました！");
    unlocked.participation = true;
    updated = true;
    recordAlertToServer("participation");
  }
  // 抽選賞B：参加賞が解放済み ＆ アイヌ2以上
  if (!unlocked.b &&
           unlocked.participation &&
           ainuCount >= 2) {
    alert("🎉 抽選賞Bの応募条件を満たしました！");
    unlocked.b = true;
    updated = true;
    recordAlertToServer("b");
  }
  // 抽選賞A：Bが解放済み ＆ （やきそば＋ブランド）3以上 ＆ アイヌ3以上
  if (!unlocked.a &&
           unlocked.b &&
           ybTotal >= 3 &&
           ainuCount >= 3) {
    alert("🎉 抽選賞Aの応募条件を満たしました！");
    unlocked.a = true;
    updated = true;
    recordAlertToServer("a");
  }
  // 特賞：Aが解放済み ＆ （やきそば＋ブランド）5以上 ＆ アイヌ4以上
  if (!unlocked.special &&
           unlocked.a &&
           ybTotal >= 5 &&
           ainuCount >= 4) {
    alert("🎉 おめでとうございます！登別温泉宿泊券の応募条件を満たしました！");
    unlocked.special = true;
    updated = true;
    recordAlertToServer("special");
  }
  
  if (updated) {
    localStorage.setItem("unlockedPrizes", JSON.stringify(unlocked));
  }
}



document.addEventListener("DOMContentLoaded", () => {
  checkEntryConditions();  // ← クイズ正解後の遷移時に達成判定する
});

// 注意事項を開くとき
document.querySelector('.menu-warning')?.addEventListener('click', function (e) {
  e.preventDefault();
  document.getElementById('warningPopup')?.classList.remove('hidden');
  document.body.classList.add('modal-open'); // ← スクロール禁止
});

// 注意事項を閉じるとき
document.getElementById('closeWarningBtn')?.addEventListener('click', function () {
  document.getElementById('warningPopup')?.classList.add('hidden');
  document.body.classList.remove('modal-open'); // ← スクロール再開
});


