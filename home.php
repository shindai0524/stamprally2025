<?php
// home.php - 本番環境向け修正版

/*
 * 注意:
 * このページは、サーバーサイドでのアクセス制限を行っていません。
 * ページの表示自体は誰でも可能ですが、中のコンテンツ（スタンプ情報など）は
 * JavaScriptを通じて、認証が必要なAPIから取得される想定です。
 * 認証は、JavaScriptがlocalStorageのセッションIDをAPIに送信することで行います。
 * 未認証のユーザーは、以下のJavaScriptによって自動的にログインページへリダイレクトされます。
 */

// 本番環境ではエラーを画面に表示せず、ログに出力します
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

echo "\n";
?>

<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>スタンプラリー ホーム</title>
  <link rel="stylesheet" href="home.css">
</head>
<body>
  <!-- 固定ヘッダー背景 -->
  <div class="top-background"></div>

  <!-- ロゴ -->
  <div id="logoHeader">
    <img src="/image/logo.png" alt="ロゴ">
  </div>

  <!-- メニュー・ヘルプ -->
  <header>
    <button id="menuBtn" class="menu"><img src="image/menu.png" alt="メニュー"></button>
    <button id="helpBtn" class="help"><img src="/image/help.png" alt="ヘルプ"></button>
  </header>

  <!-- タブ -->
  <div id="tabButtons">
    <button data-tab="yakisoba" class="active">
      <img src="image/yakisoba_tab.png" alt="登別閻魔焼きそば">
    </button>
    <button data-tab="brand">
      <img src="image/brand_tab.png" alt="登別ブランド推奨品">
    </button>
    <button data-tab="ainu">
      <img src="image/ainu_tab.png" alt="アイヌ文化施設・史跡">
    </button>
  </div>


  <!-- メニューリスト -->
  <div id="menuList" class="hidden">
    <button class="close-btn" onclick="menuList.classList.add('hidden')">
      <img src="/image/close2.png" alt="閉じる">
    </button>
    <ul>
<!-- メニューリスト内の warning -->
      <li class="menu-warning">
        <a href="#" id="openWarning">
          <img src="/image/warning.png" alt="注意事項">
        </a>
      </li>

      <!-- 警告ポップアップ -->
      <div id="warningPopup" class="warning-popup hidden">
        <div class="warning-popup-content">
          <button class="close-btn" id="closeWarningBtn">
            <img src="/image/close2.png" alt="閉じる">
          </button>
          <div class="warning-popup-inner">
            <!-- スクロールできるテキスト領域 -->
            <div class="warning-text">
              <p>
                <h3>スタンプラリーの参加にあたって</h3>
            ・参加は無料ですが、通信料はご利用者様負担となります。<br>
            ・歩きスマホは大変危険です。画面を見るときは周りの方の迷惑にならない安全な場所に立ち止まってください。<br>
            ・ケガなどにつきましては参加者各自の責任において対処をお願いします。<br>
            ・ゴミは各自でお持ち帰りください。<br>
            ・私有地や建物など許可なく立ち入ってはいけない場所には入らないでください。<br>
            ・スタンプポイントの営業時間などをご確認の上、おでかけください。<br>
            ・スタンプ取得においては、施設や店舗、他のお客さまのご迷惑にならないようにご配慮ください。<br>
            ・参加登録及びプレゼント応募でご入力いただいた個人情報はスタンプラリーの運用(プレゼント当選者へ賞品発送のため配送伝票への記載、 スタンプラリー開催期間中のお知らせ配信を含む)にのみ使用するものとします。主催者及び事務局以外の第三者への提供は行いません。(法令等により開示を求められた場合を除く)<br>
            ・入館料などを必要とする施設では、入館料を支払の上、イベントに参加してください。

                <br><h3>その他</h3>
            ・イベントは予告なく変更・中止する場合がございます。また、当サイトに掲載されているコンテンツや情報は、予告なく変更・修正・削除する場合があります。<br>
            ・各賞品の当選者には郵送にて賞品を送付させていただきます。(発送は国内に限る。)（国外住所を有する方からの応募は参加賞・抽選賞ともに対象外とします。）<br>
              </p>
            </div>
          </div>
        </div>
      </div>

      <li class="menu-map">
        <a href="map.html">
          <img src="/image/go_map.png" alt="マップへ">
        </a>
      </li>
      <li class="menu-entry">
        <a href="entry.html">
          <img src="/image/go_entry.png" alt="応募フォームへ">
        </a>
      </li>
      <li class="menu-prizelist">
        <a href="prizelist.html">
            <img src="/image/prizelist.png" alt="賞品について">
        </a>
      </li>
      <!-- ログアウト -->
      <li class="log-out">
        <a href="#" id="logoutBtn">
          <img src="/image/logout.png" alt="ログアウト">
        </a>
      </li>
    </ul>
  </div>

  <!-- ヘルプリスト -->
  <div id="helpList" class="hidden">
    <button class="close-btn" onclick="helpList.classList.add('hidden')">
      <img src="/image/close2.png" alt="閉じる">
    </button>
    <ul>
      <li class="help-home">
        <a href="#" onclick="openHelp('home')">
          <img src="/image/help_home.png" alt="ホームの使い方">
        </a>
      </li>
      <li class="help-qr">
        <a href="#" onclick="openHelp('qr')">
          <img src="/image/help_qr.png" alt="QRコード読み取りの使い方">
        </a>
      </li>
    </ul>
  </div>

<!-- ビューアー -->
<div id="helpViewer" class="hidden">
  <div class="help-viewer">
    <!-- 左矢印（外側） -->
    <button id="helpPrevBtn" class="help-nav left hidden" aria-label="前へ">
      <img src="/image/left_arrow.png" alt="">
    </button>

    <!-- メイン画像 -->
    <img id="helpImage" src="" alt="ヘルプ画像" class="help-image"/>

    <!-- 右矢印（外側） -->
    <button id="helpNextBtn" class="help-nav right hidden" aria-label="次へ">
      <img src="/image/right_arrow.png" alt="">
    </button>

    <!-- 閉じる（画像ボタン） -->
    <button id="helpCloseBtn" class="help-close" aria-label="閉じる">
      <img src="/image/close.png" alt="閉じる">
    </button>
  </div>
</div>

  <!-- スタンプ表示 -->
  <main id="stampContainer">
    <!-- ここにスタンプ一覧がJavaScriptで描画される -->
  </main>

  <div class="page-bottom-space"></div>

  <div id="popup-overlay" class="hidden">
        <div id="popup-window">
          <h3>アンケートにご協力ください</h3>
            <form id="survey-form" method="post" action="example.cgi">
                <div class="question">
                    <p>年代</p>
                        <input id="radio-a" type="radio" name="age" value="10代" checked><label for="radio-a">10代</label><br>
                        <input id="radio-b" type="radio" name="age" value="20代"><label for="radio-b">20代</label><br>
                        <input id="radio-c" type="radio" name="age" value="30代"><label for="radio-c">30代</label><br>
                        <input id="radio-d" type="radio" name="age" value="40代"><label for="radio-d">40代</label><br>
                        <input id="radio-e" type="radio" name="age" value="50代以上"><label for="radio-e">50代以上</label><br>
                </div>

                <div class="question">
                    <p>性別</p>
                        <input id="radio-f" type="radio" name="sex" value="男性" checked><label for="radio-f">男性</label><br>
                        <input id="radio-g" type="radio" name="sex" value="女性"><label for="radio-g">女性</label><br>
                </div>

                <div class="question">
                    <p>居住地 </p>
                        <input id="radio-h" type="radio" name="residence" value="市内" checked><label for="radio-h">北海道（登別市内）</label><br>
                        <input id="radio-i" type="radio" name="residence" value="市外"><label for="radio-i">北海道（登別市外）</label><br>
                        <input id="radio-j" type="radio" name="residence" value="道外"><label for="radio-j">北海道以外の都道府県</label><br>
                </div>

                <div class="buttons">
                    <button type="submit">送信</button>
                </div>
            </form>
        </div>
    </div>

<!-- ポップアップ -->
<div id="popup" class="popup hidden">
  <div class="popup-image-wrapper">
    <!-- 左右ナビ：テキストは消して画像ボタン化 -->
    <button id="prevImage" class="nav-btn nav-left" aria-label="前の画像"></button>
    <img id="popupImage" src="" alt="店舗画像">
    <button id="nextImage" class="nav-btn nav-right" aria-label="次の画像"></button>
  </div>

  <p id="popupStoreName"></p>
  <p id="popupPhone"></p>
  <p id="popupZip"></p>
  <p id="popupAddress"></p>
  <p id="popupDate"></p>

  <div class="popup-actions">
    <!-- 「マップに飛ぶ」を画像ボタンに変更 -->
  <a id="popupMapLink" class="map-link" href="#" target="_self" aria-label="マップに飛ぶ">
    <img src="/image/jump_map.png" alt="マップに飛ぶ">
  </a>
  </div>

  <!-- 変更後 -->
  <button class="popup-close" onclick="closePopup()">
    <img src="/image/close.png" alt="閉じる">
  </button>

</div>



  <!-- QRボタン -->
  <a href="qrscan.html" id="qrFixedButton">
    <img src="image/code.png" alt="QR読み取り">
  </a>

  <!-- 左下キャラ -->
  <div class="fixed-character">
    <img src="/image/tom_2.png" alt="キャラクター">
  </div>

  

  <script>
    // ページ読み込み時にセッションの有効性をチェック
    (function() {
      const sessionId = localStorage.getItem('session_id');

      if (!sessionId) {
        // セッションIDがなければ、ログインページへリダイレクト
        window.location.href = 'login.html';
        return;
      }

      // セッションIDをサーバーに送信して検証
      fetch('php/verify_session.php', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + sessionId,
          'X-Requested-With': 'XMLHttpRequest' // APIリクエストであることを示す
        }
      })
      .then(response => {
        if (!response.ok) {
          // セッションが無効（401 Unauthorizedなど）なら、ローカルストレージをクリアしてログインページへ
          localStorage.removeItem('session_id');
          window.location.href = 'login.html';
        }
        // レスポンスがok (200) なら、ページの表示を続け、コンテンツの読み込みを開始する
      })
      .catch(error => {
        console.error('Session verification request failed:', error);
        // ★★★ 本番用に修正: 通信エラー等が発生した場合もログインページに戻す ★★★
        localStorage.removeItem('session_id');
        window.location.href = 'login.html';
      });
    })();
  </script>
  <script src="alert.js"></script>
  <script src="home.js"></script>
</body>
</html>