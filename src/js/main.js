// 主要 JavaScript 檔案
document.addEventListener('DOMContentLoaded', function() {
  console.log('能源效率管理系統頁面已載入');
  
  // 標籤切換功能
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 移除所有標籤的 active 類別
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // 將當前點擊的標籤設為 active
      this.classList.add('active');
    });
  });

  // 分頁功能
  const pageNumbers = document.querySelectorAll('.page-number');
  pageNumbers.forEach(page => {
    page.addEventListener('click', function() {
      // 移除所有頁碼的 active 類別
      pageNumbers.forEach(p => p.classList.remove('active'));
      // 將當前點擊的頁碼設為 active
      this.classList.add('active');
    });
  });

  // 公告項目點擊事件
  const actionButtons = document.querySelectorAll('.action-button');
  actionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const announcementItem = this.closest('.announcement-item');
      const title = announcementItem.querySelector('.announcement-title').textContent;
      alert('您點擊了公告: ' + title);
    });
  });
});
