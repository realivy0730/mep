// 登入頁面專用 JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // 切換密碼顯示/隱藏
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // 切換登入和註冊表單的分頁
    const tabs = document.querySelectorAll('.login-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // 處理分頁切換行為
            if (this.textContent.includes('註冊')) {
                // 點擊註冊分頁時的處理
                window.location.href = 'register.html'; // 可以改成實際的註冊頁面或下載表單的URL
            }
        });
    });

    // 驗證碼重新產生功能
    const refreshCaptcha = document.querySelector('.refresh-captcha');
    const captchaImage = document.querySelector('.captcha-image');

    if (refreshCaptcha && captchaImage) {
        refreshCaptcha.addEventListener('click', function (e) {
            e.preventDefault();
            // 在實際應用中，這裡會重新請求後端產生新的驗證碼
            // 這裡只是模擬更新驗證碼圖片的效果
            captchaImage.src = 'images/captcha.png?t=' + new Date().getTime();
        });
    }

    // 表單提交處理
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const companyId = document.getElementById('company-id').value;
            const password = document.getElementById('password').value;
            const captcha = document.getElementById('captcha').value;

            // 基本欄位驗證
            if (!companyId) {
                alert('請輸入廠商帳號');
                return;
            }

            if (!password) {
                alert('請輸入密碼');
                return;
            }

            if (!captcha) {
                alert('請輸入驗證碼');
                return;
            }

            // 實際應用中，這裡會發送登入請求到後端
            console.log('登入資訊:', { companyId, password, captcha });

            // 模擬登入成功後重定向到首頁或會員中心
            // window.location.href = 'index.html';
        });
    }
});
