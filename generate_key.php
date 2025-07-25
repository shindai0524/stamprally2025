<?php
// 64バイトのランダムなデータを生成し、Base64でエンコードして安全な文字列を作成します
$strong_key = base64_encode(random_bytes(64));
echo $strong_key . PHP_EOL;
?>