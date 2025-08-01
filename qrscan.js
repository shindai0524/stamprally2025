let scanner;
let scanning = false;

const cameraElem = document.getElementById('camera');
const resultText = document.getElementById('result-text');
const scanBtn = document.getElementById('scan-btn');
const retryBtn = document.getElementById('retry-btn');

scanBtn.onclick = async () => {
  if (scanning) return;

  try {
    scanner = new QrScanner(cameraElem, result => {
      handleResult(result.data);
    });
    await scanner.start();
    scanning = true;
    resultText.textContent = "QRコードをスキャン中...";
    scanBtn.style.display = "none";
  } catch (err) {
    resultText.textContent = "カメラの起動に失敗しました";
    console.error(err);
  }
};

retryBtn.onclick = () => {
  resultText.textContent = "QRコードを再度スキャンしてください";
  scanBtn.style.display = "inline-block";
  retryBtn.style.display = "none";
};

function handleResult(data) {
  if (data.startsWith("quiz.html?id=")) {
    const id = parseInt(data.split("id=")[1]);
    if (id >= 1 && id <= 49) {
      window.location.href = data;
      return;
    }
  }

  resultText.textContent = "無効なQRコードです。正しいQRを読み取ってください。";
  retryBtn.style.display = "inline-block";
  if (scanner) scanner.stop();
  scanning = false;
}
