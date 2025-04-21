// Tab 切換功能
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // 移除所有 tab 的 active 類
            tabs.forEach(t => t.classList.remove('active'));

            // 為當前點擊的 tab 添加 active 類
            this.classList.add('active');

            // 獲取對應的 tab 內容
            const tabId = this.getAttribute('data-tab');

            // 隱藏所有 tab 內容
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });

            // 顯示當前選擇的 tab 內容
            document.getElementById(tabId).classList.add('active');
        });
    });
});
