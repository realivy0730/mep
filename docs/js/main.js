/**
 * 主要 JavaScript 檔案
 */
document.addEventListener('DOMContentLoaded', function() {
  // 設置當前頁面的導航項目為活動狀態
  setActiveNavItem();
});

/**
 * 根據當前頁面 URL 設置對應的導航項目為活動狀態
 */
function setActiveNavItem() {
  // 獲取當前頁面的檔案名稱
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // 移除所有導航項目的活動狀態
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
    const link = item.querySelector('.nav-link');
    if (link) link.classList.remove('active');
  });
  
  // 根據當前頁面設置對應的導航項目為活動狀態
  let activeNavId = '';
  
  if (currentPage.includes('index')) {
    activeNavId = 'nav-home';
  } else if (currentPage.includes('announcements')) {
    activeNavId = 'nav-announcements';
  } else if (currentPage.includes('products') || currentPage.includes('product_page')) {
    activeNavId = 'nav-products';
  } else if (currentPage.includes('faq')) {
    activeNavId = 'nav-faq';
  } else if (currentPage.includes('downloads')) {
    activeNavId = 'nav-downloads';
  } else if (currentPage.includes('login')) {
    activeNavId = 'nav-login';
  }
  
  // 設置活動狀態
  if (activeNavId) {
    const activeItem = document.getElementById(activeNavId);
    if (activeItem) {
      activeItem.classList.add('active');
      const link = activeItem.querySelector('.nav-link');
      if (link) link.classList.add('active');
    }
  }
}
