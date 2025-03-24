<template>
    <div class="page-container">
        <!-- 固定標頭 -->
        <header class="header">
            <div class="header-content">
                <button class="back-button" @click="$router.go(-1)">
                    <span class="material-icons">arrow_back</span>
                </button>
                <h1 class="page-title">票券詳情</h1>
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
                <button @click="fetchCouponData" class="retry-btn">重新嘗試</button>
            </div>

            <!-- 票券內容 -->
            <main v-else class="coupon-content">
                <div class="content-container">
                    <!-- 票券圖片 -->
                    <div class="coupon-header" :style="{ backgroundImage: `url(${couponData.image || defaultImage})` }">
                        <div class="tag" v-if="couponData.tag">{{ couponData.tag }}</div>
                    </div>

                    <!-- 票券詳細資訊 -->
                    <section class="coupon-description-overlay">
                        <h3 class="coupon-title">{{ couponData.title }}</h3>

                        <!-- 基本資訊 -->
                        <div class="info-section">
                            <div class="info-item">
                                <span class="info-label">品牌：</span>
                                <span class="info-value">{{ couponData.brand }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">適用：</span>
                                <span class="info-value">{{ couponData.applicableArea }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">期限：</span>
                                <span class="info-value">{{ couponData.expiryDate }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">票券編號：</span>
                                <span class="info-value">{{ couponData.couponCode }}</span>
                            </div>
                        </div>

                        <!-- 注意事項 -->
                        <div class="notice-section">
                            <h2 class="details-title">注意事項</h2>
                            <ul class="notice-list">
                                <li v-for="(notice, index) in couponData.notices" :key="index" class="notice-item">
                                    <span class="material-icons">arrow_right</span>
                                    <span>{{ notice }}</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <!-- 使用按鈕 -->
                    <div class="action-button-container">
                        <button class="use-button" @click="showConfirmModal" :disabled="!canUse">
                            {{ couponData.isUsed ? '已使用' : '使用' }}
                        </button>
                    </div>
                </div>
            </main>
        </main>

        <!-- 核銷確認燈箱 -->
        <div class="modal-overlay" v-if="showConfirmBox" @click.self="closeConfirmModal">
            <div class="modal-container">
                <div class="modal-header">
                    <h3 class="modal-title">核銷票券</h3>
                    <button class="close-button" @click="closeConfirmModal">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <div class="modal-content">
                    <p class="confirm-message">一但點擊核銷，將無法返還該票券，請選擇核銷方式：</p>
                    <div class="redemption-options">
                        <!-- 驗證碼核銷選項 -->
                        <button class="redemption-option" @click="showVerificationModal">
                            <div class="option-icon">
                                <span class="material-icons">dialpad</span>
                            </div>
                            <div class="option-text">
                                <div class="option-title">驗證碼核銷</div>
                                <div class="option-description">由店員輸入驗證碼</div>
                            </div>
                        </button>

                        <!-- 條碼核銷選項 -->
                        <button class="redemption-option" @click="showBarcodeModal">
                            <div class="option-icon">
                                <span class="material-icons">qr_code_scanner</span>
                            </div>
                            <div class="option-text">
                                <div class="option-title">條碼核銷</div>
                                <div class="option-description">由店員掃描條碼</div>
                            </div>
                        </button>
                    </div>
                    <div class="cancel-action">
                        <button class="cancel-button" @click="closeConfirmModal">取消</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 服務人員輸入驗證碼燈箱 -->
        <div class="modal-overlay" v-if="showVerificationBox" @click.self="closeVerificationModal">
            <div class="modal-container verification-modal">
                <div class="modal-header">
                    <h3 class="modal-title">核銷票券</h3>
                    <button class="close-button" @click="closeVerificationModal">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <div class="modal-content verification-content">
                    <p class="verification-message">請服務人員協助輸入核銷碼</p>
                    <div class="verification-code-input">
                        <input type="text" v-model="verificationCode" placeholder="請輸入六位數核銷碼" maxlength="6"
                            pattern="[0-9]*" inputmode="numeric" ref="verificationInput" />
                    </div>
                    <p class="verification-hint">提醒您：活動一經核銷後不可回復</p>
                    <div class="verification-buttons">
                        <button class="cancel-button" @click="closeVerificationModal">取消</button>
                        <button class="confirm-button" :disabled="!isValidVerificationCode" @click="verifyAndRedeem">
                            核銷
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 條碼/QR碼燈箱 -->
        <div class="modal-overlay" v-if="showBarcodeBox" @click.self="closeBarcodeModal">
            <div class="modal-container barcode-modal">
                <div class="modal-header">
                    <h3 class="modal-title">掃描核銷</h3>
                    <button class="close-button" @click="closeBarcodeModal">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <div class="modal-content barcode-content">
                    <div class="barcode-container">
                        <!-- 條碼區域 -->
                        <div class="barcode-section">
                            <div class="barcode">
                                <!-- 動態生成的一維條碼 -->
                                <svg ref="barcodeElement" class="barcode-img"></svg>
                            </div>
                            <div class="barcode-number">{{ couponData.couponCode }}</div>
                        </div>

                        <!-- QR碼區域 -->
                        <div class="qrcode-section">
                            <div class="qrcode">
                                <!-- 動態生成的QR碼 -->
                                <div ref="qrcodeElement" class="qrcode-container"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 核銷結果訊息元件 -->
        <RedemptionMessage :visible="showResultMessage" :is-success="redemptionSuccess" :message="redemptionMessage"
            confirm-text="我知道了" @close="closeResultMessage" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { handleError } from '@/utils/errorHandler'
import JsBarcode from 'jsbarcode'
import QRCode from 'qrcode'
import RedemptionMessage from '@/components/RedemptionMessage.vue'

// 路由與導航
const route = useRoute()
const router = useRouter()
const couponId = route.params.id

// 條碼和QR碼元素的參考
const barcodeElement = ref(null)
const qrcodeElement = ref(null)
const verificationInput = ref(null)

// 狀態管理
const couponData = ref({})
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('無法載入票券資訊，請稍後再試')

// 控制燈箱顯示狀態
const showConfirmBox = ref(false)
const showBarcodeBox = ref(false)
const showVerificationBox = ref(false)
const showResultMessage = ref(false)

// 驗證碼相關
const verificationCode = ref('')
const defaultVerificationCode = '933983' // 模擬正確的驗證碼

// 核銷結果訊息
const redemptionSuccess = ref(false)
const redemptionMessage = ref('')

// 預設圖片（Base64或外部URL）
const defaultImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f9d6e7"/%3E%3Ctext x="100" y="100" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="%23e56b8f"%3E票券圖片%3C/text%3E%3C/svg%3E'

// 計算屬性
const canUse = computed(() => {
    return !couponData.value.isUsed && !couponData.value.isExpired
})

// 檢查驗證碼是否有效（六位數字）
const isValidVerificationCode = computed(() => {
    return /^\d{6}$/.test(verificationCode.value)
})

/**
 * 獲取票券資料
 * 模擬從 API 獲取資料
 */
const fetchCouponData = async () => {
    loading.value = true
    error.value = false

    try {
        // 模擬 API 呼叫延遲
        await new Promise(resolve => setTimeout(resolve, 800))

        // 這裡將來會替換為真實的 API 呼叫
        // const response = await apiService.getCouponDetail(couponId)

        // 使用假資料
        const mockData = {
            id: couponId,
            title: '3月會員好禮 胡麻龍鬚涼菜',
            brand: '全品牌',
            applicableArea: '全門市',
            expiryDate: '2025-03-31',
            couponCode: '4820287750783',
            image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpbmVzZSUyMGZvb2R8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
            tag: '3月會員限定',
            isUsed: false,
            isExpired: false,
            notices: [
                '本票券為3月份會員限定美味兌換券，使用期限為2025/03/17-03/31。',
                '每桌標準拉麵可使用乙張會員兌換券，活動或多張票券不得併行使用。',
                '飲使用本券需於點餐結帳前出示並告知門市人員，結帳結束後不受理，內用需滿足門市基本消費條件。',
                '使用後不可退換，逾期視同作廢。'
            ]
        }

        couponData.value = mockData
    } catch (err) {
        handleError(err, '獲取票券資料')
        error.value = true
        errorMessage.value = err.message || '無法載入票券資訊，請稍後再試'
    } finally {
        loading.value = false
    }
}

/**
 * 顯示核銷確認燈箱
 */
const showConfirmModal = () => {
    if (!canUse.value) return
    showConfirmBox.value = true
}

/**
 * 關閉核銷確認燈箱
 */
const closeConfirmModal = () => {
    showConfirmBox.value = false
}

/**
 * 顯示驗證碼輸入燈箱
 */
const showVerificationModal = () => {
    showConfirmBox.value = false
    showVerificationBox.value = true

    // 清除之前的驗證碼輸入
    verificationCode.value = ''

    // 聚焦於驗證碼輸入框
    nextTick(() => {
        if (verificationInput.value) {
            verificationInput.value.focus()
        }
    })
}

/**
 * 關閉驗證碼輸入燈箱
 */
const closeVerificationModal = () => {
    showVerificationBox.value = false
}

/**
 * 驗證並核銷票券
 */
const verifyAndRedeem = async () => {
    if (!isValidVerificationCode.value) return

    try {
        // 模擬驗證過程
        await new Promise(resolve => setTimeout(resolve, 600))

        // 驗證核銷碼是否正確
        if (verificationCode.value === defaultVerificationCode) {
            // 關閉驗證碼燈箱
            closeVerificationModal()

            // 更新票券狀態
            couponData.value.isUsed = true

            // 顯示成功訊息
            redemptionSuccess.value = true
            redemptionMessage.value = '核銷成功'
            showResultMessage.value = true
        } else {
            // 驗證失敗，顯示錯誤訊息
            closeVerificationModal()
            redemptionSuccess.value = false
            redemptionMessage.value = '輸入錯誤'
            showResultMessage.value = true
        }
    } catch (err) {
        handleError(err, '驗證核銷碼')

        // 顯示錯誤訊息
        closeVerificationModal()
        redemptionSuccess.value = false
        redemptionMessage.value = '核銷失敗，請稍後再試'
        showResultMessage.value = true
    }
}

/**
 * 關閉結果訊息
 */
const closeResultMessage = () => {
    showResultMessage.value = false

    // 如果是成功核銷，可以考慮導回列表頁
    if (redemptionSuccess.value && couponData.value.isUsed) {
        // router.push('/coupons')
    }
}

/**
 * 顯示條碼/QR碼燈箱
 */
const showBarcodeModal = () => {
    showConfirmBox.value = false
    showBarcodeBox.value = true

    // 當燈箱顯示後延遲執行生成條碼和QR碼，確保DOM元素已渲染
    setTimeout(() => {
        generateBarcode()
        generateQRCode()
    }, 100)
}

/**
 * 關閉條碼/QR碼燈箱
 */
const closeBarcodeModal = () => {
    showBarcodeBox.value = false
    // 在實際應用中，這裡可能需要呼叫後端 API 來完成核銷流程
    finishRedemption()
}

/**
 * 生成條碼
 * 使用 JsBarcode 函式庫動態生成票券條碼
 */
const generateBarcode = () => {
    if (barcodeElement.value && couponData.value && couponData.value.couponCode) {
        // 清空元素內容，避免重複生成
        while (barcodeElement.value.firstChild) {
            barcodeElement.value.removeChild(barcodeElement.value.firstChild)
        }

        // 使用 JsBarcode 生成條碼
        JsBarcode(barcodeElement.value, couponData.value.couponCode, {
            format: 'CODE128',
            lineColor: '#000',
            width: 2,
            height: 80,
            displayValue: false,
            margin: 0
        })
    }
}

/**
 * 生成 QR 碼
 * 使用 qrcode.js 函式庫動態生成票券 QR 碼
 */
const generateQRCode = async () => {
    if (qrcodeElement.value && couponData.value && couponData.value.couponCode) {
        // 清空元素內容，避免重複生成
        qrcodeElement.value.innerHTML = ''

        // 設定 QR 碼內容，通常是票券識別資訊
        const qrCodeContent = `COUPON:${couponData.value.couponCode}:${couponData.value.id}`

        try {
            // 使用 canvas 生成 QR 碼
            const canvas = document.createElement('canvas')
            await QRCode.toCanvas(canvas, qrCodeContent, {
                width: 200,
                margin: 0,
                color: {
                    dark: '#000',
                    light: '#FFF'
                }
            })

            qrcodeElement.value.appendChild(canvas)
        } catch (error) {
            console.error('生成 QR 碼時出錯：', error)
        }
    }
}

/**
 * 完成票券核銷流程
 */
const finishRedemption = async () => {
    try {
        // 模擬 API 呼叫
        await new Promise(resolve => setTimeout(resolve, 800))

        // 這裡將來會呼叫實際的 API
        // await apiService.redeemCoupon(couponId)

        // 更新本地狀態
        couponData.value.isUsed = true

        // 顯示成功訊息
        redemptionSuccess.value = true
        redemptionMessage.value = '核銷成功'
        showResultMessage.value = true

    } catch (err) {
        handleError(err, '票券核銷')

        // 顯示錯誤訊息
        redemptionSuccess.value = false
        redemptionMessage.value = '核銷失敗，請稍後再試'
        showResultMessage.value = true
    }
}

// 元件掛載時獲取資料
onMounted(() => {
    fetchCouponData()
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

/* 票券標頭與圖片 */
.coupon-header {
    position: relative;
    width: 100%;
    color: white;
    margin-bottom: var(--spacing-lg);
    overflow: hidden;
    padding-bottom: 56%;
    background-position: center center;
    background-size: cover;

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

.coupon-description-overlay {
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

.coupon-title {
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

.use-button {
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

.confirm-buttons {
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

    &:disabled {
        background-color: var(--border-disabled);
        cursor: not-allowed;
    }
}

/* 條碼燈箱特定樣式 */
.barcode-modal {
    max-width: 320px;
}

.barcode-content {
    padding: 20px;
}

.barcode-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.barcode-section {
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.barcode {
    background-color: white;
    padding: 10px;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
}

.barcode-img {
    max-width: 100%;
    height: auto;
}

.barcode-number {
    font-size: var(--font-size-body);
    color: var(--heading);
    letter-spacing: 1px;
}

.qrcode-section {
    width: 100%;
    display: flex;
    justify-content: center;
}

.qrcode {
    background-color: white;
    padding: 10px;
    border-radius: 4px;
}

.qrcode-container {
    display: flex;
    justify-content: center;
}

/* 驗證碼燈箱特定樣式 */
.verification-modal {
    max-width: 320px;
}

.verification-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.verification-message {
    text-align: center;
    margin-bottom: 20px;
    color: var(--heading);
    font-size: var(--font-size-body);
    font-weight: 500;
}

.verification-code-input {
    width: 100%;
    margin-bottom: 20px;

    input {
        width: 100%;
        padding: 12px;
        border: 1px solid var(--border-disabled);
        border-radius: var(--border-radius);
        font-size: var(--font-size-h4);
        text-align: center;
        letter-spacing: 4px;
    }
}

.verification-hint {
    font-size: var(--font-size-note);
    color: var(--note);
    margin-bottom: 20px;
    text-align: center;
}

.verification-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
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

/* 核銷選項樣式 */
.redemption-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
}

.redemption-option {
    display: flex;
    align-items: center;
    padding: 12px;
    border: 1px solid var(--border-disabled);
    border-radius: var(--border-radius);
    background-color: var(--white);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;

    &:hover {
        border-color: var(--primary);
        background-color: rgba(252, 136, 2, 0.05);
    }
}

.option-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background-color: var(--primary);
    border-radius: 50%;
    margin-right: 16px;

    .material-icons {
        color: white;
        font-size: 20px;
    }
}

.option-text {
    flex: 1;
}

.option-title {
    font-weight: 500;
    font-size: var(--font-size-body);
    color: var(--heading);
    margin-bottom: 4px;
}

.option-description {
    font-size: var(--font-size-note);
    color: var(--note);
}

.cancel-action {
    display: flex;
    justify-content: center;
}

.cancel-button {
    padding: 10px 20px;
    border: 1px solid var(--border-disabled);
    border-radius: var(--border-radius);
    background-color: var(--white);
    color: var(--body-text);
    font-size: var(--font-size-body);
    cursor: pointer;

    &:hover {
        background-color: #f5f5f5;
    }
}

/* 響應式調整 */
@media (max-width: 480px) {
    .coupon-description-overlay {
        max-width: 90%;
    }
}
</style>
