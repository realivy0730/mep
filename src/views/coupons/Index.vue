<template>
    <div class="page-container">
        <!-- 固定標頭 -->
        <header class="header">
            <div class="header-content">
                <button class="back-button" @click="$router.go(-1)">
                    <span class="material-icons">arrow_back</span>
                </button>
                <h1 class="page-title">票券</h1>
                <div class="header-right"></div>
            </div>
        </header>

        <!-- 主要內容區域 -->
        <main class="main-content">
            <div class="coupon-content">
                <!-- 標籤切換 -->
                <div class="tabs-container">
                    <div class="tabs">
                        <button class="tab-button" :class="{ 'active': activeTab === 'list' }"
                            @click="activeTab = 'list'">
                            票券列表
                        </button>
                        <button class="tab-button" :class="{ 'active': activeTab === 'history' }"
                            @click="activeTab = 'history'">
                            歷史紀錄
                        </button>
                    </div>
                    <div class="tab-indicator" :class="activeTab"></div>
                </div>

                <div class="content-container">
                    <!-- 票券列表頁篩選選項 -->
                    <div class="filter-container" v-if="activeTab === 'list'">
                        <div class="filter-dropdown" @click="toggleSortDropdown">
                            <span class="selected-option">{{ selectedSort.name }}</span>
                            <span class="dropdown-icon">
                                <span class="material-icons">expand_more</span>
                            </span>
                        </div>
                        <div class="dropdown-options" v-if="sortDropdownOpen">
                            <div v-for="option in sortOptions" :key="option.id" class="dropdown-option"
                                :class="{ 'active': selectedSort.id === option.id }" @click="selectSort(option)">
                                <span>{{ option.name }}</span>
                                <span class="check-icon" v-if="selectedSort.id === option.id">
                                    <span class="material-icons">check</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 歷史記錄頁篩選選項 -->
                    <div class="filter-container" v-if="activeTab === 'history'">
                        <div class="filter-dropdown" @click="toggleStatusDropdown">
                            <span class="selected-option">{{ selectedStatus.name }}</span>
                            <span class="dropdown-icon">
                                <span class="material-icons">expand_more</span>
                            </span>
                        </div>
                        <div class="dropdown-options" v-if="statusDropdownOpen">
                            <div v-for="option in statusOptions" :key="option.id" class="dropdown-option"
                                :class="{ 'active': selectedStatus.id === option.id }" @click="selectStatus(option)">
                                <span>{{ option.name }}</span>
                                <span class="check-icon" v-if="selectedStatus.id === option.id">
                                    <span class="material-icons">check</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 載入中狀態 -->
                    <div v-if="loading" class="loading-state">
                        <div class="loading-spinner"></div>
                        <p>載入中...</p>
                    </div>

                    <!-- 錯誤狀態 -->
                    <div v-else-if="error" class="error-state">
                        <p>{{ error.message || '無法載入票券資訊，請稍後再試' }}</p>
                        <button @click="fetchCoupons" class="retry-button">重試</button>
                    </div>

                    <!-- 票券列表 -->
                    <div v-else-if="activeTab === 'list'" class="coupons-list">
                        <div v-if="filteredCoupons.length === 0" class="empty-state">
                            <p>目前沒有可用的票券</p>
                        </div>
                        <div v-else class="coupon-items">
                            <div v-for="coupon in filteredCoupons" :key="coupon.id" class="coupon-item"
                                @click="viewCouponDetail(coupon)">
                                <div class="coupon-image">
                                    <img :src="getImageUrl(coupon.image)" alt="票券圖片" />
                                </div>
                                <div class="coupon-detail">
                                    <h3 class="coupon-title">{{ coupon.title }}</h3>
                                    <p class="coupon-deadline">期限: {{ formatDate(coupon.expiry_at || coupon.validUntil)
                                    }}
                                    </p>
                                    <button class="use-button" @click.stop="useCoupon(coupon)">使用</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 歷史紀錄 -->
                    <div v-else-if="activeTab === 'history'" class="history-list">
                        <div class="history-header">
                            <p class="history-title">顯示近三個月</p>
                        </div>

                        <div v-if="filteredHistory.length === 0" class="empty-state">
                            <p>沒有票券使用紀錄</p>
                        </div>
                        <div v-else class="history-items">
                            <div v-for="item in filteredHistory" :key="item.id" class="history-item"
                                @click="viewCouponDetail(item)">
                                <div class="history-content">
                                    <h3 class="history-title">{{ item.title }}</h3>
                                    <p class="history-date">日期: {{ formatDate(item.updated_at) }}</p>
                                    <span class="status-badge" :class="{
                                        'used': item.coupon_use_status === 1 || item.coupon_use_status === '1',
                                        'expired': item.coupon_use_status === 2 || item.coupon_use_status === '2',
                                        'invalid': item.coupon_use_status === 3 || item.coupon_use_status === '3',
                                        'transferred': item.coupon_use_status === 4 || item.coupon_use_status === '4'
                                    }">
                                        {{ item.status_text }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- 頁尾元件 -->
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import Footer from '@/components/Footer.vue';
import { handleError } from '@/utils/errorHandler';
import axiosInstance from '@/utils/axios';

const router = useRouter();

// 狀態管理
const loading = ref(true);
const error = ref<Error | null>(null);
const activeTab = ref('list');

// 票券資料
const availableCoupons = ref<any[]>([]);
const historyItems = ref<any[]>([]);

// 篩選狀態
const sortDropdownOpen = ref(false);
const statusDropdownOpen = ref(false);
const selectedSort = ref({ id: 'expiry', name: '到期日期' });
const selectedStatus = ref({ id: 'all', name: '全部狀態' });

// 篩選選項
const sortOptions = ref([
    { id: 'expiry', name: '到期日期' },
    { id: 'received', name: '領取日期' }
]);
const statusOptions = ref([
    { id: 'all', name: '全部狀態' },
    { id: '1', name: '已核銷' },
    { id: '2', name: '已到期' },
    { id: '3', name: '已失效' },
    { id: '4', name: '已轉贈' }
]);

// 設定預設圖片 - SVG 資料 URL
const defaultCouponImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="100" y="100" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="%23999"%3E票券圖片%3C/text%3E%3C/svg%3E';

/**
 * 處理圖片 URL
 * @param url - 原始圖片 URL
 * @returns 處理後的圖片 URL
 */
const getImageUrl = (url: string): string => {
    // 處理空值或無效值
    if (!url || url === '(不明)' || url === '') {
        return defaultCouponImage;
    }

    // 如果是導入的圖片資源，直接返回
    if (typeof url === 'string' && url.startsWith('data:')) {
        return url;
    }

    // 如果是導入的本地資源，直接返回
    if (typeof url !== 'string') {
        return defaultCouponImage;
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

    // 如果 URL 包含特定的路徑片段，確保使用正確的基礎 URL
    if (url.includes('/data/') || url.startsWith('/data/')) {
        const baseUrl = 'https://cdn.crm.ddpay.ai';
        return baseUrl + (url.startsWith('/') ? url : '/' + url);
    }

    // 處理其他情況的相對路徑
    const baseUrl = 'https://cdn.crm.ddpay.ai/';
    return baseUrl + (url.startsWith('/') ? url.substring(1) : url);
};

// 計算篩選後的票券列表
const filteredCoupons = computed(() => {
    let filtered = [...availableCoupons.value];

    // 根據選擇的排序方式進行排序
    if (selectedSort.value.id === 'expiry') {
        // 依照到期日期從近到遠排序 (使用 expiry_at 欄位)
        filtered.sort((a, b) => {
            const dateA = a.expiry_at ? new Date(a.expiry_at).getTime() : new Date(a.validUntil).getTime();
            const dateB = b.expiry_at ? new Date(b.expiry_at).getTime() : new Date(b.validUntil).getTime();
            return dateA - dateB;
        });
    } else if (selectedSort.value.id === 'received') {
        // 依照領取日期從新到舊排序 (使用 received_at 欄位)
        filtered.sort((a, b) => {
            const dateA = a.received_at ? new Date(a.received_at).getTime() : new Date(a.issuedDate).getTime();
            const dateB = b.received_at ? new Date(b.received_at).getTime() : new Date(b.issuedDate).getTime();
            return dateB - dateA;
        });
    }

    return filtered;
});

// 計算篩選後的歷史紀錄
const filteredHistory = computed(() => {
    let filtered = [...historyItems.value];

    // 依照所選狀態篩選
    if (selectedStatus.value.id !== 'all') {
        filtered = filtered.filter(item =>
            String(item.coupon_use_status) === selectedStatus.value.id
        );
    }

    // 依照更新日期排序 (從新到舊)
    filtered.sort((a, b) => {
        const dateA = a.updated_at ? new Date(a.updated_at).getTime() : new Date(a.usedDate).getTime();
        const dateB = b.updated_at ? new Date(b.updated_at).getTime() : new Date(b.usedDate).getTime();
        return dateB - dateA;
    });

    return filtered;
});

/**
 * 切換排序下拉選單
 */
const toggleSortDropdown = () => {
    sortDropdownOpen.value = !sortDropdownOpen.value;
    if (sortDropdownOpen.value) {
        statusDropdownOpen.value = false;
    }
};

/**
 * 切換狀態下拉選單
 */
const toggleStatusDropdown = () => {
    statusDropdownOpen.value = !statusDropdownOpen.value;
    if (statusDropdownOpen.value) {
        sortDropdownOpen.value = false;
    }
};

/**
 * 選擇排序方式
 * @param option - 排序選項
 */
const selectSort = (option: any) => {
    selectedSort.value = option;
    sortDropdownOpen.value = false;
};

/**
 * 選擇狀態
 * @param status - 狀態選項
 */
const selectStatus = (status: any) => {
    selectedStatus.value = status;
    statusDropdownOpen.value = false;
};

/**
 * 格式化日期
 * @param dateString - 日期字串
 * @returns 格式化後的日期字串 (YYYY-MM-DD)
 */
const formatDate = (dateString: string): string => {
    if (!dateString) return '無日期資訊';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '無效日期';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

/**
 * 取得票券狀態文字
 * @param statusCode - 狀態代碼
 * @returns 狀態文字
 */
const getStatusText = (statusCode: number | string): string => {
    const statusMap: Record<string, string> = {
        '1': '已核銷',
        '2': '已到期',
        '3': '已失效',
        '4': '已轉贈',
        'used': '已核銷',
        'expired': '已到期',
        'invalid': '已失效',
        'transferred': '已轉贈'
    };

    return statusMap[statusCode] || '未知狀態';
};

/**
 * 查看票券詳情
 * @param couponId - 票券ID
 */
const viewCouponDetail = (coupon: any) => {
    // 使用票券的 code 作為路由參數
    const couponCode = coupon.code || coupon.id;
    router.push(`/coupons/${couponCode}`);
};

/**
 * 使用票券功能
 * @param coupon - 票券對象
 */
const useCoupon = (coupon: any) => {
    // 在此處理票券使用邏輯
    // 實際應用中可能需要呼叫 API 來標記票券為已使用狀態
    console.log(`使用票券: ${coupon.title} (${coupon.code || coupon.id})`);

    // 導航到票券詳情頁，並附加使用參數
    router.push(`/coupons/${coupon.code || coupon.id}?action=use`);
};

/**
 * 從 API 獲取票券資料
 */
const fetchCoupons = async () => {
    loading.value = true;
    error.value = null;

    try {
        // 使用 localStorage 檢查是否有快取資料
        const cachedData = localStorage.getItem('api_coupons_summary_data');
        let data;

        if (cachedData) {
            console.log('使用快取的票券資料');
            data = JSON.parse(cachedData);
        } else {
            // 使用 axios 實例發送請求
            try {
                // 嘗試從 SIT 環境獲取資料
                const response = await axiosInstance.get('https://cdn.sit.crm.ddpay.ai/data/boday_test/coupons/summary.json');
                data = response.data;
                console.log('從 SIT 環境獲取的票券資料:', data);
            } catch (sitError) {
                console.error('從 SIT 環境獲取資料失敗，嘗試從生產環境獲取:', sitError);

                // 如果 SIT 環境失敗，嘗試從生產環境獲取
                const response = await axiosInstance.get('https://cdn.crm.ddpay.ai/data/boday_test/coupons/summary.json');
                data = response.data;
                console.log('從生產環境獲取的票券資料:', data);
            }

            // 將資料存入 localStorage 快取
            if (data) {
                localStorage.setItem('api_coupons_summary_data', JSON.stringify(data));
            }
        }

        // 處理可用票券資料
        if (data && data.available_coupons) {
            availableCoupons.value = data.available_coupons.map((coupon: any) => ({
                id: coupon.id || coupon.uuid || `coupon-${Math.random().toString(36).substring(2, 9)}`,
                uuid: coupon.uuid || '',
                code: coupon.code || '',  // 添加票券代碼
                title: coupon.title || coupon.name || '未命名票券',
                description: coupon.description || '',
                image: coupon.image || '',
                brandId: coupon.brandId || coupon.brand_id || 'unknown',
                validUntil: coupon.validUntil || coupon.expiry_at || new Date().toISOString(),
                issuedDate: coupon.issuedDate || coupon.created_at || new Date().toISOString(),
                // 保留原始欄位名稱，以便於排序時使用
                expiry_at: coupon.expiry_at || '',
                received_at: coupon.received_at || '',
                status: coupon.status || 'active'
            }));
        } else if (data && data.coupons) {
            // 向下兼容舊 API 結構
            availableCoupons.value = data.coupons.map((coupon: any) => ({
                id: coupon.id || `coupon-${Math.random().toString(36).substring(2, 9)}`,
                uuid: coupon.uuid || '',
                code: coupon.code || '',  // 添加票券代碼
                title: coupon.title || '未命名票券',
                description: coupon.description || '',
                image: coupon.image || '',
                brandId: coupon.brandId || 'unknown',
                validUntil: coupon.validUntil || new Date().toISOString(),
                issuedDate: coupon.issuedDate || new Date().toISOString(),
                expiry_at: coupon.expiry_at || '',
                received_at: coupon.received_at || '',
                status: coupon.status || 'active'
            }));
        } else {
            availableCoupons.value = [];
        }

        // 處理歷史紀錄資料
        if (data && data.histories) {
            historyItems.value = data.histories.map((item: any) => ({
                id: item.id || item.uuid || `history-${Math.random().toString(36).substring(2, 9)}`,
                uuid: item.uuid || '',
                code: item.code || '',  // 添加票券代碼
                title: item.title || item.name || item.coupon_name || '未命名票券',
                image: item.image || '',
                brandId: item.brandId || item.brand_id || 'unknown',
                usedDate: item.usedDate || item.used_at || new Date().toISOString(),
                updated_at: item.updated_at || new Date().toISOString(),
                coupon_use_status: item.coupon_use_status || 0,
                status_text: getStatusText(item.coupon_use_status)
            }));
        } else if (data && data.history_coupons) {
            historyItems.value = data.history_coupons.map((item: any) => ({
                id: item.id || item.uuid || `history-${Math.random().toString(36).substring(2, 9)}`,
                uuid: item.uuid || '',
                title: item.title || item.name || '未命名票券',
                image: item.image || '',
                brandId: item.brandId || item.brand_id || 'unknown',
                usedDate: item.usedDate || item.used_at || new Date().toISOString(),
                updated_at: item.updated_at || item.usedDate || new Date().toISOString(),
                coupon_use_status: item.coupon_use_status || (item.status === 'used' ? 1 : item.status === 'expired' ? 2 : 0),
                status_text: getStatusText(item.coupon_use_status || item.status)
            }));
        } else if (data && data.history) {
            // 向下兼容舊 API 結構
            historyItems.value = data.history.map((item: any) => ({
                id: item.id || `history-${Math.random().toString(36).substring(2, 9)}`,
                uuid: item.uuid || '',
                title: item.title || '未命名票券',
                image: item.image || '',
                brandId: item.brandId || 'unknown',
                usedDate: item.usedDate || new Date().toISOString(),
                updated_at: item.updated_at || item.usedDate || new Date().toISOString(),
                coupon_use_status: item.coupon_use_status || (item.status === 'used' ? 1 : item.status === 'expired' ? 2 : 0),
                status_text: getStatusText(item.coupon_use_status || item.status)
            }));
        } else {
            historyItems.value = [];
        }

    } catch (err) {
        console.error('獲取票券資料失敗:', err);
        error.value = err instanceof Error
            ? err
            : new Error('獲取票券資料時發生未知錯誤');
        handleError(error.value, '獲取票券資料');

        // 清空資料，顯示錯誤狀態
        availableCoupons.value = [];
        historyItems.value = [];
    } finally {
        loading.value = false;
    }
};

// 監聽點擊事件，點擊頁面其他區域時關閉下拉選單
const setupClickOutsideListener = () => {
    document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.filter-container')) {
            sortDropdownOpen.value = false;
            statusDropdownOpen.value = false;
        }
    });
};

// 監聽標籤變化
watch(activeTab, (newTab) => {
    // 切換標籤時關閉所有下拉選單
    sortDropdownOpen.value = false;
    statusDropdownOpen.value = false;
});

// 組件掛載時執行
onMounted(() => {
    fetchCoupons();
    setupClickOutsideListener();
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;


.coupon-content {
    padding: 16px;
}

/* 標籤切換 */
.tabs-container {
    position: relative;
    margin-bottom: 16px;
}

.tabs {
    display: flex;
    border-bottom: 1px solid var(--border-disabled, #EBEBEB);
}

.tab-button {
    flex: 1;
    background: none;
    border: none;
    padding: 12px 0;
    font-size: 16px;
    font-weight: 500;
    color: var(--body-text, #485771);
    cursor: pointer;
    outline: none;
    position: relative;
    text-align: center;

    &.active {
        color: var(--primary, #FC8802);
    }
}

.tab-indicator {
    position: absolute;
    bottom: 0;
    height: 2px;
    width: 50%;
    background-color: var(--primary, #FC8802);
    transition: transform 0.3s ease;

    &.exchange {
        transform: translateX(0);
    }

    &.history {
        transform: translateX(100%);
    }
}



/* 篩選下拉選單 */
.filter-container {
    position: relative;
    margin-bottom: 16px;
    z-index: 10;
}

.filter-dropdown {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background-color: var(--white, #FFFFFF);
    border: 1px solid var(--border-disabled, #EBEBEB);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    color: var(--heading, #293954);
}

.dropdown-options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: var(--white, #FFFFFF);
    border: 1px solid var(--border-disabled, #EBEBEB);
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 4px;
    max-height: 300px;
    overflow-y: auto;
}

.dropdown-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-disabled, #EBEBEB);
    cursor: pointer;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: rgba(0, 0, 0, 0.02);
    }

    &.active {
        background-color: rgba(0, 0, 0, 0.04);
    }
}

.check-icon {
    color: var(--primary, #FC8802);
}


/* 票券列表樣式 */
.coupon-items {
    display: flex;
    flex-direction: column;
    gap: 1px;
    background-color: var(--border-disabled, #EBEBEB);
}

.coupon-item {
    display: flex;
    background-color: var(--white, #FFFFFF);
    padding: 16px;
    cursor: pointer;
}

.coupon-image {
    width: 120px;
    height: 90px;
    margin-right: 16px;
    flex-shrink: 0;
    border-radius: 8px;
    overflow: hidden;
}

.coupon-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.coupon-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
}

.coupon-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--heading, #293954);
    margin: 0 0 8px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.coupon-deadline {
    font-size: 14px;
    color: var(--body-text, #485771);
    margin: 0 0 16px 0;
}

.use-button {
    padding: 8px 24px;
    background-color: var(--primary, #FC8802);
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    align-self: flex-end;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: var(--primary-hover, #e37a02);
    }

    &:active {
        transform: scale(0.98);
    }
}

/* 歷史紀錄 */
.history-header {
    padding: 10px 16px;
    background-color: #f5f5f5;
    text-align: center;
    font-size: 14px;
    color: var(--body-text, #485771);
    margin-bottom: 1px;
}

.history-items {
    display: flex;
    flex-direction: column;
    gap: 1px;
    background-color: var(--border-disabled, #EBEBEB);
}

.history-item {
    display: flex;
    background-color: var(--white, #FFFFFF);
    padding: 16px;
}

.history-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.history-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--heading, #293954);
    margin: 0 0 8px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.history-date {
    font-size: 12px;
    color: var(--body-text, #485771);
    margin: 0 0 8px 0;
}

.status-badge {
    padding: 4px 12px;
    font-size: 12px;
    border-radius: 16px;
    background-color: var(--note, #666666);
    color: var(--white, #FFFFFF);
    align-self: flex-start;
    display: inline-block;

    &.used {
        background-color: var(--primary, #FC8802);
    }

    &.expired {
        background-color: var(--down, #CC0D39);
    }

    &.invalid {
        background-color: var(--down, #CC0D39);
    }

    &.transferred {
        background-color: var(--note, #666666);
    }
}


/* Safari 瀏覽器適配 */
@supports (-webkit-touch-callout: none) {


    .tabs-container {
        margin-top: calc(56px + max(env(safe-area-inset-top), 20px));
    }
}
</style>
