// メニュー・ヘルプの表示切り替え
const menuBtn = document.getElementById("menuBtn");
const helpBtn = document.getElementById("helpBtn");
const menuList = document.getElementById("menuList");
const helpList = document.getElementById("helpList");

menuBtn.addEventListener("click", () => {
  menuList.classList.toggle("hidden");
  helpList.classList.add("hidden");
});

helpBtn.addEventListener("click", () => {
  helpList.classList.toggle("hidden");
  menuList.classList.add("hidden");
});

// タブ切り替え
document.querySelectorAll("#tabButtons button").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.getAttribute("data-tab");
    document.querySelectorAll(".tab-content").forEach(div => {
      div.classList.add("hidden");
    });
    document.getElementById(`tab-${tab}`).classList.remove("hidden");
  });
});

// ヘルプ画像操作
const helpImages = {
  home: ["png/image.png", "png/image2.png", "png/image3.png"],
  qr: ["png/image.png"]
};

let currentHelpIndex = 0;
let currentHelpCategory = "home";

function openHelp(category) {
  currentHelpCategory = category;
  currentHelpIndex = 0;
  updateHelpImage();
  document.getElementById("helpModal").classList.remove("hidden");
  helpList.classList.add("hidden");
  menuList.classList.add("hidden");
}

function updateHelpImage() {
  const image = helpImages[currentHelpCategory][currentHelpIndex];
  document.getElementById("helpImage").src = image;

  prevBtn.classList.toggle("hidden", currentHelpIndex === 0);
  nextBtn.classList.toggle("hidden", currentHelpIndex === helpImages[currentHelpCategory].length - 1);
}

function nextHelp() {
  if (currentHelpIndex < helpImages[currentHelpCategory].length - 1) {
    currentHelpIndex++;
    updateHelpImage();
  }
}

function prevHelp() {
  if (currentHelpIndex > 0) {
    currentHelpIndex--;
    updateHelpImage();
  }
}

function closeHelp() {
  document.getElementById("helpModal").classList.add("hidden");
}

const prevBtn = document.getElementById("prevHelpBtn");
const nextBtn = document.getElementById("nextHelpBtn");

prevBtn.addEventListener("click", prevHelp);
nextBtn.addEventListener("click", nextHelp);

// ポップアップ処理
function showPopup(stamp) {
  document.getElementById("popupImage").src = stamp.storeImage || "";
  document.getElementById("popupStoreName").textContent = `店舗名: ${stamp.name}`;
  document.getElementById("popupPhone").textContent = `電話番号: ${stamp.tel}`;
  document.getElementById("popupZip").textContent = `郵便番号: ${stamp.zip}`;
  document.getElementById("popupAddress").textContent = `住所: ${stamp.address}`;
  document.getElementById("popupDate").textContent = stamp.date ? `取得日時: ${stamp.date}` : `未取得`;
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

// スタンプデータ（ここは必要に応じて追加/編集）
const stampList = [
  { id: 1, name: "温泉市場(登別閻魔焼きそば)", tel: "0143-xx-0001", zip: "059-0551", address: "北海道登別市登別温泉町50", image: "images/stamp1.png", storeImage: "images/store1.png", course: "yakisoba" },
  { id: 2, name: "食事処　松前", tel: "0143-xx-0002", zip: "059-0551", address: "北海道登別市登別温泉町154", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 3, name: "喫茶　田園", tel: "0143-xx-0002", zip: "059-0551", address: "北海道登別市登別温泉町76", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 4, name: "いせくら", tel: "0143-xx-0002", zip: "059-0551", address: "北海道登別市登別温泉町71", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 5, name: "コーヒー&ビストロきっさ点", tel: "0143-xx-0002", zip: "059-0464", address: "北海道登別市登別東町3丁目3−2", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 6, name: "やきとりの一平　登別店", tel: "0143-xx-0002", zip: "059-0464", address: "北海道登別市登別東町2丁目26−2", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 7, name: "登別カントリー倶楽部レストラン", tel: "0143-xx-0002", zip: "059-0552", address: "北海道登別市上登別町9−1", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 8, name: "ピアチェーレ・ノーチェ", tel: "0143-xx-0002", zip: "059-0466", address: "北海道登別市登別港町1丁目4番地9", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 9, name: "食事&喫茶eファミリー", tel: "0143-xx-0002", zip: "059-0464", address: "北海道登別市登別東町2丁目2−2", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 10, name: "ほろべつ屋台村　箸遊　佳乃", tel: "0143-xx-0002", zip: "059-0012", address: "北海道登別市中央町2丁目6", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 11, name: "ソーダ食堂", tel: "0143-xx-0002", zip: "059-0003", address: "北海道登別市千歳町6丁目1−98", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 12, name: "焼肉居酒屋　ぐうちょきぱ", tel: "0143-xx-0002", zip: "059-0012", address: "北海道登別市中央町1丁目2−3", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 13, name: "ぱぴあ", tel: "0143-xx-0002", zip: "059-0012", address: "北海道登別市中央町4丁目11", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 14, name: "旬の台所くる美", tel: "0143-xx-0002", zip: "059-0012", address: "北海道登別市中央町2丁目14−2", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 15, name: "旬の華　和か菜", tel: "0143-xx-0002", zip: "059-0012", address: "北海道登別市中央町5丁目8−1", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 16, name: "つぼ八 幌別店", tel: "0143-xx-0002", zip: "059-0012", address: "北海道登別市中央町1丁目4-10", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 17, name: "すまいるキッチンひなまり", tel: "0143-xx-0002", zip: "059-0012", address: "北海道登別市中央町1丁目4−10", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 18, name: "室蘭やきとり一平若草店", tel: "0143-xx-0002", zip: "059-0035", address: "北海道登別市若草町2丁目1−7", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 19, name: "カフェアンジュリエ", tel: "0143-xx-0002", zip: "059-0032", address: "北海道登別市新生町3丁目10-17", image: "images/stamp2.png", storeImage: "images/store2.png", course: "yakisoba" },
  { id: 20, name: "温泉市場(登別ブランド)", tel: "0143-yy-001", zip: "059-0551", address: "北海道登別市登別温泉町50", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 21, name: "祝いの宿　登別グランドホテル", tel: "0143-yy-001", zip: "059-0551", address: "北海道登別市登別温泉町154", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 22, name: "大黒屋民芸店", tel: "0143-yy-001", zip: "059-0551", address: "北海道登別市登別温泉町60", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 23, name: "Pizzeria ASTRA", tel: "0143-yy-001", zip: "059-0551", address: "北海道登別市登別温泉町60", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 24, name: "藤崎わさび園", tel: "0143-yy-001", zip: "059-0551", address: "北海道登別市登別温泉町49", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 25, name: "のぼりべつ酪農家", tel: "0143-yy-001", zip: "059-0461", address: "北海道登別市札内町73−3", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 26, name: "マルフク武澤水産", tel: "0143-yy-001", zip: "059-0462", address: "北海道登別市富浦町1丁目24−6", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 27, name: "肉のあさひ", tel: "0143-yy-001", zip: "059-0464", address: "北海道登別市登別東町2丁目15−11", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 28, name: "わかさいも本舗登別東店", tel: "0143-yy-001", zip: "059-0463", address: "北海道登別市中登別町96−6", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 29, name: "登別観光交流センター「ヌプル」(登別ブランド)", tel: "0143-yy-001", zip: "059-0466", address: "北海道登別市登別港町1丁目4番地9", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 30, name: "望月製麺所", tel: "0143-yy-001", zip: "059-0101", address: "登別市ブランド1丁目", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 31, name: "かめやアーニス店", tel: "0143-yy-001", zip: "059-0012", address: "北海道登別市中央町4丁目11", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 32, name: "のぼりべつブランドショップ", tel: "0143-yy-001", zip: "059-0012", address: "北海道登別市中央町4丁目11", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 33, name: "道南平塚食品", tel: "0143-yy-001", zip: "059-0013", address: "北海道登別市幌別町4-12-1", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 34, name: "わかさいも本舗登別本店", tel: "0143-yy-001", zip: "059-0026", address: "北海道登別市若山町2丁目29−3", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 35, name: "かめや本店", tel: "0143-yy-001", zip: "059-0034", address: "北海道登別市鷲別町3丁目20−10", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 36, name: "冷鮮工房うす田", tel: "0143-yy-001", zip: "059-0033", address: "北海道登別市栄町3丁目22‐19", image: "images/stamp20.png", storeImage: "images/store20.png", course: "brand" },
  { id: 37, name: "ユーカラの里(のぼりべつクマ牧場内)", tel: "0143-zz-001", zip: "059-0551", address: "北海道登別市登別温泉町224", image: "images/stamp37.png", storeImage: "images/store37.png", course: "ainu" },
  { id: 38, name: "登別観光交流センター「ヌプル」(アイヌ文化)", tel: "0143-zz-001", zip: "059-0466", address: "北海道登別市登別港町1丁目4番地9", image: "images/stamp37.png", storeImage: "images/store37.png", course: "ainu" },
  { id: 39, name: "知里幸恵 銀のしずく記念館", tel: "0143-zz-001", zip: "059-0465", address: "北海道登別市登別本町2丁目34−7", image: "images/stamp37.png", storeImage: "images/store37.png", course: "ainu" },
  { id: 40, name: "知里幸恵の墓・金成マツの碑", tel: "0143-zz-001", zip: "059-0462", address: "北海道登別市富浦町", image: "images/stamp37.png", storeImage: "images/store37.png", course: "ainu" },
  { id: 41, name: "知里真志保の碑", tel: "0143-zz-001", zip: "059-0465", address: "北海道登別市登別本町3丁目7", image: "images/stamp37.png", storeImage: "images/store37.png", course: "ainu" },
  { id: 42, name: "カムイワッカ", tel: "0143-zz-001", zip: "059-0463", address: "北海道登別市中登別町80ー1", image: "images/stamp37.png", storeImage: "images/store37.png", course: "ainu" },
  { id: 43, name: "ヌプルペッ(登別川)", tel: "0143-zz-001", zip: "059-0465", address: "北海道登別市登別本町3丁目", image: "images/stamp37.png", storeImage: "images/store37.png", course: "ainu" },
  { id: 44, name: "アフンルパル", tel: "0143-zz-001", zip: "059-0465", address: "北海道登別市登別本町3丁目", image: "images/stamp37.png", storeImage: "images/store37.png", course: "ainu" },
  { id: 45, name: "フンペサパ(フンベ山)", tel: "0143-zz-001", zip: "059-0466", address: "北海道登別市登別港町1丁目", image: "images/stamp37.png", storeImage: "images/store37.png", course: "ainu" },
  { id: 46, name: "愛隣学校跡", tel: "0143-zz-001", zip: "059-0013", address: "北海道登別市幌別町5-2-1", image: "images/stamp37.png", storeImage: "images/store37.png", course: "ainu" },
  { id: 47, name: "オカシペッ(岡志別)", tel: "0143-zz-001", zip: "059-0003", address: "北海道登別市千歳町97番地", image: "images/stamp37.png", storeImage: "images/store37.png", course: "ainu" },
  { id: 48, name: "キウシト湿原", tel: "0143-zz-001", zip: "059-0026", address: "北海道登別市若山町2丁目21", image: "images/stamp37.png", storeImage: "images/store37.png", course: "ainu" }
  // 必要に応じて追加
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
    if (course !== "yakisoba") block.classList.add("hidden");

    const title = document.createElement("div");
    title.className = "genre-title";
    const obtainedCount = courseStamps.filter(s => obtained[`stamp${s.id}`]).length;
    title.textContent = `${courseNames[course]} ${obtainedCount}/${courseStamps.length}`;
    block.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "stamp-grid";

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

window.onload = renderStamps;
