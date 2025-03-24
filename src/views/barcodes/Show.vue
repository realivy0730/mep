<template>
    <div class="page-container">
        <!-- 固定標頭 -->
        <header class="header">
            <div class="header-content">
                <button class="back-button" @click="$router.go(-1)">
                    <span class="material-icons">arrow_back</span>
                </button>
                <h1 class="page-title">會員卡</h1>
                <div class="header-right"></div>
            </div>
        </header>

        <!-- 主要內容區域 -->
        <main class="main-content">
            <div class="content-container">
                <!-- 卡片輪播區 -->
                <div class="card-carousel">
                    <!-- 左右切換箭頭 -->
                    <button class="carousel-arrow prev" @click="prevCard">
                        <span class="material-icons">chevron_left</span>
                    </button>

                    <!-- 會員卡片 -->
                    <div class="card-wrapper">
                        <div class="card" :style="{ 'background-color': currentCard.bgColor }">
                            <!-- 卡片背景圖案 -->
                            <div class="card-pattern"></div>

                            <!-- 卡片狀態與品牌資訊 -->
                            <div class="card-header">
                                <div class="card-brand">{{ currentCard.brand }}</div>
                                <div class="card-status" @click="goToMemberLevel">{{ currentCard.status }} <i
                                        class="fa-solid fa-chevron-right"></i></div>
                            </div>

                            <!-- 卡號資訊 -->
                            <div class="card-info">
                                <div class="card-number-label">卡號</div>
                                <div class="card-number">{{ formatCardNumber(currentCard.cardNumber) }}</div>
                            </div>

                            <!-- 點數資訊 -->
                            <div class="card-points">
                                <div class="point-item">
                                    <div class="point-icon active">●</div>
                                    <div class="point-label">儲值金</div>
                                    <div class="point-value">{{ currentCard.balance }}</div>
                                </div>
                                <div class="point-item">
                                    <div class="point-icon">●</div>
                                    <div class="point-label">點數</div>
                                    <div class="point-value">{{ currentCard.points }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button class="carousel-arrow next" @click="nextCard">
                        <span class="material-icons">chevron_right</span>
                    </button>
                </div>

                <!-- 條碼區域 -->
                <div class="barcode-section">
                    <div class="barcode">
                        <!-- 動態生成的一維條碼 -->
                        <svg ref="barcodeElement" class="barcode-img"></svg>
                    </div>
                    <div class="barcode-number">{{ formatBarcodeNumber(currentCard.barcodeNumber) }}</div>
                </div>

                <!-- QR碼區域 -->
                <div class="qrcode-section">
                    <div class="qrcode">
                        <!-- 動態生成的QR碼 -->
                        <div ref="qrcodeElement" class="qrcode-container"></div>
                    </div>
                </div>
            </div>
        </main>

        <!-- 頁尾工具列 -->
        <div class="footer-divider"></div>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import Footer from '@/components/Footer.vue';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import axios from 'axios';

// 路由
const router = useRouter();

// 條碼和QR碼元素的參考
const barcodeElement = ref<HTMLElement | null>(null);
const qrcodeElement = ref<HTMLElement | null>(null);

// 當前卡片索引
const currentIndex = ref(0);

// 會員卡資料
const memberCards = ref([
    {
        id: 1,
        brand: '麵匡匡',
        status: '會員卡',
        cardNumber: '',
        balance: '444',
        points: '188',
        barcodeNumber: '',
        bgColor: '#132c54'
    }
]);

// 獲取當前卡片
const currentCard = ref(memberCards.value[currentIndex.value]);

// 從API獲取會員資料
const fetchMemberData = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/data/boday_test/profile.json');
        const memberData = response.data;

        // 使用API返回的會員卡號
        if (memberData && memberData.membership_number) {
            memberCards.value[0].cardNumber = memberData.membership_number;
            memberCards.value[0].barcodeNumber = memberData.membership_number;

            // 更新當前卡片
            currentCard.value = memberCards.value[currentIndex.value];

            // 重新生成條碼和QR碼
            generateBarcode();
            generateQRCode();
        }
    } catch (error) {
        console.error('獲取會員資料失敗:', error);
    }
};

/**
 * 前往會員等級頁面
 */
const goToMemberLevel = () => {
    router.push('/levels');
};

/**
 * 切換至前一張卡片
 */
const prevCard = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    } else {
        currentIndex.value = memberCards.value.length - 1;
    }
    currentCard.value = memberCards.value[currentIndex.value];
};

/**
 * 切換至下一張卡片
 */
const nextCard = () => {
    if (currentIndex.value < memberCards.value.length - 1) {
        currentIndex.value++;
    } else {
        currentIndex.value = 0;
    }
    currentCard.value = memberCards.value[currentIndex.value];
};

/**
 * 格式化卡號顯示
 * @param {string} cardNumber - 原始卡號
 * @returns {string} 格式化後的卡號
 */
const formatCardNumber = (cardNumber: string): string => {
    // 每4位數加一個空格，提高可讀性
    return cardNumber.replace(/(.{4})/g, '$1 ').trim();
};

/**
 * 格式化條碼號碼顯示
 * @param {string} barcodeNumber - 原始條碼號碼
 * @returns {string} 格式化後的條碼號碼
 */
const formatBarcodeNumber = (barcodeNumber: string): string => {
    return barcodeNumber;
};

/**
 * 生成條碼
 * 使用 JsBarcode 函式庫動態生成會員條碼
 */
const generateBarcode = () => {
    if (barcodeElement.value && currentCard.value && currentCard.value.barcodeNumber) {
        // 清空元素內容，避免重複生成
        while (barcodeElement.value.firstChild) {
            barcodeElement.value.removeChild(barcodeElement.value.firstChild);
        }

        // 使用 JsBarcode 生成條碼
        JsBarcode(barcodeElement.value, currentCard.value.barcodeNumber, {
            format: 'CODE128',
            lineColor: '#000',
            width: 2,
            height: 80,
            displayValue: false,
            margin: 0
        });
    }
};

/**
 * 生成 QR 碼
 * 使用 qrcode.js 函式庫動態生成會員 QR 碼
 */
const generateQRCode = async () => {
    if (qrcodeElement.value && currentCard.value && currentCard.value.cardNumber) {
        // 清空元素內容，避免重複生成
        qrcodeElement.value.innerHTML = '';

        // 設定 QR 碼內容，通常是會員識別資訊或網址
        const qrCodeContent = `MEMBER:${currentCard.value.cardNumber}`;

        try {
            // 使用 canvas 生成 QR 碼
            const canvas = document.createElement('canvas');
            await QRCode.toCanvas(canvas, qrCodeContent, {
                width: 200,
                margin: 0,
                color: {
                    dark: '#000',
                    light: '#FFF'
                }
            });

            qrcodeElement.value.appendChild(canvas);
        } catch (error) {
            console.error('生成 QR 碼時出錯：', error);
        }
    }
};

// 監視當前卡片變更，更新條碼和 QR 碼
watch(() => currentCard.value, () => {
    generateBarcode();
    generateQRCode();
});

// 元件掛載時生成條碼和 QR 碼
onMounted(() => {
    // 從API獲取會員資料
    fetchMemberData();

    // 生成卡片背景圖案
    generateCardPattern();
});

/**
 * 生成卡片背景圖案
 * 動態生成卡片背景上的點點圖案
 */
const generateCardPattern = () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
        const pattern = card.querySelector('.card-pattern');
        if (pattern) {
            // 設定點點的顏色 - 使用更柔和的顏色
            const dotColors = ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.3)'];

            // 生成 SVG 點點圖案
            let dotsSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="position: absolute; top: 0; left: 0; z-index: 0;">`;

            // 添加漸變背景
            dotsSvg += `
                <defs>
                    <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="rgba(255,255,255,0.15)" />
                        <stop offset="100%" stop-color="rgba(0,0,0,0.1)" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#cardGradient)" />
            `;

            // 生成不同大小和位置的隨機點點
            for (let i = 0; i < 60; i++) {
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const size = Math.random() * 15 + 2;
                const colorIndex = Math.floor(Math.random() * dotColors.length);
                const opacity = Math.random() * 0.6 + 0.2; // 調整點點的不透明度

                dotsSvg += `<circle cx="${x}%" cy="${y}%" r="${size}" fill="${dotColors[colorIndex]}" opacity="${opacity}" />`;
            }

            dotsSvg += `</svg>`;

            // 將 SVG 插入到模式元素中
            pattern.innerHTML = dotsSvg;
        }
    });
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

.member-card-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--background-light);
    padding-top: 56px; // 確保內容不被固定標頭遮蓋
    padding-bottom: 70px; // 為頁尾留出空間
}


.content-container {
    max-width: 375px;
    margin: auto
}

/* 卡片輪播區域 */
.card-carousel {
    position: relative;
    width: 100%;
    margin: $spacing-lg 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: var(--white);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    z-index: 2;

    &.prev {
        left: -12px;
    }

    &.next {
        right: -12px;
    }

    .material-icons {
        font-size: 24px;
        color: var(--body-text);
    }
}

/* 會員卡樣式 */
.card-wrapper {
    width: 100%;
    padding: 0 $spacing-md;
}

.card {
    position: relative;
    width: 100%;
    aspect-ratio: 1.618 / 1;
    /* 黃金比例 */
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    padding: $spacing-lg;
    display: flex;
    flex-direction: column;
    color: white;
    /* 默認文字顏色改為白色 */
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
    }
}

.card-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.card-header {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $spacing-lg;
}

.card-brand {
    font-size: 28px;
    font-weight: bold;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    letter-spacing: 0.5px;
}

.card-status {
    background-color: rgba(255, 255, 255, 0.25); // 改為白色半透明背景
    padding: 4px 12px; // 增加水平內邊距
    border-radius: 20px; // 更圓潤的邊角
    font-size: 12px;
    color: white; // 白色文字
    font-weight: 600; // 加粗增加可讀性
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer; // 指示可點擊
    transition: all 0.2s ease; // 平滑過渡效果
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); // 添加陰影增加層次感

    &:hover {
        background-color: rgba(255, 255, 255, 0.35); // 懸停時背景變亮
        transform: translateY(-1px); // 輕微上浮效果
    }

    i {
        font-size: 10px; // 小一點的圖標
    }
}

.card-info {
    position: relative;
    z-index: 1;
    margin-top: auto;
    background-color: rgba(255, 255, 255, 0.2); // 增加亮度
    padding: $spacing-sm $spacing-md; // 增加水平內邊距
    border-radius: 12px; // 更圓潤的邊角
    backdrop-filter: blur(4px); // 增強模糊效果
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); // 添加陰影
    border: 1px solid rgba(255, 255, 255, 0.3); // 添加邊框增加層次感
}

.card-number-label {
    font-size: 12px;
    margin-bottom: 4px;
    color: rgba(255, 255, 255, 0.95); // 更亮的文字顏色
    font-weight: 600; // 加粗增加可讀性
    text-transform: uppercase; // 大寫字母更專業
    letter-spacing: 0.5px; // 增加字母間距
}

.card-number {
    font-size: 20px; // 增大字體
    font-weight: 700; // 更粗的字體
    letter-spacing: 2px; // 增加字母間距
    color: white; // 白色文字
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4); // 增強文字陰影
    margin-bottom: 4px; // 增加底部間距
}

.card-points {
    position: relative;
    z-index: 1;
    display: flex;
    margin-top: $spacing-md;
    gap: $spacing-lg;
    justify-content: space-around; // 均勻分布
}

.point-item {
    display: flex;
    align-items: center;
    padding: 6px 12px; // 添加內邊距
    border-radius: 8px; // 圓角
    backdrop-filter: blur(2px); // 模糊效果
}

.point-icon {
    font-size: 16px;
    margin-right: 6px;
    color: rgba(255, 255, 255, 0.9); // 白色圖標

    &.active {
        color: #ffcc00; // 金色高亮
    }
}

.point-label {
    font-size: 14px;
    margin-right: 4px;
    color: rgba(255, 255, 255, 0.8); // 白色文字
}

.point-value {
    font-size: 18px;
    font-weight: bold;
    color: white; // 白色文字
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); // 文字陰影
}

/* 條碼區域 */
.barcode-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: $spacing-lg 0;
}

.barcode {
    width: 100%;
    background-color: white;
    padding: $spacing-md;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: center;
}

.barcode-img {
    width: 100%;
    height: auto;
}

.barcode-number {
    margin-top: $spacing-sm;
    font-size: 14px;
    letter-spacing: 1px;
    color: var(--body-text);
}

/* QR碼區域 */
.qrcode-section {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: $spacing-md 0 $spacing-lg;
}

.qrcode {
    background-color: white;
    padding: $spacing-md;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.qrcode-container {
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;

    canvas {
        max-width: 100%;
        max-height: 100%;
    }
}

.footer-divider {
    width: 100%;
    height: 1px;
    background-color: var(--border-disabled);
    margin-top: auto;
}

/* Safari 瀏覽器適配 */
@supports (-webkit-touch-callout: none) {
    .header {
        padding-top: max(env(safe-area-inset-top), 20px);
    }

    .member-card-page {
        padding-top: calc(56px + max(env(safe-area-inset-top), 20px));
    }
}

@media (max-width: 400px) {
    .content-container {
        padding: 0 16px;
    }
}

/* 響應式設計 */
@media (max-width: 375px) {
    .carousel-arrow {
        &.prev {
            left: 0;
        }

        &.next {
            right: 0;
        }
    }

    .qrcode-container {
        width: 160px;
        height: 160px;
    }
}
</style>
