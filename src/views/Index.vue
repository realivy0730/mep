<template>
    <div class="page-container">
        <!-- 固定的 Header -->
        <header class="header">
            <div class="header-content">
                <h1 class="username">{{ appData?.userInfo?.fullName || '訪客用戶' }}</h1>
                <button class="notification-btn">
                    <span class="material-icons">notifications</span>
                    <span class="notification-dot"></span>
                </button>
            </div>
        </header>

        <!-- 主要內容區域 -->
        <main class="main-content">
            <div class="content-container">
                <div class="profile-page">
                    <!-- 點數和票券資訊 -->
                    <div class="info-cards" v-if="appData && !loading">
                        <div class="info-card">
                            <div class="info-value">
                                <span class="info-number">{{ appData.userInfo.points }}</span>
                                <span>點</span>
                            </div>
                            <div class="info-label">會員點數</div>
                        </div>
                        <div class="info-card">
                            <div class="info-value">
                                <span class="info-number">{{ appData.userInfo.tickets }}</span>
                                <span>張</span>
                            </div>
                            <div class="info-label">電子票券</div>
                        </div>
                    </div>
                    <div v-else-if="loading" class="loading">
                        <div class="loading-spinner"></div>
                        <p>資料載入中...</p>
                    </div>
                    <div v-else class="error-message">無法載入資料，請稍後再試</div>

                    <!-- 品牌資訊 -->
                    <section class="brand-section" v-if="appData && !loading">
                        <h2>品牌資訊</h2>

                        <ul class="brand-list">
                            <li class="brand-card" v-for="brand in appData.brands" :key="brand.id">
                                <a :href="`/brands/${brand.id}`">
                                    <div class="brand-image"
                                        :style="{ backgroundImage: `url(${getImageUrl(brand.image)})` }">
                                    </div>
                                    <h3 class="brand-name">{{ brand.name }}</h3>
                                </a>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </main>

        <!-- 頁尾元件 -->
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Footer from '@/components/Footer.vue';
import { ApiService, AppData } from '@/services/api';
import { handleError } from '@/utils/errorHandler';

// 資料狀態
const appData = ref<AppData | null>(null);
const loading = ref(true);
const error = ref<Error | null>(null);
const isDebug = ref(import.meta.env.MODE === 'development');

/**
 * 處理圖片 URL
 * 根據不同情況處理圖片 URL 並提供預設圖片
 * @param url - 原始圖片 URL
 * @returns 處理後的圖片 URL
 */
const getImageUrl = (url: string): string => {
    // 處理空值或無效值
    if (!url || url === '(不明)') {
        // 使用 Data URL 作為預設圖片，避免路徑問題
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="100" y="100" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="%23999"%3E品牌圖片%3C/text%3E%3C/svg%3E';
    }

    // 檢查 URL 是否已包含完整路徑
    if (url.includes('https://cdn.crm.ddpay.ai/')) {
        return url;
    }

    // 檢查 URL 是否已包含其他 CDN 路徑
    if (url.includes('https://cdn')) {
        return url;
    }

    // 如果 URL 已經是其他絕對路徑
    if (url.startsWith('http')) {
        return url;
    }

    // 處理相對路徑，確保使用正確的基礎 URL
    const baseUrl = 'https://cdn.crm.ddpay.ai';
    return baseUrl + (url.startsWith('/') ? url : '/' + url);
};


/**
 * 處理圖片載入錯誤
 * 當背景圖片載入失敗時，替換為預設圖片
 * @param event - 事件物件
 */
const handleImageError = (event: Event) => {
    if (event.target) {
        const element = event.target as HTMLElement;
        element.style.backgroundImage = 'url("/assets/images/default-brand-logo.png")';
    }
};

/**
 * 獲取應用程式資料
 * 從 API 服務獲取並設置應用程式所需資料
 */
const fetchAppData = async () => {
    try {
        loading.value = true;
        // 使用 API 服務獲取資料
        const data = await ApiService.getAppData();

        // 檢查品牌資料
        if (data.brands && data.brands.length > 0) {
            console.log('第一個品牌資料:', data.brands[0]);
            console.log('品牌圖片路徑:', data.brands[0].logo_image);
            console.log('處理後的圖片 URL:', getImageUrl(data.brands[0].logo_image));
        }

        appData.value = data;
    } catch (err) {
        error.value = err instanceof Error ? err : new Error('獲取資料時發生未知錯誤');
        handleError(error.value, '獲取首頁資料');
    } finally {
        loading.value = false;
    }
};

// 在元件掛載時獲取資料
onMounted(() => {
    fetchAppData();
});
</script>


<style scoped lang="scss">
@use '@/assets/styles/main' as *;

.content-container {
    padding: 16px;
}

.username {
    font-size: var(--font-size-h3);
    font-weight: 500;
    color: var(--heading);
}

.notification-btn {
    position: relative;
    background: none;
    border: none;
    padding: $spacing-sm;
    color: var(--nav-text);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notification-dot {
    position: absolute;
    top: $spacing-sm;
    right: $spacing-sm;
    width: 8px;
    height: 8px;
    background-color: var(--primary);
    border-radius: 50%;
}


/* 個人資料頁面樣式 */
.profile-page {
    background-color: transparent;
}

/* 點數和票券資訊卡片 */
.info-cards {
    display: grid;
    grid-template-columns: 2fr 2fr;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
}

.info-card {
    background-color: var(--white);
    padding: $spacing-md;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.info-value {
    font-size: var(--font-size-body);
    color: var(--primary);
}

.info-number {
    font-size: var(--font-size-h1);
    font-weight: bold;
}

.info-label {
    font-size: var(--font-size-body);
    color: var(--heading);
    margin-top: $spacing-xs;
}

/* 品牌資訊卡片 */
.brand-section {
    h2 {
        font-size: var(--font-size-h2);
        color: var(--heading);
        margin-bottom: $spacing-md;
    }
}

.brand-list {
    list-style: none;
    padding: 0;
    display: grid;
    gap: $spacing-md;
}

.brand-list li {
    padding: $spacing-lg;
}

.brand-card {
    background-color: var(--white);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    margin-bottom: $spacing-md;

    a {
        text-decoration: none;
        color: inherit;
        display: block;
    }
}

.brand-image {
    position: relative;
    width: 100%;
    height: 394px;
    /* 根據 16:9 比例 */
    background-size: cover;
    background-position: center;
    background-color: var(--background-light);
    /* 預設背景色，避免空白 */
}

.brand-name {
    font-size: var(--font-size-h3);
    font-weight: bold;
    text-align: center;
    padding: $spacing-sm;
    color: var(--heading);
    margin: 0;
}

/* 載入中與錯誤訊息 */
.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-lg;
    text-align: center;
}

.loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid var(--primary);
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: $spacing-md;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.error-message {
    text-align: center;
    padding: $spacing-md;
    color: var(--down);
}

/* 響應式設計 */
@media (max-width: 768px) {

    .brand-image {
        height: 200px;
        /* 手機端縮小圖片高度 */
    }
}
</style>
