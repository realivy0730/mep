<!-- src/views/stores/Show.vue -->
<template>
    <div class="store-detail-page">
        <!-- 固定標頭 -->
        <header class="header">
            <div class="header-content">
                <button class="back-btn" @click="$router.go(-1)">
                    <span class="material-icons">arrow_back</span>
                </button>
                <h1 class="page-title">{{ brandData.name || '門市資訊' }}</h1>
            </div>
        </header>

        <main class="main-content">
            <!-- 載入中顯示 -->
            <div v-if="loading" class="loading-container">
                <div class="loading-spinner"></div>
                <p>載入中...</p>
            </div>

            <!-- 錯誤顯示 -->
            <div v-else-if="error" class="error-container">
                <p class="error-message">{{ errorMessage }}</p>
                <button @click="fetchStoreData" class="retry-btn">重新嘗試</button>
            </div>

            <!-- 門市內容 -->
            <main v-else class="store-content">
                <div class="content-container">
                    <!-- 門市標頭與圖片 -->
                    <div class="store-header">
                        <img :src="getImageUrl(storeData.profile?.representative_image || storeData.list_image)"
                            alt="門市圖片" class="store-image">
                    </div>

                    <!-- 店鋪詳細資訊 -->
                    <section class="store-description-overlay">
                        <h3 class="store-title">{{ storeData.name }}</h3>
                        <p class="store-address">{{ getFullAddress(storeData) }}</p>
                        <!-- 聯絡資訊 -->
                        <div class="contact-info">
                            <h2 class="details-title">聯絡資訊</h2>
                            <div class="info-item" v-if="storeData.profile?.phone">
                                <span class="material-icons">phone</span>
                                <a :href="`tel:${storeData.profile.phone}`">{{ storeData.profile.phone }}</a>
                            </div>
                            <div class="info-item" v-if="storeData.profile?.google_map_link">
                                <span class="material-icons">map</span>
                                <a :href="storeData.profile.google_map_link" target="_blank" rel="noopener noreferrer">在
                                    Google Maps 查看位置</a>
                            </div>
                        </div>

                        <!-- 社群連結 -->
                        <div class="social-links" v-if="storeData.social_links && storeData.social_links.length > 0">
                            <h2 class="details-title">線上訂購</h2>
                            <div class="link-item" v-for="(link, index) in storeData.social_links" :key="index">
                                <span class="material-icons">shopping_cart</span>
                                <a :href="link.link" target="_blank" rel="noopener noreferrer">立即訂購</a>
                            </div>
                        </div>

                        <!-- 營業時間 -->
                        <div class="business-hours">
                            <h2 class="details-title">營業時間</h2>
                            <ul class="hours-list" v-if="hasBusinessHours">
                                <li class="hours-item" v-for="(day, index) in formatBusinessHours" :key="index">
                                    <span class="day-name" :class="{ 'current-day': day.isToday }">{{ day.name }}</span>
                                    <span class="hours" v-if="day.isOpen">{{ day.hours || '營業中' }}</span>
                                    <span class="hours closed" v-else>公休</span>
                                </li>
                            </ul>
                            <p v-else class="no-hours">暫無營業時間資訊</p>
                        </div>
                    </section>
                </div>
            </main>
        </main>
        <!-- 頁尾元件 -->
        <Footer />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Footer from '@/components/Footer.vue'
import { ApiService } from '@/services/api'
import { handleError } from '@/utils/errorHandler'

// 路由參數
const route = useRoute()
const storeId = route.params.store

// 狀態管理
const storeData = ref({})
const brandData = ref({}) // 品牌資料參考
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('無法載入門市資訊，請稍後再試')

/**
 * 取得完整地址字串
 * @param {Object} store - 門市資料
 * @returns {String} 完整地址
 */
const getFullAddress = (store) => {
    if (!store || !store.profile) return '地址不詳'

    const { county, district, address } = store.profile
    return `${county || ''}${district || ''}${address || ''}`
}

/**
 * 處理圖片 URL
 * @param {String} url - 原始圖片路徑
 * @returns {String} 處理後的圖片 URL
 */
const getImageUrl = (url) => {
    // 設定預設圖片 - SVG 資料 URL
    const defaultImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="100" y="100" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="%23999"%3E門市圖片%3C/text%3E%3C/svg%3E';

    // 處理空值或無效值
    if (!url || url === '(不明)' || url === '') {
        return defaultImage;
    }

    // 如果是 Data URL（如 data:image/...），直接返回
    if (typeof url === 'string' && url.startsWith('data:')) {
        return url;
    }

    // 如果是非字串類型，直接返回預設圖片
    if (typeof url !== 'string') {
        return defaultImage;
    }

    // 處理相對路徑
    if (url.startsWith('/')) {
        return `https://cdn.crm.ddpay.ai${url}`;
    }

    // 已經是完整路徑
    if (url.startsWith('http')) {
        return url;
    }

    // 其他情況
    return `https://cdn.crm.ddpay.ai/${url}`;
}

/**
 * 檢查是否有營業時間資訊
 */
const hasBusinessHours = computed(() => {
    return storeData.value &&
        storeData.value.profile &&
        storeData.value.profile.business_hours &&
        storeData.value.profile.business_hours.length > 0;
})

/**
 * 格式化營業時間
 */
const formatBusinessHours = computed(() => {
    if (!hasBusinessHours.value) return [];

    const weekdayNames = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    const today = new Date().getDay(); // 0 是星期日，1-6 是星期一到星期六
    const todayIndex = today === 0 ? 6 : today - 1; // 轉換為我們的索引 (0-6, 星期一到星期日)

    return storeData.value.profile.business_hours.map((day, index) => {
        const isOpen = day.is_open;
        let hours = '';

        // 若有時間資訊則格式化顯示
        if (isOpen && day.time && day.time.length > 0) {
            hours = day.time.map(time => {
                const start = time.start_at || '';
                const end = time.end_at || '';
                if (start && end) {
                    return `${start} - ${end}`;
                }
                return '';
            }).filter(time => time).join(', ');
        }

        return {
            name: weekdayNames[index],
            isOpen,
            hours,
            isToday: index === todayIndex
        };
    });
})

/**
 * 獲取門市資料
 */
const fetchStoreData = async () => {
    loading.value = true;
    error.value = false;

    try {
        // 從 API 獲取資料
        const data = await ApiService.getTreeCache();

        // 尋找符合 ID 的門市
        if (data && data.brands) {
            // 尋找所有門市
            const allStores = [];
            data.brands.forEach(brand => {
                if (brand.stores && brand.stores.length > 0) {
                    brand.stores.forEach(store => {
                        allStores.push({
                            ...store,
                            brandId: brand.id, // 儲存關聯的品牌 ID
                            brandName: brand.name // 儲存關聯的品牌名稱
                        });
                    });
                }
            });

            // 根據 ID 或 UUID 尋找特定門市
            const foundStore = allStores.find(store =>
                store.id.toString() === storeId ||
                store.uuid === storeId
            );

            if (foundStore) {
                storeData.value = foundStore;

                // 尋找此門市所屬的品牌
                const parentBrand = data.brands.find(brand =>
                    brand.id === foundStore.brand_id
                );

                if (parentBrand) {
                    brandData.value = parentBrand;
                } else if (foundStore.brandName) {
                    // 使用我們在 allStores 中擴充的品牌資訊
                    brandData.value = { name: foundStore.brandName };
                } else {
                    // 找不到品牌時設置預設值
                    brandData.value = { name: '麵匡匡' };
                }
            } else {
                throw new Error('找不到指定的門市資訊');
            }
        } else {
            throw new Error('資料格式異常');
        }
    } catch (err) {
        handleError(err, '獲取門市資料');
        error.value = true;
        errorMessage.value = err.message || '無法載入門市資訊，請稍後再試';
    } finally {
        loading.value = false;
    }
}

// 元件掛載時獲取資料
onMounted(() => {
    fetchStoreData();
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;



/* 門市標頭與圖片 */
.store-header {
    position: relative;
    width: 100%;
    color: white;
    margin-bottom: $spacing-lg;
    overflow: hidden;
    padding-bottom: 56%;
}

.store-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}


.store-description-overlay {
    position: relative;
    z-index: 2;
    margin: 0 auto;
    margin-top: -30px;
    margin-bottom: 20px;
    background-color: var(--white);
    padding: 16px;
    border-radius: 8px;
    max-width: 80%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.store-title {
    font-size: var(--font-size-h3);
    font-weight: bold;
    text-align: center;
    margin-bottom: $spacing-sm;
    color: var(--heading);
}

.store-address {
    font-size: var(--font-size-body);
    line-height: 1.6;
    margin: 0;
    text-align: center;
    color: var(--body-text);
}

/* 聯絡資訊 */
.contact-info {
    margin-top: $spacing-lg;
    margin-bottom: $spacing-lg;
}

.details-title {
    font-size: var(--font-size-h4);
    color: var(--heading);
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid var(--border-disabled);
}

.info-item {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-sm;

    .material-icons {
        margin-right: $spacing-sm;
        color: var(--primary);
    }

    a {
        color: var(--body-text);
        text-decoration: none;

        &:hover {
            color: var(--primary);
            text-decoration: underline;
        }
    }
}

/* 社群連結 */
.social-links {
    margin-bottom: $spacing-lg;
}

.link-item {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-sm;

    .material-icons {
        margin-right: $spacing-sm;
        color: var(--primary);
    }

    a {
        color: var(--primary);
        text-decoration: none;
        font-weight: 500;

        &:hover {
            text-decoration: underline;
        }
    }
}

/* 營業時間 */
.business-hours {
    margin-bottom: $spacing-lg;
}

.hours-list {
    list-style: none;
    padding: 0;
}

.hours-item {
    display: flex;
    justify-content: space-between;
    font-size: var(--font-size-body);
    padding: $spacing-sm 0;
    border-bottom: 1px solid var(--border-disabled);

    &:last-child {
        border-bottom: none;
    }

    .day-name {
        font-weight: 500;

        &.current-day {
            color: var(--primary);
            font-weight: bold;
        }
    }

    .hours {
        color: var(--body-text);

        &.closed {
            color: var(--down);
        }
    }
}

.no-hours {
    color: var(--placeholder);
    font-style: italic;
    text-align: center;
    padding: $spacing-md 0;
}

/* 響應式設計 */
@media (max-width: 768px) {


    .store-description-overlay {
        padding: $spacing-sm;
        margin-top: -30px;
    }
}
</style>
