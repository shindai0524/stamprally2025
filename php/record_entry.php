<?php
// php/record_entry.php

// 必要な設定ファイルや関数を読み込みます。
require_once __DIR__ . '/../../app_files/config.php';
require_once __DIR__ . '/../../app_files/db.php';
require_once __DIR__ . '/session_check.php';

// 応答形式をJSONに設定します。
header('Content-Type: application/json; charset=UTF-8');

try {
    // 認証チェックとユーザーUUIDの取得（sessionsテーブルから取得）
    $user_uuid = check_login_status();  // ← session_check.phpで有効なsession_idからuuidを取得する関数

    // JSONデータを受け取る
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    // 必須項目の検証
    $required_fields = ['name', 'tel', 'zip', 'address', 'email', 'prize_type'];
    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "必要な項目が不足しています: $field"]);
            exit;
        }
    }

    // DB接続
    $conn = get_db_connection();

    // 重複応募チェック（uuidとprize_typeが一致するレコードが既にあるか）
    $check_stmt = $conn->prepare("SELECT COUNT(*) FROM forms WHERE uuid = ? AND prize_type = ?");
    $check_stmt->bind_param("ss", $user_uuid, $data['prize_type']);
    $check_stmt->execute();
    $check_stmt->bind_result($count);
    $check_stmt->fetch();
    $check_stmt->close();

    if ($count > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'この景品にはすでに応募済みです']);
        exit;
    }

    // forms テーブルへデータ挿入
    $stmt = $conn->prepare("
        INSERT INTO forms (uuid, name, tel, zip, address, email, prize_type, applied_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmt->bind_param(
        "sssssss",
        $user_uuid,
        $data['name'],
        $data['tel'],
        $data['zip'],
        $data['address'],
        $data['email'],
        $data['prize_type']
    );

    if ($stmt->execute()) {
                $show_survey_flag = false;

        // 今回の応募が「参加賞(participation)」の場合のみ、アンケートのチェックを行う
        if ($data['prize_type'] === 'participation') {
            
            // 新しいアンケートテーブル(participation_survey_answers)をチェック
            $survey_check_stmt = $conn->prepare("SELECT COUNT(*) FROM participation_survey_answers WHERE user_id = ?");
            $survey_check_stmt->bind_param("s", $user_uuid);
            $survey_check_stmt->execute();
            $survey_check_stmt->bind_result($count);
            $survey_check_stmt->fetch();
            $survey_check_stmt->close();

            // まだ回答がなければ、フラグをtrueにする
            if ($count === 0) {
                $show_survey_flag = true;
            }
        }

        // 応答データに、アンケート表示フラグを追加する
        http_response_code(200);
        echo json_encode([
            'success' => true, 
            'message' => '応募が完了しました。',
            'show_participation_survey' => $show_survey_flag
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'データベースへの登録に失敗しました。']);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'サーバーエラーが発生しました: ' . $e->getMessage()]);
}
