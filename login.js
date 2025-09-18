document.addEventListener('DOMContentLoaded', function () {
    const sessionId = localStorage.getItem('session_id');
    if (sessionId) {
        fetch('php/verify_session.php', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + sessionId
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.href = 'home.php';
            } else {
                localStorage.removeItem('session_id');
            }
        })
        .catch(error => {
            console.error('Session verification request failed:', error);
        });
    }

    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password-input');
    const passwordToggle = document.getElementById('password-toggle');
    const eyeIcon = document.getElementById('eye-icon');

    if (passwordToggle) {
        passwordToggle.addEventListener('click', function () {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.classList.remove('fa-eye');
                eyeIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                eyeIcon.classList.remove('fa-eye-slash');
                eyeIcon.classList.add('fa-eye');
            }
        });
    }

    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('login-form').dispatchEvent(new Event('submit', { cancelable: true }));
        });
    }

    const popupMessage = document.getElementById('popup-message');
    function showPopupMessage(message, isSuccess) {
        if (!popupMessage) return; // 要素がなければ何もしない
        popupMessage.textContent = message;
        popupMessage.className = `popup-message ${isSuccess ? 'success' : 'error'} show`;
        setTimeout(() => { popupMessage.classList.remove('show'); }, 3000);
    }

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');

        const formData = new FormData(loginForm);

        fetch(loginForm.action, { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.session_id) {
                // ✅ セッションID保存
                localStorage.setItem('session_id', data.session_id);

                // ✅ スタンプ保存
                const obtainedStamps = {};
                if (Array.isArray(data.acquired_stamps)) {
                    data.acquired_stamps.forEach(item => {
                        const stampKey = `stamp${item.stamp_id}`;
                        obtainedStamps[stampKey] = {
                            date: item.acquired_at || '（サーバーから同期）'
                        };
                    });
                }
                localStorage.setItem('obtainedStamps', JSON.stringify(obtainedStamps));

                // ✅ 応募者情報保存
                if (data.user_info) {
                    const { name, tel, zip, address, email, appliedProducts } = data.user_info;
                    if (name) localStorage.setItem('name', name);
                    if (tel) localStorage.setItem('tel', tel);
                    if (zip) localStorage.setItem('zip', zip);
                    if (address) localStorage.setItem('address', address);
                    if (email) localStorage.setItem('email', email);
                    if (appliedProducts && Array.isArray(appliedProducts)) {
                        localStorage.setItem('appliedProducts', JSON.stringify(appliedProducts));
                    }
                }

                if (data.unlockedPrizes) {
                    localStorage.setItem('unlockedPrizes', JSON.stringify(data.unlockedPrizes));
                }

                // 初回アンケートのフラグをチェックして保存
                if (data.show_survey === true) {
                    localStorage.setItem('show_survey', 'true');
                }

                // ✅ ページ遷移
                window.location.href = 'home.php';
            } else if (data.errors) {
                Object.keys(data.errors).forEach(fieldName => {
                    const input = loginForm.querySelector(`[name="${fieldName}"]`);
                    if (input) {
                        input.classList.add('is-invalid');
                        let errorElement = input.closest('.form-group')?.querySelector('.invalid-feedback')
                            || document.getElementById(fieldName + '-error')
                            || (() => {
                                let el = input.nextElementSibling;
                                while (el && !el.classList.contains('invalid-feedback')) el = el.nextElementSibling;
                                return el;
                            })();

                        if (errorElement) {
                            errorElement.textContent = data.errors[fieldName];
                            errorElement.style.display = 'block';
                            errorElement.style.color = 'red';
                        } else {
                            console.warn(`エラーメッセージ要素が見つかりません: ${fieldName}`);
                        }
                    }
                });
            } else {
                showPopupMessage(data.error || '不明なエラーが発生しました。', false);
            }
        })
        .catch(error => {
            showPopupMessage('リクエスト中にエラーが発生しました。', false); 
            console.error('Error:', error);
        });
    });
});
