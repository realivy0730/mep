<!-- src/views/points/Index.vue -->
<template>
    <div class="page-container">
        <!-- 固定標頭 -->
        <header class="header">
            <div class="header-content">
                <div class="header-spacer"></div>
                <h1 class="page-title">點數</h1>
                <div class="header-right">
                    <router-link to="/points/info" class="info-button">
                        <span class="material-icons">info_outline</span>
                    </router-link>
                </div>
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
                <p>{{ error.message || '無法載入點數資訊，請稍後再試' }}</p>
                <button @click="fetchUserData" class="retry-button">重試</button>
            </div>

            <!-- 點數資訊 -->
            <div v-else class="points-content">
                <!-- 點數卡片區域 -->
                <section class="points-cards">
                    <div class="points-card total">
                        <div class="points-amount">{{ formatNumber(userData.points || 0) }} <span class="unit">點</span>
                        </div>
                        <div class="card-title">會員點數</div>
                    </div>

                    <div class="points-card expiring">
                        <div class="points-amount">{{ formatNumber(userData.expiringPoints || 0) }} <span
                                class="unit">點</span></div>
                        <div class="card-title">即將到期點數</div>
                        <div class="expiry-date">{{ formatExpiryDate(userData.expiryDate) }}</div>
                    </div>
                </section>

                <!-- 標籤切換 -->
                <div class="tabs-container">
                    <div class="tabs">
                        <button class="tab-button" :class="{ 'active': activeTab === 'exchange' }"
                            @click="activeTab = 'exchange'">
                            兌換列表
                        </button>
                        <button class="tab-button" :class="{ 'active': activeTab === 'history' }"
                            @click="activeTab = 'history'">
                            歷史紀錄
                        </button>
                    </div>
                    <div class="tab-indicator" :class="activeTab"></div>
                </div>

                <!-- 品牌篩選下拉選單 -->
                <div v-if="activeTab === 'exchange'" class="filter-container">
                    <div class="filter-dropdown" @click="toggleBrandDropdown">
                        <span class="selected-brand">{{ selectedBrand.name }}</span>
                        <span class="dropdown-icon">
                            <span class="material-icons">expand_more</span>
                        </span>
                    </div>

                    <!-- 下拉選項 -->
                    <div class="dropdown-options" v-if="brandDropdownOpen">
                        <div v-for="brand in brandOptions" :key="brand.id" class="dropdown-option"
                            :class="{ 'active': selectedBrand.id === brand.id }" @click="selectBrand(brand)">
                            <span class="brand-name">{{ brand.name }}</span>
                            <span class="check-icon" v-if="selectedBrand.id === brand.id">
                                <span class="material-icons">check</span>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 兌換列表內容 -->
                <div v-if="activeTab === 'exchange'" class="tab-content">
                    <div class="exchange-list">
                        <div v-for="item in exchangeItems" :key="item.id" class="exchange-item" @click="viewItemDetail(item)">
                            <div class="item-image">
                                <img :src="getImageUrl(item.image)" alt="商品圖片" />
                            </div>
                            <div class="item-details">
                                <h3 class="item-name">{{ item.name }}</h3>
                                <div class="item-info">
                                    <div class="item-validity">
                                        <span>倒數 {{ item.daysLeft }} 天</span>
                                    </div>
                                    <div class="item-price">
                                        <span>NT${{ item.price }}</span>
                                    </div>
                                </div>
                                <div class="item-points">{{ item.points }}點</div>
                            </div>
                        </div>
                        <div v-if="exchangeItems.length === 0" class="empty-state">
                            <p>目前沒有可兌換項目</p>
                        </div>
                    </div>
                </div>

                <!-- 歷史紀錄內容 -->
                <div v-if="activeTab === 'history'" class="tab-content">
                    <!-- 歷史紀錄狀態篩選 -->
                    <div class="history-filter-container">
                        <div class="history-filter-dropdown" @click="toggleHistoryTypeDropdown">
                            <span class="selected-type">{{ selectedHistoryType.name }}</span>
                            <span class="dropdown-icon">
                                <span class="material-icons">expand_more</span>
                            </span>
                        </div>

                        <!-- 歷史紀錄類型選項 -->
                        <div class="history-dropdown-options" v-if="historyTypeDropdownOpen">
                            <div v-for="type in historyTypeOptions" :key="type.id" class="dropdown-option"
                                :class="{ 'active': selectedHistoryType.id === type.id }"
                                @click="selectHistoryType(type)">
                                <span>{{ type.name }}</span>
                                <span class="check-icon" v-if="selectedHistoryType.id === type.id">
                                    <span class="material-icons">check</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 近三個月標籤 -->
                    <div class="history-time-tag">
                        <span>近三個月</span>
                    </div>

                    <!-- 歷史紀錄列表 -->
                    <div class="history-list">
                        <div v-for="record in filteredHistoryRecords" :key="record.id" class="history-item">
                            <div class="history-item-header">
                                <span class="record-date">{{ formatDate(record.date) }}</span>
                                <span class="record-points" :class="record.type">
                                    {{ record.type === 'earned' ? '+' : record.type === 'spent' ? '-' : '' }}{{
                                        record.points }} 點
                                </span>
                            </div>
                            <div class="history-item-body">
                                <div class="record-type-tag" :class="getTypeClass(record.typeId)">
                                    {{ getTypeLabel(record.typeId) }}
                                </div>
                                <div class="record-description">{{ record.description }}</div>
                            </div>
                        </div>
                        <div v-if="filteredHistoryRecords.length === 0" class="empty-state">
                            <p>暫無點數紀錄</p>
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
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import Footer from '@/components/Footer.vue';
import { ApiService } from '@/services/api';
import { handleError } from '@/utils/errorHandler';

// 路由
const router = useRouter();

// 數據狀態
const loading = ref(true);
const error = ref<Error | null>(null);
const userData = ref<any>({
    points: 3000,
    expiringPoints: 540,
    expiryDate: '2024-10-30',
    totalEarned: 120,
    totalSpent: 86,
    pointsHistory: {
        lastMonth: 23,
        twoMonthsAgo: 38,
        threeMonthsAgo: 15
    }
});

// 標籤狀態
const activeTab = ref('exchange');

// 品牌篩選狀態
const brandDropdownOpen = ref(false);
const selectedBrand = ref({ id: 'all', name: '全部品牌' });
const brandOptions = ref([
    { id: 'all', name: '全部品牌' },
    { id: '1', name: '麵匡匡' },
    { id: '2', name: 'OpuLence 優贊' },
    { id: '3', name: '乾杯燒肉居酒屋' },
    { id: '4', name: '瓦崎燒烤火鍋' }
]);

// 歷史紀錄類型篩選狀態
const historyTypeDropdownOpen = ref(false);
const selectedHistoryType = ref({ id: 'all', name: '所有狀態' });
const historyTypeOptions = ref([
    { id: 'all', name: '所有狀態' },
    { id: 'purchase', name: '購買' },
    { id: 'exchange', name: '兌換' },
    { id: 'return', name: '收回' },
    { id: 'expire', name: '過期' },
    { id: 'add-manual', name: '人工給點' },
    { id: 'deduct-manual', name: '人工扣點' },
    { id: 'transfer-out', name: '轉出' },
    { id: 'transfer-in', name: '轉入' },
    { id: 'insert', name: '匯入' }
]);

// 模擬兌換項目數據
const exchangeItems = ref([
    {
        id: '1',
        name: '日本和牛500g 兌換券',
        points: 100,
        price: 400,
        daysLeft: 7,
        image: '',
        brandId: '1',
        validUntil: new Date('2025-06-30'),
        description: '高級日本和牛，完美油花分布',
        stock: 999
    },
    {
        id: '2',
        name: '日本和牛500g 兌換券',
        points: 100,
        price: 400,
        daysLeft: 7,
        image: '',
        brandId: '1',
        validUntil: new Date('2025-06-30'),
        description: '高級日本和牛，完美油花分布',
        stock: 999
    },
    {
        id: '3',
        name: '日本和牛500g 兌換券',
        points: 100,
        price: 400,
        daysLeft: 7,
        image: '',
        brandId: '1',
        validUntil: new Date('2025-06-30'),
        description: '高級日本和牛，完美油花分布',
        stock: 999
    },
    {
        id: '4',
        name: '日本和牛500g 兌換券',
        points: 100,
        price: 400,
        daysLeft: 7,
        image: '',
        brandId: '1',
        validUntil: new Date('2025-06-30'),
        description: '高級日本和牛，完美油花分布',
        stock: 850
    }
]);

// 模擬歷史紀錄數據
const historyRecords = ref([
    {
        id: '1',
        date: new Date('2025-03-10'),
        type: 'earned',
        typeId: 'purchase',
        description: '麵匡匡台北社子店消費',
        points: 10
    },
    {
        id: '2',
        date: new Date('2025-03-05'),
        type: 'spent',
        typeId: 'exchange',
        description: '兌換溏心蛋',
        points: 6
    },
    {
        id: '3',
        date: new Date('2025-02-28'),
        type: 'earned',
        typeId: 'add-manual',
        description: '活動贈點-店慶活動',
        points: 20
    },
    {
        id: '4',
        date: new Date('2025-02-15'),
        type: 'earned',
        typeId: 'purchase',
        description: '麵匡匡內湖西湖店消費',
        points: 8
    },
    {
        id: '5',
        date: new Date('2025-02-10'),
        type: 'spent',
        typeId: 'exchange',
        description: '兌換麵加倍',
        points: 6
    },
    {
        id: '6',
        date: new Date('2025-01-25'),
        type: 'earned',
        typeId: 'return',
        description: '兌換取消-系統退回',
        points: 8
    },
    {
        id: '7',
        date: new Date('2025-01-20'),
        type: 'spent',
        typeId: 'expire',
        description: '點數到期',
        points: 5
    },
    {
        id: '8',
        date: new Date('2025-01-15'),
        type: 'earned',
        typeId: 'transfer-in',
        description: '從舊會員帳號轉入',
        points: 30
    },
    {
        id: '9',
        date: new Date('2025-01-10'),
        type: 'spent',
        typeId: 'deduct-manual',
        description: '系統誤發點數-人工扣除',
        points: 12
    },
    {
        id: '10',
        date: new Date('2025-01-05'),
        type: 'earned',
        typeId: 'insert',
        description: '會員資料整併-匯入點數',
        points: 15
    }
]);

/**
 * 數字格式化，加入千位分隔符
 * @param num - 要格式化的數字
 * @returns 格式化後的字串
 */
const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * 格式化過期日期
 * @param date - 日期字串
 * @returns 格式化後的日期字串
 */
const formatExpiryDate = (date: string): string => {
    if (!date) return '';

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * 格式化日期為 YYYY/MM/DD 格式
 * @param date - 日期物件或字串
 * @returns 格式化後的日期字串
 */
const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
};

// 設定預設圖片 - SVG 資料 URL
const defaultItemImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="100" y="100" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="%23999"%3E商品圖片%3C/text%3E%3C/svg%3E';

/**
 * 處理圖片 URL
 * @param url - 原始圖片 URL
 * @returns 處理後的圖片 URL
 */
const getImageUrl = (url: string): string => {
    // 處理空值或無效值
    if (!url || url === '(不明)' || url === '') {
        return defaultItemImage;
    }

    // 如果是導入的圖片資源，直接返回
    if (typeof url === 'string' && url.startsWith('data:')) {
        return url;
    }

    // 如果是導入的本地資源，直接返回
    if (typeof url !== 'string') {
        return defaultItemImage;
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

/**
 * 切換品牌下拉選單
 */
const toggleBrandDropdown = () => {
    brandDropdownOpen.value = !brandDropdownOpen.value;
    // 關閉其他下拉選單
    if (brandDropdownOpen.value) {
        historyTypeDropdownOpen.value = false;
    }
};

/**
 * 選擇品牌
 * @param brand - 品牌物件
 */
const selectBrand = (brand: any) => {
    selectedBrand.value = brand;
    brandDropdownOpen.value = false;

    // 篩選兌換項目
    filterExchangeItems();
};

/**
 * 根據所選品牌篩選兌換項目
 */
const filterExchangeItems = () => {
    // 模擬 API 請求
    loading.value = true;

    // 延遲執行，模擬 API 請求時間
    setTimeout(() => {
        // 所有兌換項目的完整列表（假資料）
        const allItems = [
            {
                id: '1',
                name: '日本和牛500g 兌換券',
                points: 100,
                price: 400,
                daysLeft: 7,
                image: '',
                brandId: '1',
                validUntil: new Date('2025-06-30'),
                description: '高級日本和牛，完美油花分布',
                stock: 999
            },
            {
                id: '2',
                name: '日本和牛500g 兌換券',
                points: 100,
                price: 400,
                daysLeft: 7,
                image: '',
                brandId: '1',
                validUntil: new Date('2025-06-30'),
                description: '高級日本和牛，完美油花分布',
                stock: 999
            },
            {
                id: '3',
                name: '日本和牛500g 兌換券',
                points: 100,
                price: 400,
                daysLeft: 7,
                image: '',
                brandId: '1',
                validUntil: new Date('2025-06-30'),
                description: '高級日本和牛，完美油花分布',
                stock: 999
            },
            {
                id: '4',
                name: '日本和牛500g 兌換券',
                points: 100,
                price: 400,
                daysLeft: 7,
                image: '',
                brandId: '1',
                validUntil: new Date('2025-06-30'),
                description: '高級日本和牛，完美油花分布',
                stock: 850
            },
            {
                id: '7',
                name: '精品咖啡兌換券',
                points: 100,
                price: 300,
                daysLeft: 10,
                image: '',
                brandId: '2',
                validUntil: new Date('2025-06-30'),
                description: '可兌換一杯精品咖啡',
                stock: 500
            },
            {
                id: '8',
                name: '手工餅乾組合',
                points: 100,
                price: 350,
                daysLeft: 15,
                image: '',
                brandId: '2',
                validUntil: new Date('2025-06-30'),
                description: '精緻手工餅乾禮盒，3款口味',
                stock: 300
            }
        ];

        // 根據選擇的品牌篩選項目
        if (selectedBrand.value.id === 'all') {
            exchangeItems.value = allItems;
        } else {
            exchangeItems.value = allItems.filter(item => item.brandId === selectedBrand.value.id);
        }

        loading.value = false;
    }, 300); // 300ms 延遲模擬 API 響應時間
};

/**
 * 切換歷史紀錄類型下拉選單
 */
const toggleHistoryTypeDropdown = () => {
    historyTypeDropdownOpen.value = !historyTypeDropdownOpen.value;
    // 關閉其他下拉選單
    if (historyTypeDropdownOpen.value) {
        brandDropdownOpen.value = false;
    }
};

/**
 * 選擇歷史紀錄類型
 * @param type - 紀錄類型物件
 */
const selectHistoryType = (type: any) => {
    selectedHistoryType.value = type;
    historyTypeDropdownOpen.value = false;
};

/**
 * 根據選擇的類型篩選歷史紀錄
 */
const filteredHistoryRecords = computed(() => {
    if (selectedHistoryType.value.id === 'all') {
        return historyRecords.value;
    }
    return historyRecords.value.filter(record => record.typeId === selectedHistoryType.value.id);
});

/**
 * 獲取紀錄類型的樣式類別
 * @param typeId - 紀錄類型 ID
 * @returns 對應的樣式類別名稱
 */
const getTypeClass = (typeId: string): string => {
    const typeMap: Record<string, string> = {
        'purchase': 'purchase',
        'exchange': 'exchange',
        'return': 'return',
        'expire': 'expire',
        'add-manual': 'add-manual',
        'deduct-manual': 'deduct-manual',
        'transfer-out': 'transfer-out',
        'transfer-in': 'transfer-in',
        'insert': 'insert'
    };
    return typeMap[typeId] || '';
};

/**
 * 獲取紀錄類型的顯示標籤
 * @param typeId - 紀錄類型 ID
 * @returns 對應的顯示標籤
 */
const getTypeLabel = (typeId: string): string => {
    const typeMap: Record<string, string> = {
        'purchase': '購買',
        'exchange': '兌換',
        'return': '收回',
        'expire': '過期',
        'add-manual': '人工給點',
        'deduct-manual': '人工扣點',
        'transfer-out': '轉出',
        'transfer-in': '轉入',
        'insert': '匯入'
    };
    return typeMap[typeId] || typeId;
};

/**
 * 獲取使用者點數資料
 * 在實際 API 完成前，使用模擬資料
 */
const fetchUserData = async () => {
    try {
        loading.value = true;
        error.value = null;

        // 模擬 API 請求延遲
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模擬使用者點數資料
        const mockData = {
            points: 3000,
            expiringPoints: 540,
            expiryDate: '2024-10-30',
            totalEarned: 120,
            totalSpent: 86,
            pointsHistory: {
                lastMonth: 23,
                twoMonthsAgo: 38,
                threeMonthsAgo: 15
            }
        };

        userData.value = mockData;

        // 模擬過濾歷史紀錄
        // 實際上應該是從 API 獲取的，但目前使用模擬資料
        filterHistoryByDate();
    } catch (err) {
        error.value = err instanceof Error ? err : new Error('獲取點數資訊時發生未知錯誤');
        handleError(error.value, '獲取點數資訊');
    } finally {
        loading.value = false;
    }
};

/**
 * 模擬過濾最近三個月的歷史紀錄
 * 實際上應由 API 提供資料
 */
const filterHistoryByDate = () => {
    // 使用現有的假資料 (historyRecords) 而不是發起新的請求
    console.log(`已載入 ${historyRecords.value.length} 筆點數歷史紀錄`);

    // 這裡可以加入篩選邏輯，但因為假資料已經包含三個月內的記錄，所以不需要額外篩選
};

// 在元件掛載時獲取資料
onMounted(() => {
    // 模擬資料載入
    setTimeout(() => {
        fetchUserData();

        // 模擬篩選兌換項目
        filterExchangeItems();
    }, 800);

    // 監聽點擊事件，點擊頁面其他區域時關閉下拉選單
    document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.filter-container')) {
            brandDropdownOpen.value = false;
        }
        if (!target.closest('.history-filter-container')) {
            historyTypeDropdownOpen.value = false;
        }
    });
});

// 監聽標籤變化
watch(activeTab, (newTab) => {
    if (newTab === 'history') {
        // 這裡可以加入獲取歷史紀錄的邏輯
        // 例如: fetchHistoryRecords();
    } else if (newTab === 'exchange') {
        // 這裡可以加入獲取兌換項目的邏輯
        // 例如: fetchExchangeItems();
    }
});

/**
 * 查看兌換項目詳情
 * @param item - 兌換項目
 */
const viewItemDetail = (item: any) => {
    router.push(`/points/show/${item.id}`);
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

/* 頁面特定樣式 */
.header-content {
    max-width: 768px;
    margin: 0 auto;
    padding: 0 16px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-spacer,
.info-button {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--nav-text, #8494A5);
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    text-decoration: none;
}

.page-title {
    font-size: 18px;
    font-weight: 500;
    color: var(--heading, #293954);
    margin: 0;
    flex: 1;
    text-align: center;
}

.header-right {
    width: 40px;
    display: flex;
    justify-content: flex-end;
}

/* 主要內容區域 */
.main-content {
    flex: 1;
    padding-bottom: 70px;
    padding-top: 56px;
    max-width: 768px;
    margin: 0 auto;
    width: 100%;
}

/* 載入與錯誤狀態 */
.loading-state,
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 16px;
    text-align: center;
    height: 40vh;
}

.loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid var(--primary, #FC8802);
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.retry-button {
    margin-top: 16px;
    padding: 8px 16px;
    background-color: var(--primary, #FC8802);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

/* 點數內容 */
.points-content {
    padding: 16px;
}

/* 點數卡片 */
.points-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
}

.points-card {
    background-color: var(--white, #FFFFFF);
    border-radius: var(--border-radius, 20px);
    padding: 16px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.card-title {
    font-size: 14px;
    color: var(--body-text, #485771);
    margin: 8px 0 0 0;
    font-weight: normal;
}

.points-amount {
    font-size: 28px;
    font-weight: bold;
    color: var(--primary, #FC8802);
    line-height: 1.2;

    .unit {
        font-size: 16px;
        margin-left: 2px;
        font-weight: normal;
    }
}

.expiry-date {
    font-size: 12px;
    color: var(--note, #666666);
    margin-top: 4px;
}

/* 標籤切換 */
.tabs-container {
    position: relative;
    margin-bottom: 16px;
    background-color: var(--white, #FFFFFF);
    border-radius: 8px;
    overflow: hidden;
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

/* 品牌篩選 */
.filter-container {
    position: relative;
    margin-bottom: 16px;
}

.filter-dropdown {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background-color: var(--white, #FFFFFF);
    border: 1px solid var(--border-disabled, #EBEBEB);
    border-radius: 8px;
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
    border-radius: 8px;
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

/* 兌換列表樣式 */
.exchange-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.exchange-item {
    display: flex;
    background-color: var(--white, #FFFFFF);
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
}

.item-image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 12px;
    flex-shrink: 0;
    background-color: var(--background-light);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.item-details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
}

.item-name {
    font-size: 16px;
    font-weight: 500;
    color: var(--heading, #293954);
    margin: 0 0 8px 0;
}

.item-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    font-size: 12px;
    color: var(--body-text, #485771);
}

.item-points {
    font-size: 18px;
    font-weight: bold;
    color: var(--primary, #FC8802);
    align-self: flex-end;
}

/* 歷史紀錄篩選 */
.history-filter-container {
    position: relative;
    margin-bottom: 16px;
    z-index: 10;
}

.history-filter-dropdown {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background-color: var(--white, #FFFFFF);
    border: 1px solid var(--border-disabled, #EBEBEB);
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    color: var(--heading, #293954);
}

.history-dropdown-options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: var(--white, #FFFFFF);
    border: 1px solid var(--border-disabled, #EBEBEB);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 4px;
    max-height: 300px;
    overflow-y: auto;
}

.history-time-tag {
    display: inline-block;
    padding: 4px 12px;
    background-color: var(--background-light, #F9F9F9);
    border: 1px solid var(--border-disabled, #EBEBEB);
    border-radius: 30px;
    font-size: 12px;
    color: var(--body-text, #485771);
    margin-bottom: 16px;
}

/* 歷史紀錄樣式 */
.history-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.history-item {
    background-color: var(--white, #FFFFFF);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.history-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background-color: var(--background-light, #F9F9F9);
    border-bottom: 1px solid var(--border-disabled, #EBEBEB);
}

.record-date {
    font-size: 12px;
    color: var(--body-text, #485771);
}

.history-item-body {
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.record-type-tag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 30px;
    font-size: 12px;
    color: var(--white, #FFFFFF);
    background-color: var(--note, #666666);
    align-self: flex-start;

    &.purchase {
        background-color: var(--up, #159E42);
    }

    &.exchange {
        background-color: var(--primary, #FC8802);
    }

    &.return {
        background-color: var(--body-text, #485771);
    }

    &.expire {
        background-color: var(--down, #CC0D39);
    }

    &.add-manual {
        background-color: var(--up, #159E42);
    }

    &.deduct-manual {
        background-color: var(--down, #CC0D39);
    }

    &.transfer-out {
        background-color: var(--down, #CC0D39);
    }

    &.transfer-in {
        background-color: var(--up, #159E42);
    }

    &.insert {
        background-color: var(--primary, #FC8802);
    }
}

.record-description {
    font-size: 14px;
    color: var(--body-text, #485771);
}

.record-points {
    font-size: 14px;
    font-weight: bold;

    &.earned {
        color: var(--up, #159E42);
    }

    &.spent {
        color: var(--down, #CC0D39);
    }
}

/* 空狀態 */
.empty-state {
    text-align: center;
    padding: 32px 16px;
    color: var(--note, #666666);
    font-style: italic;
}

/* 響應式設計 */
@media (max-width: 480px) {
    .points-cards {
        gap: 12px;
    }

    .points-card {
        padding: 12px;
    }

    .points-amount {
        font-size: 24px;
    }
}

/* Safari 瀏覽器適配 */
@supports (-webkit-touch-callout: none) {
    .header {
        padding-top: max(env(safe-area-inset-top), 20px);
    }

    .main-content {
        padding-top: calc(56px + max(env(safe-area-inset-top), 20px));
    }
}
</style>
