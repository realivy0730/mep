const switchTabs = document.querySelectorAll('.switch-tab');
const slider = document.querySelector('.slider');

// 設定開關標籤切換功能
switchTabs.forEach((tab, index) => {
    tab.addEventListener('click', function () {
        // 移除所有標籤的活動狀態
        switchTabs.forEach(t => t.classList.remove('active'));

        // 隱藏所有內容
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // 設置當前標籤為活動狀態
        this.classList.add('active');

        // 移動滑塊
        if (index === 0) {
            slider.style.left = '3px';
            slider.style.width = '50%';
        } else {
            // 針對寬度不同的標籤，調整滑塊寬度
            slider.style.left = '50%';
            slider.style.width = '50%';
        }

        // 顯示對應的內容
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId + '-tab').classList.add('active');
    });
});

// 初始化滑塊位置和寬度
function initializeSlider() {
    const activeTab = document.querySelector('.switch-tab.active');
    const index = Array.from(switchTabs).indexOf(activeTab);

    if (index === 0) {
        slider.style.left = '3px';
        slider.style.width = '50%';
    } else {
        slider.style.left = '50%';
        slider.style.width = '50%';
    }
}

// 頁面加載後初始化滑塊
window.addEventListener('load', initializeSlider);
window.addEventListener('resize', initializeSlider);

// 密碼顯示/隱藏功能
document.querySelector('.password-toggle').addEventListener('click', function () {
    const passwordInput = document.querySelector('input[type="password"]');
    const icon = this;

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
});
