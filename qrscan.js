const video = document.getElementById('video');
const scanBtn = document.getElementById('scanBtn');
const message = document.getElementById('message');
const successImage = document.getElementById('successImage');

let scanner = null;
let scanning = false;

scanBtn.addEventListener('click', async () => {
  if (scanning) return;

  try {
    scanner = new QrScanner(video, result => handleResult(result.data), {
      highlightScanRegion: false,
    });

    await scanner.start();
    scanning = true;
    successImage.classList.add("hidden");
    message.textContent = "QRコードを読み取ってください";
  } catch (err) {
    message.textContent = "カメラの起動に失敗しました";
    console.error(err);
  }
});

function handleResult(data) {
  if (scanner) scanner.stop();
  scanning = false;

  const matched = data.match(/^https:\/\/stamp\.onista-noboribetsu\.com\/quiz\.html\?id=onista_[a-zA-Z0-9]{4}$/);
  if (matched) {
    successImage.classList.remove("hidden");

    requestAnimationFrame(() => {
      setTimeout(() => {
        window.location.href = data;
      }, 1000);
    });
  } else {
    message.textContent = "有効なQRコードではありません。再度読み取りボタンを押してください。";
  }
}
