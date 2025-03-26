/**
 * 共用 Header 元件加載與控制
 */
document.addEventListener('DOMContentLoaded', function() {
  // 加載 Header 元件
  loadHeaderComponent();
});

/**
 * 加載 Header 元件到頁面中
 */
function loadHeaderComponent() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (!headerPlaceholder) return;

  // 使用 fetch API 加載 header.html 檔案
  fetch('components/header.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('無法加載 Header 元件');
      }
      return response.text();
    })
    .then(html => {
      // 將 HTML 插入到佔位符元素中
      headerPlaceholder.innerHTML = html;
      
      // 設置當前頁面的導航項目為活動狀態
      setActiveNavItem();
    })
    .catch(error => {
      console.error('加載 Header 元件時發生錯誤:', error);
    });
}

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
  } else if (currentPage.includes('products')) {
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
