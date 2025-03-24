<template>
    <div class="page-container">
        <!-- 固定的 Header -->
        <header class="header">
            <div class="header-content">
                <router-link to="/" class="back-button">
                    <span class="material-icons">arrow_back</span>
                </router-link>
                <h1 class="page-title">品牌資訊</h1>
                <div class="header-right"></div>
            </div>
        </header>

        <!-- 主要內容區域 -->
        <main class="main-content">
            <!-- 載入中狀態 -->
            <div v-if="loading" class="loading-state">
                <div class="loading-spinner"></div>
                <p>載入中...</p>
            </div>

            <!-- 錯誤狀態 -->
            <div v-else-if="error" class="error-state">
                <p>{{ error.message || '無法載入品牌資訊，請稍後再試' }}</p>
                <button @click="fetchBrandData" class="retry-button">重試</button>
            </div>

            <!-- 品牌詳情 -->
            <div v-else-if="brandData" class="brand-detail">
                <!-- 品牌資訊 - 疊加在大圖上的設計 -->
                <section class="brand-banner">
                    <!-- 品牌背景大圖 -->
                    <img :src="getImageUrl(brandData.image || brandData.logo_image)" alt="品牌圖片" class="brand-image" />
                </section>
                <!-- 品牌資訊內容 -->
                <div class="brand-content">
                    <div class="brand-info">
                        <div class="brand-description-card">
                            <h1 class="brand-name">{{ brandData.name }}</h1>
                            <p class="brand-description"
                                v-if="brandData.description || (brandData.profile && brandData.profile.description)">
                                {{ brandData.description || (brandData.profile && brandData.profile.description) }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- 門市列表標題 -->
                <h2 class="section-title">門市列表</h2>

                <!-- 地區下拉選擇器 -->
                <div class="region-dropdown-container">
                    <div class="region-dropdown" @click="toggleDropdown">
                        <span class="selected-region">{{ getSelectedRegionName() }}</span>
                        <span class="dropdown-icon">
                            <span class="material-icons">expand_more</span>
                        </span>
                    </div>

                    <!-- 下拉選項容器 -->
                    <div class="dropdown-options" v-if="dropdownOpen">
                        <div v-for="region in regions" :key="region.id" class="dropdown-option"
                            :class="{ 'active': selectedRegion === region.id }" @click="selectRegion(region.id)">
                            <span class="region-name">{{ region.name }}</span>
                            <span class="check-icon" v-if="selectedRegion === region.id">
                                <span class="material-icons">check</span>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 門市列表 -->
                <section class="stores-section" v-if="filteredStores.length > 0">
                    <ul class="store-list">
                        <li v-for="store in filteredStores" :key="store.id" class="store-item">
                            <div class="store-card" @click="selectStore(store)">
                                <div class="store-info">
                                    <div class="location-icon">
                                        <span class="material-icons">location_on</span>
                                    </div>
                                    <div class="store-content">
                                        <h3 class="store-name">{{ store.name }}</h3>
                                        <p class="store-address" v-if="getFullAddress(store)">
                                            {{ getFullAddress(store) }}
                                        </p>
                                    </div>
                                </div>
                                <div class="store-image">
                                    <img :src="getImageUrl(getStoreImage(store))" alt="門市圖片" />
                                </div>
                            </div>
                        </li>
                    </ul>
                </section>

                <!-- 無門市顯示 -->
                <section class="no-stores" v-else>
                    <p>此地區目前沒有門市資訊</p>
                </section>
            </div>

            <!-- 找不到品牌 -->
            <div v-else class="not-found">
                <p>找不到該品牌資訊</p>
                <router-link to="/" class="home-link">返回首頁</router-link>
            </div>
        </main>

        <!-- 頁尾元件 -->
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Footer from '@/components/Footer.vue';
import { ApiService } from '@/services/api';
import { handleError } from '@/utils/errorHandler';

// 設定預設圖片路徑（使用相對於公共目錄的路徑）
// 將圖片檔案放在 public/assets/images/ddpay/ 目錄下
// const defaultStoreImage = '@/assets/images/ddpay/default_store.jpg';

// 路由參數和導航
const route = useRoute();
const router = useRouter();
const brandId = ref(route.params.brand as string);

// 資料狀態
const loading = ref(true);
const error = ref<Error | null>(null);
const brandData = ref<any>(null);
const storesList = ref<any[]>([]);
const regions = ref([
    { id: 'all', name: '全部' },
    { id: 'taipei', name: '台灣區' },
    { id: 'taiwan', name: '台灣' }
]);
const selectedRegion = ref('all');

// 下拉選單狀態
const dropdownOpen = ref(false);

// 監聽路由變化
watch(() => route.params.brand, (newId) => {
    if (newId !== brandId.value) {
        brandId.value = newId as string;
        fetchBrandData();
    }
});

// 根據選擇的地區過濾門市
const filteredStores = computed(() => {
    if (!storesList.value) return [];

    if (selectedRegion.value === 'all') {
        return storesList.value;
    }

    // 根據選擇的地區過濾門市
    return storesList.value.filter((store) => {
        if (selectedRegion.value === 'taipei') {
            return store.profile && (
                store.profile.county === '台北市' ||
                store.profile.county === '新北市'
            );
        }
        if (selectedRegion.value === 'taiwan') {
            return store.profile && store.profile.country === 'tw';
        }
        return true;
    });
});

/**
 * 切換下拉選單顯示狀態
 */
const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
};

/**
 * 選擇地區並關閉下拉選單
 * @param regionId - 地區 ID
 */
const selectRegion = (regionId: string) => {
    selectedRegion.value = regionId;
    dropdownOpen.value = false;
};

/**
 * 獲取當前選中地區的名稱
 * @returns 地區名稱
 */
const getSelectedRegionName = (): string => {
    const selectedRegionObj = regions.value.find(region => region.id === selectedRegion.value);
    return selectedRegionObj ? selectedRegionObj.name : '區域';
};

/**
 * 取得門市完整地址
 * @param store - 門市資料
 * @returns 完整地址字串
 */
const getFullAddress = (store: any): string => {
    if (!store.profile) return '';

    const county = store.profile.county || '';
    const district = store.profile.district || '';
    const address = store.profile.address || '';

    return `${county}${district}${address}`;
};

/**
 * 獲取門市圖片
 * @param store - 門市資料
 * @returns 門市圖片路徑
 */
const getStoreImage = (store: any): string => {
    // 設定預設圖片 - SVG 資料 URL
    const defaultStoreImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="100" y="100" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="%23999"%3E門市圖片%3C/text%3E%3C/svg%3E';
    
    // 優先使用門市的列表圖片
    if (store.list_image && store.list_image !== '(不明)' && store.list_image !== '') {
        return store.list_image;
    }

    // 其次使用門市簡介中的代表圖片
    if (store.profile && store.profile.representative_image &&
        store.profile.representative_image !== '(不明)' &&
        store.profile.representative_image !== '') {
        return store.profile.representative_image;
    }

    // 如果沒有圖片，使用預設門市圖片
    return defaultStoreImage;
};


/**
 * 處理圖片 URL
 * 根據不同情況處理圖片 URL 並提供預設圖片
 * @param url - 原始圖片 URL
 * @returns 處理後的圖片 URL
 */
const getImageUrl = (url: string): string => {
    // 設定預設圖片 - SVG 資料 URL
    const defaultImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="100" y="100" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="%23999"%3E品牌圖片%3C/text%3E%3C/svg%3E';
    
    // 處理空值或無效值
    if (!url || url === '(不明)' || url === '') {
        return defaultImage;
    }

    // 如果是本地路徑（以 / 或 ./ 開頭，或是 /assets 開頭）
    if (
        (typeof url === 'string' && (url.startsWith('/') || url.startsWith('./') || url.startsWith('/assets'))) &&
        !url.includes('data/')
    ) {
        return url;
    }

    // 如果是 Data URL（如 data:image/...），直接返回
    if (typeof url === 'string' && url.startsWith('data:')) {
        return url;
    }

    // 如果是非字串類型，直接返回預設圖片
    if (typeof url !== 'string') {
        return defaultImage;
    }

    // 檢查 URL 是否已包含 CDN 路徑
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

    // 如果 URL 包含特定的路徑片段，確保使用正確的基礎 URL
    if (url.includes('/data/') || url.startsWith('/data/')) {
        const baseUrl = 'https://cdn.crm.ddpay.ai';
        return baseUrl + (url.startsWith('/') ? url : '/' + url);
    }

    // 處理其他情況的相對路徑（可能是 API 返回的路徑）
    const baseUrl = 'https://cdn.crm.ddpay.ai/';
    return baseUrl + (url.startsWith('/') ? url.substring(1) : url);
};

/**
 * 處理門市選擇
 * @param store - 選擇的門市資料
 */
const selectStore = (store: any) => {
    if (store.id) {
        router.push(`/stores/${store.id}`);
    }
};

/**
 * 獲取品牌詳細資料
 * 從 tree_cache.json 獲取品牌和門市資訊
 */
const fetchBrandData = async () => {
    if (!brandId.value) {
        router.push('/');
        return;
    }

    try {
        loading.value = true;
        error.value = null;

        // 直接從 tree_cache.json 獲取原始數據
        const treeCache = await ApiService.getTreeCache();
        console.log('原始 tree_cache 數據:', treeCache);

        // 查找當前品牌數據
        let currentBrand = null;

        // 首先嘗試在 brands 數組中查找
        if (treeCache.brands && Array.isArray(treeCache.brands)) {
            currentBrand = treeCache.brands.find((brand: any) => brand.id.toString() === brandId.value);
        }

        // 如果 brands 是物件而非數組，從物件中查找
        if (!currentBrand && treeCache.brands && typeof treeCache.brands === 'object') {
            const brandsArray = Object.values(treeCache.brands);
            currentBrand = brandsArray.find((brand: any) => brand.id.toString() === brandId.value);
        }

        if (!currentBrand) {
            // 品牌未找到，嘗試使用 getAppData 找到品牌基本信息
            const appData = await ApiService.getAppData();
            const brand = appData.brands.find((b: any) => b.id.toString() === brandId.value);

            if (!brand) {
                error.value = new Error('找不到該品牌資訊');
                return;
            }

            currentBrand = brand;
        }

        // 設置品牌數據
        brandData.value = currentBrand;

        // 查找並設置該品牌的門市列表
        let brandStores: any[] = [];

        // 如果品牌對象中包含 stores 屬性
        if (currentBrand.stores && Array.isArray(currentBrand.stores)) {
            brandStores = currentBrand.stores;
        }
        // 如果在 tree_cache 的根級別有 stores 數組
        else if (treeCache.stores && Array.isArray(treeCache.stores)) {
            // 篩選出屬於當前品牌的門市
            brandStores = treeCache.stores.filter((store: any) =>
                store.brand_id?.toString() === brandId.value
            );
        }

        // 設置門市列表
        storesList.value = brandStores;

        console.log('品牌詳情資料:', brandData.value);
        console.log('門市列表:', storesList.value);
    } catch (err) {
        error.value = err instanceof Error ? err : new Error('獲取品牌詳情時發生未知錯誤');
        handleError(error.value, '獲取品牌詳情');
    } finally {
        loading.value = false;
    }
};

// 在元件掛載時獲取資料和設定事件監聽
onMounted(() => {
    fetchBrandData();

    // 監聽點擊事件，點擊頁面其他區域時關閉下拉選單
    document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.region-dropdown-container')) {
            dropdownOpen.value = false;
        }
    });
});

// 元件卸載時移除事件監聽
onUnmounted(() => {
    document.removeEventListener('click', () => { });
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

/* 品牌詳情樣式 */
.brand-detail {
    display: flex;
    flex-direction: column;
}

/* 品牌 Banner 區域 */
.brand-banner {
    position: relative;
    width: 100%;
    color: white;
    margin-bottom: 20px;
    overflow: hidden;
    padding-bottom: 56%;
}

.brand-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 品牌內容容器 */
.brand-content {
    position: relative;
    z-index: 2;
    margin-top: -30px;
    margin-bottom: 20px;
}

/* 品牌資訊區塊 */
.brand-info {
    text-align: center;
}

/* 品牌描述卡片 */
.brand-description-card {
    background-color: rgba(255, 255, 255, 1);
    padding: 16px;
    border-radius: 8px;
    margin: 0 auto;
    max-width: 600px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.brand-name {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 16px 0;
    color: var(--heading, #333333);
}

.brand-description {
    font-size: 14px;
    margin: 0;
    line-height: 1.5;
    color: var(--body-text, #333333);
    text-align: justify;
}

/* 區段標題 */
.section-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 12px 0;
    padding: 0 16px;
    color: var(--heading, #333333);
}

/* 地區下拉選單 */
.region-dropdown-container {
    position: relative;
    margin: 0 16px 16px;
}

.region-dropdown {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: var(--white, #FFFFFF);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    color: #333333;
}

.dropdown-icon .material-icons {
    font-size: 20px;
    color: #555555;
}

/* 下拉選項 */
.dropdown-options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--white, #FFFFFF);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    margin-top: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
    max-height: 300px;
    overflow-y: auto;
}

.dropdown-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.dropdown-option:last-child {
    border-bottom: none;
}

.dropdown-option:hover {
    background-color: rgba(0, 0, 0, 0.02);
}

.dropdown-option.active {
    background-color: rgba(0, 0, 0, 0.04);
}

.dropdown-option .check-icon {
    color: var(--up, #4CAF50);
}

/* 門市列表樣式 */
.stores-section {
    /* 確保有足夠間距 */
}

.store-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.store-item {
    margin-bottom: 1px;
}

.store-card {
    background-color: var(--white, #FFFFFF);
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
}

.store-info {
    display: flex;
    flex: 1;
}

.location-icon {
    color: var(--primary, #FF9800);
    margin-right: 12px;
    display: flex;
    align-items: flex-start;

    .material-icons {
        font-size: 18px;
    }
}

.store-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.store-name {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 4px 0;
    color: #333333;
}

.store-address {
    font-size: 12px;
    color: var(--primary, #FF9800);
    margin: 0;
}

.store-image {
    width: 80px;
    height: 60px;
    margin-left: 12px;
    overflow: hidden;
    border-radius: 4px;
}

.store-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.no-stores {
    padding: 24px 16px;
    text-align: center;
    color: var(--note, #666666);
}


/* 響應式設計 */
@media (max-width: 768px) {

    .brand-content {
        padding: 0 $spacing-sm;
    }

    .section-title {
        padding: 0 $spacing-sm;
    }

    .region-dropdown-container {
        margin: 0 $spacing-sm $spacing-md;
    }
}
</style>
