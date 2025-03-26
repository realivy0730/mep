/**
 * 共用 Footer 元件加載
 */
document.addEventListener('DOMContentLoaded', function() {
  // 加載 Footer 元件
  loadFooterComponent();
});

/**
 * 加載 Footer 元件到頁面中
 */
function loadFooterComponent() {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (!footerPlaceholder) return;

  // 使用 fetch API 加載 footer.html 檔案
  fetch('components/footer.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('無法加載 Footer 元件');
      }
      return response.text();
    })
    .then(html => {
      // 將 HTML 插入到佔位符元素中
      footerPlaceholder.innerHTML = html;
      
      // 可以在這裡添加 Footer 相關的其他初始化代碼
      updateVisitorCount();
    })
    .catch(error => {
      console.error('加載 Footer 元件時發生錯誤:', error);
    });
}

/**
 * 更新訪問人數（示例函數）
 * 實際應用中可能需要從後端 API 獲取數據
 */
function updateVisitorCount() {
  // 這裡只是一個示例，實際應用中可能需要從後端 API 獲取數據
  const today = new Date();
  const dateString = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
  
  const visitorCountElements = document.querySelectorAll('.visitor-counts p');
  if (visitorCountElements.length > 0) {
    visitorCountElements[0].textContent = `${dateString}瀏覽人數：${String(Math.floor(Math.random() * 1000)).padStart(6, '0')}`;
  }
}
