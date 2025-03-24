<template>
    <div class="page-container">
        <!-- 固定標頭 -->
        <header class="header">
            <div class="header-content">
                <button class="back-button" @click="$router.go(-1)">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h1 class="page-title">點數兌換詳情</h1>
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

            <!-- 錯誤顯示 -->
            <div v-else-if="error" class="error-container">
                <p class="error-message">{{ errorMessage }}</p>
                <button @click="fetchItemData" class="retry-btn">重新嘗試</button>
            </div>

            <!-- 兌換項目內容 -->
            <main v-else class="item-content">
                <div class="content-container">
                    <!-- 項目圖片 -->
                    <div class="item-header">
                        <img :src="getImageUrl(itemData.image)" alt="商品圖片" class="item-image" />
                        <div class="tag" v-if="itemData.tag">{{ itemData.tag }}</div>
                    </div>

                    <!-- 項目詳細資訊 -->
                    <section class="item-description-overlay">
                        <h3 class="item-title">{{ itemData.name }}</h3>

                        <!-- 基本資訊 -->
                        <div class="info-section">
                            <div class="info-item">
                                <span class="info-label">品牌：</span>
                                <span class="info-value">{{ itemData.brand }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">適用：</span>
                                <span class="info-value">{{ itemData.applicableArea }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">期限：</span>
                                <span class="info-value">{{ formatDate(itemData.validUntil) }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">商品編號：</span>
                                <span class="info-value">{{ itemData.itemCode }}</span>
                            </div>

                            <div class="points-info">
                                <span class="points-label">所需點數</span>
                                <span class="points-value">{{ itemData.points }} 點</span>
                            </div>
                        </div>

                        <!-- 商品說明 -->
                        <div class="description-section">
                            <h2 class="details-title">商品說明</h2>
                            <p class="description-text">{{ itemData.description }}</p>
                        </div>

                        <!-- 注意事項 -->
                        <div class="notice-section">
                            <h2 class="details-title">注意事項</h2>
                            <ul class="notice-list">
                                <li v-for="(notice, index) in itemData.notices" :key="index" class="notice-item">
                                    <i class="fas fa-chevron-right"></i>
                                    <span>{{ notice }}</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <!-- 兌換按鈕 -->
                    <div class="action-button-container">
                        <div class="points-info">
                            <span class="points-label">所需點數</span>
                            <span class="points-value">{{ itemData.points }} 點</span>
                        </div>
                        <button class="exchange-button" @click="showConfirmModal">
                            {{ canExchange ? '立即兌換' : '點數不足' }}
                        </button>
                    </div>
                </div>
            </main>
        </main>

        <!-- 兌換確認燈箱 -->
        <div class="modal-overlay" v-if="showConfirmBox" @click.self="closeConfirmModal">
            <div class="modal-container">
                <div class="modal-header">
                    <h3 class="modal-title">確認兌換</h3>
                    <button class="close-button" @click="closeConfirmModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-content">
                    <p class="confirm-message">確定要使用 {{ itemData.points }} 點兌換此商品嗎？</p>
                    <div class="item-summary">
                        <div class="summary-image">
                            <img :src="getImageUrl(itemData.image)" alt="商品圖片" />
                        </div>
                        <div class="summary-details">
                            <h4 class="summary-title">{{ itemData.name }}</h4>
                            <p class="summary-brand">{{ itemData.brand }}</p>
                            <p class="summary-validity">有效期限：{{ formatDate(itemData.validUntil) }}</p>
                        </div>
                    </div>
                    <div class="points-summary">
                        <div class="points-row">
                            <span>目前點數</span>
                            <span>{{ userData.points }} 點</span>
                        </div>
                        <div class="points-row deduction">
                            <span>扣除點數</span>
                            <span>-{{ itemData.points }} 點</span>
                        </div>
                        <div class="points-row remaining">
                            <span>剩餘點數</span>
                            <span>{{ userData.points - itemData.points }} 點</span>
                        </div>
                    </div>
                    <div class="confirmation-buttons">
                        <button class="cancel-button" @click="closeConfirmModal">取消</button>
                        <button class="confirm-button" @click="confirmExchange">確認兌換</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 兌換結果訊息元件 -->
        <div class="modal-overlay" v-if="showResultMessage">
            <div class="modal-container result-modal">
                <div class="modal-content result-content">
                    <div class="result-icon" :class="{ 'success': exchangeSuccess, 'failure': !exchangeSuccess }">
                        <i :class="exchangeSuccess ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
                    </div>
                    <h3 class="result-title">{{ exchangeSuccess ? '兌換成功' : '兌換失敗' }}</h3>
                    <p class="result-message">{{ exchangeMessage }}</p>
                    <button class="result-button" @click="closeResultMessage">
                        {{ exchangeSuccess ? '查看我的票券' : '我知道了' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { handleError } from '@/utils/errorHandler';

// 路由與導航
const route = useRoute();
const router = useRouter();
const itemId = route.params.id;

// 狀態管理
const itemData = ref<any>({});
const userData = ref<any>({
    points: 3000,
    expiringPoints: 540,
    expiryDate: '2024-10-30'
});
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('無法載入商品資訊，請稍後再試');

// 控制燈箱顯示狀態
const showConfirmBox = ref(false);
const showResultMessage = ref(false);

// 兌換結果訊息
const exchangeSuccess = ref(false);
const exchangeMessage = ref('');

// 預設圖片 - SVG 資料 URL
const defaultItemImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="100" y="100" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="%23999"%3E商品圖片%3C/text%3E%3C/svg%3E';

// 計算屬性
const canExchange = computed(() => {
    return userData.value.points >= itemData.value.points && itemData.value.stock > 0;
});

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
 * 格式化日期為 YYYY-MM-DD 格式
 * @param date - 日期物件或字串
 * @returns 格式化後的日期字串
 */
const formatDate = (date: Date | string): string => {
    if (!date) return '';

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * 獲取兌換項目資料
 * 模擬從 API 獲取資料
 */
const fetchItemData = async () => {
    loading.value = true;
    error.value = false;

    try {
        // 模擬 API 呼叫延遲
        await new Promise(resolve => setTimeout(resolve, 800));

        // 這裡將來會替換為真實的 API 呼叫
        // const response = await apiService.getExchangeItemDetail(itemId);

        // 使用假資料
        const mockData = {
            id: itemId,
            name: '日本和牛500g 兌換券',
            brand: '麵匡匡',
            applicableArea: '全門市',
            validUntil: new Date('2025-06-30'),
            itemCode: '4820287750783',
            image: '',
            tag: '限量商品',
            points: 100,
            price: 400,
            daysLeft: 7,
            stock: 999,
            description: '高級日本和牛，完美油花分布，適合各種料理方式。',
            notices: [
                '本兌換券為限量商品，使用期限為2025/06/30前。',
                '每人限兌換一次，不得與其他優惠併用。',
                '兌換時需出示會員身分證明，並由店員確認。',
                '兌換後不可退換，逾期視同作廢。'
            ]
        };

        itemData.value = mockData;
    } catch (err) {
        handleError(err, '獲取兌換項目資料');
        error.value = true;
        errorMessage.value = err.message || '無法載入商品資訊，請稍後再試';
    } finally {
        loading.value = false;
    }
};

/**
 * 顯示兌換確認燈箱
 */
const showConfirmModal = () => {
    if (!canExchange.value) {
        // 顯示點數不足警告
        exchangeSuccess.value = false;
        exchangeMessage.value = '點數不足無法進行兌換';
        showResultMessage.value = true;
        return;
    }
    showConfirmBox.value = true;
};

/**
 * 關閉兌換確認燈箱
 */
const closeConfirmModal = () => {
    showConfirmBox.value = false;
};

/**
 * 確認兌換
 */
const confirmExchange = async () => {
    try {
        // 模擬 API 呼叫
        await new Promise(resolve => setTimeout(resolve, 800));

        // 這裡將來會呼叫實際的 API
        // await apiService.exchangeItem(itemId);

        // 更新本地狀態
        userData.value.points -= itemData.value.points;
        itemData.value.stock -= 1;

        // 關閉確認燈箱
        closeConfirmModal();

        // 顯示成功訊息
        exchangeSuccess.value = true;
        exchangeMessage.value = '兌換成功！您可以在「票券」中查看您的兌換券。';
        showResultMessage.value = true;

    } catch (err) {
        handleError(err, '兌換商品');

        // 關閉確認燈箱
        closeConfirmModal();

        // 顯示錯誤訊息
        exchangeSuccess.value = false;
        exchangeMessage.value = '兌換失敗，請稍後再試';
        showResultMessage.value = true;
    }
};

/**
 * 關閉結果訊息
 */
const closeResultMessage = () => {
    showResultMessage.value = false;

    // 如果是成功兌換，導向票券頁面
    if (exchangeSuccess.value) {
        router.push('/coupons');
    }
};

// 元件掛載時獲取資料
onMounted(() => {
    fetchItemData();
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

/* 項目標頭與圖片 */
.item-header {
    position: relative;
    width: 100%;
    color: white;
    margin-bottom: var(--spacing-lg);
    overflow: hidden;
    text-align: center;
    background-color: var(--background-light);

    .item-image {
        width: 100%;
        max-height: 300px;
        object-fit: cover;
    }

    .tag {
        position: absolute;
        top: 16px;
        left: 0;
        background-color: var(--primary);
        color: white;
        padding: 4px 12px;
        font-size: var(--font-size-note);
        font-weight: 500;
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}

.item-description-overlay {
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

.item-title {
    font-size: var(--font-size-h3);
    font-weight: bold;
    text-align: center;
    margin-bottom: var(--spacing-md);
    color: var(--heading);
}

/* 基本資訊區塊 */
.info-section {
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--border-disabled);
}

.info-item {
    display: flex;
    margin-bottom: var(--spacing-sm);
    font-size: var(--font-size-body);

    .info-label {
        width: 90px;
        color: var(--note);
        flex-shrink: 0;
    }

    .info-value {
        flex-grow: 1;
        color: var(--body-text);
    }
}

/* 商品說明區塊 */
.description-section {
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--border-disabled);
}

.description-text {
    font-size: var(--font-size-body);
    line-height: 1.6;
    color: var(--body-text);
}

/* 注意事項區塊 */
.notice-section {
    margin-bottom: var(--spacing-lg);
}

.details-title {
    font-size: var(--font-size-h4);
    color: var(--heading);
    margin-bottom: var(--spacing-md);
}

.notice-list {
    list-style: none;
    padding: 0;
}

.notice-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: var(--spacing-sm);
    font-size: var(--font-size-body);
    line-height: 1.5;

    .material-icons {
        font-size: 18px;
        margin-right: 4px;
        color: var(--primary);
        flex-shrink: 0;
    }
}

/* 兌換按鈕區域 */

.points-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;

    .points-label {
        font-size: var(--font-size-body);
        color: var(--note);
    }

    .points-value {
        font-size: var(--font-size-h4);
        font-weight: bold;
        color: var(--primary);
    }
}

.exchange-button {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    display: block;
    background-color: var(--primary);
    color: var(--white);
    border: none;
    padding: var(--spacing-md);
    border-radius: var(--border-radius-lg);
    font-size: var(--font-size-h4);
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover:not(:disabled) {
        background-color: var(--primary-hover);
    }

    &:disabled {
        background-color: var(--border-disabled);
        cursor: not-allowed;
    }
}

/* 燈箱共通樣式 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.modal-container {
    background-color: var(--white);
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid var(--border-disabled);
}

.modal-title {
    margin: 0;
    font-size: var(--font-size-h4);
    color: var(--heading);
}

.close-button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--note);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    padding: 20px;
}

.confirm-message {
    text-align: center;
    margin-bottom: 20px;
    color: var(--body-text);
    font-size: var(--font-size-body);
    line-height: 1.5;
}

/* 商品摘要 */
.item-summary {
    display: flex;
    align-items: center;
    padding: 12px;
    background-color: var(--background-light);
    border-radius: var(--border-radius);
    margin-bottom: 20px;
}

.summary-image {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 12px;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.summary-details {
    flex: 1;
}

.summary-title {
    font-size: var(--font-size-body);
    font-weight: 500;
    margin: 0 0 4px 0;
    color: var(--heading);
}

.summary-brand {
    font-size: var(--font-size-note);
    color: var(--note);
    margin: 0 0 4px 0;
}

.summary-validity {
    font-size: var(--font-size-note);
    color: var(--note);
    margin: 0;
}

/* 點數摘要 */
.points-summary {
    margin-bottom: 20px;
    padding: 12px;
    background-color: var(--background-light);
    border-radius: var(--border-radius);
}

.points-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: var(--font-size-body);
    color: var(--body-text);

    &:last-child {
        margin-bottom: 0;
    }

    &.deduction {
        color: var(--down);
    }

    &.remaining {
        font-weight: bold;
        color: var(--heading);
        padding-top: 8px;
        border-top: 1px dashed var(--border-disabled);
    }
}

/* 確認按鈕 */
.confirmation-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.cancel-button,
.confirm-button {
    flex: 1;
    padding: 12px;
    border-radius: var(--border-radius);
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
}

.cancel-button {
    background-color: var(--white);
    color: var(--body-text);
    border: 1px solid var(--border-disabled);
}

.confirm-button {
    background-color: var(--primary);
    color: var(--white);
    border: none;
}

/* 結果訊息燈箱 */
.result-modal {
    max-width: 320px;
}

.result-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 20px;
}

.result-icon {
    font-size: 60px;
    margin-bottom: 16px;

    &.success {
        color: var(--up);
    }

    &.failure {
        color: var(--down);
    }

    .material-icons {
        font-size: 60px;
    }
}

.result-title {
    font-size: var(--font-size-h3);
    font-weight: bold;
    margin: 0 0 12px 0;
    color: var(--heading);
}

.result-message {
    text-align: center;
    margin: 0 0 24px 0;
    color: var(--body-text);
    font-size: var(--font-size-body);
    line-height: 1.5;
}

.result-button {
    background-color: var(--primary);
    color: var(--white);
    border: none;
    padding: 12px 24px;
    border-radius: var(--border-radius);
    font-size: var(--font-size-body);
    font-weight: 500;
    cursor: pointer;
}

/* 載入中和錯誤狀態 */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: var(--primary);
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.error-container {
    text-align: center;
    padding: 40px 20px;
}

.error-message {
    color: var(--down);
    margin-bottom: 16px;
}

.retry-btn {
    background-color: var(--primary);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: var(--border-radius);
    cursor: pointer;
}

/* 響應式調整 */
@media (max-width: 480px) {
    .item-description-overlay {
        max-width: 90%;
    }
}
</style>
