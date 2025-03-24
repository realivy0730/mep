<template>
    <div class="page-container">
        <!-- 固定標頭 -->
        <header class="header">
            <div class="header-content">
                <button class="back-button" @click="$router.go(-1)">
                    <span class="material-icons">arrow_back</span>
                </button>
                <h1 class="page-title">會員等級</h1>
                <div class="header-right"></div>
            </div>
        </header>

        <!-- 主要內容區域 -->
        <main class="main-content">
            <div class="content-container">
                <!-- 當前等級卡片 -->
                <div class="current-level-card" :style="{ 'background-color': currentLevel.bgColor }">
                    <div class="level-pattern"></div>
                    <div class="level-header">
                        <div class="level-name">{{ currentLevel.name }}</div>
                        <div class="level-status">{{ currentLevel.status }}</div>
                    </div>
                    <div class="level-info">
                        <div class="member-since">會員加入日期: {{ currentLevel.memberSince }}</div>
                        <div class="level-benefits">
                            <div class="benefit-title">等級權益</div>
                            <div class="benefit-item" v-for="(benefit, index) in currentLevel.benefits" :key="index">
                                <i class="fa-solid fa-check"></i>
                                <span>{{ benefit }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 等級進度條 -->
                <div class="level-progress-section">
                    <div class="progress-header">
                        <div class="progress-title">距離下一等級</div>
                        <div class="progress-value">{{ currentLevel.currentPoints }} / {{ currentLevel.nextLevelPoints
                        }}</div>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
                    </div>
                    <div class="progress-info">
                        再累積 {{ pointsNeeded }} 點即可升級為 {{ nextLevelName }}
                    </div>
                </div>

                <!-- 所有等級列表 -->
                <div class="all-levels-section">
                    <div class="section-title">會員等級一覽</div>
                    <div class="levels-list">
                        <div v-for="level in allLevels" :key="level.id" class="level-item"
                            :class="{ 'current': level.id === currentLevel.id }">
                            <div class="level-item-header">
                                <div class="level-item-name">{{ level.name }}</div>
                                <div class="level-item-points">{{ level.requiredPoints }}+ 點</div>
                            </div>
                            <div class="level-item-benefits">
                                <div v-for="(benefit, index) in level.benefits" :key="index" class="level-item-benefit">
                                    <i class="fa-solid fa-check"></i>
                                    <span>{{ benefit }}</span>
                                </div>
                            </div>
                        </div>
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
import { ref, computed, onMounted } from 'vue';
import Footer from '@/components/Footer.vue';

// 當前會員等級資料
const currentLevel = ref({
    id: 2,
    name: '白金會員',
    status: '有效期限: 2025/12/31',
    memberSince: '2023/05/15',
    currentPoints: 2800,
    nextLevelPoints: 5000,
    bgColor: '#6a5acd',
    benefits: [
        '生日禮金 200 點',
        '每月專屬優惠券',
        '消費享 2% 回饋',
        '指定商品 9 折優惠'
    ]
});

// 所有等級資料
const allLevels = ref([
    {
        id: 1,
        name: '一般會員',
        requiredPoints: 0,
        benefits: [
            '生日禮金 100 點',
            '每月專屬優惠券',
            '消費享 1% 回饋'
        ]
    },
    {
        id: 2,
        name: '白金會員',
        requiredPoints: 2000,
        benefits: [
            '生日禮金 200 點',
            '每月專屬優惠券',
            '消費享 2% 回饋',
            '指定商品 9 折優惠'
        ]
    },
    {
        id: 3,
        name: '鑽石會員',
        requiredPoints: 5000,
        benefits: [
            '生日禮金 500 點',
            '每月專屬優惠券',
            '消費享 3% 回饋',
            '全館商品 9 折優惠',
            '專屬客服專線'
        ]
    },
    {
        id: 4,
        name: 'VIP 會員',
        requiredPoints: 10000,
        benefits: [
            '生日禮金 1000 點',
            '每月專屬優惠券',
            '消費享 5% 回饋',
            '全館商品 85 折優惠',
            '專屬客服專線',
            '免費停車 2 小時'
        ]
    }
]);

// 計算進度百分比
const progressPercentage = computed(() => {
    const { currentPoints, nextLevelPoints } = currentLevel.value;
    const percentage = (currentPoints / nextLevelPoints) * 100;
    return Math.min(percentage, 100);
});

// 計算還需要多少點數升級
const pointsNeeded = computed(() => {
    return currentLevel.value.nextLevelPoints - currentLevel.value.currentPoints;
});

// 下一個等級名稱
const nextLevelName = computed(() => {
    const currentLevelId = currentLevel.value.id;
    const nextLevel = allLevels.value.find(level => level.id === currentLevelId + 1);
    return nextLevel ? nextLevel.name : '最高等級';
});

// 生成等級卡片背景圖案
const generateLevelPattern = () => {
    const levelCard = document.querySelector('.current-level-card');
    const pattern = levelCard?.querySelector('.level-pattern');

    if (pattern) {
        // 設定點點的顏色
        const dotColors = ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)'];

        // 生成 SVG 點點圖案
        let dotsSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="position: absolute; top: 0; left: 0; z-index: 0;">`;

        // 生成不同大小和位置的隨機點點
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 15 + 2;
            const colorIndex = Math.floor(Math.random() * dotColors.length);
            const opacity = Math.random() * 0.7 + 0.3;

            dotsSvg += `<circle cx="${x}%" cy="${y}%" r="${size}" fill="${dotColors[colorIndex]}" opacity="${opacity}" />`;
        }

        dotsSvg += `</svg>`;

        // 將 SVG 插入到模式元素中
        pattern.innerHTML = dotsSvg;
    }
};

// 元件掛載時執行
onMounted(() => {
    // 這裡可以加入 API 請求載入會員等級資料

    // 生成等級卡片背景圖案
    generateLevelPattern();
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

.member-levels-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--background-light);
    padding-top: 56px; // 確保內容不被固定標頭遮蓋
    padding-bottom: 70px; // 為頁尾留出空間
}

/* 當前等級卡片 */
.current-level-card {
    position: relative;
    width: 100%;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    padding: $spacing-lg;
    display: flex;
    flex-direction: column;
    color: white;
    margin-bottom: $spacing-lg;
}

.level-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.level-header {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $spacing-md;
}

.level-name {
    font-size: 24px;
    font-weight: bold;
}

.level-status {
    font-size: 14px;
    opacity: 0.8;
}

.level-info {
    position: relative;
    z-index: 1;
}

.member-since {
    font-size: 14px;
    margin-bottom: $spacing-md;
    opacity: 0.8;
}

.level-benefits {
    margin-top: $spacing-md;
}

.benefit-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: $spacing-sm;
}

.benefit-item {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-xs;
    font-size: 14px;

    i {
        margin-right: $spacing-xs;
        font-size: 12px;
    }
}

/* 等級進度條 */
.level-progress-section {
    background-color: white;
    border-radius: 12px;
    padding: $spacing-md;
    margin-bottom: $spacing-lg;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.progress-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: $spacing-sm;
}

.progress-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--heading);
}

.progress-value {
    font-size: 14px;
    color: var(--body-text);
}

.progress-bar-container {
    height: 8px;
    background-color: var(--background-light);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: $spacing-sm;
}

.progress-bar {
    height: 100%;
    background-color: var(--primary);
    border-radius: 4px;
    transition: width 0.5s ease;
}

.progress-info {
    font-size: 14px;
    color: var(--body-text);
    text-align: center;
}

/* 所有等級列表 */
.all-levels-section {
    background-color: white;
    border-radius: 12px;
    padding: $spacing-md;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
    font-size: 18px;
    font-weight: 500;
    color: var(--heading);
    margin-bottom: $spacing-md;
}

.levels-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
}

.level-item {
    border: 1px solid var(--border-disabled);
    border-radius: 8px;
    padding: $spacing-md;
    transition: all 0.3s ease;

    &.current {
        border-color: var(--primary);
        background-color: rgba(var(--primary-rgb), 0.05);
    }
}

.level-item-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: $spacing-sm;
}

.level-item-name {
    font-size: 16px;
    font-weight: 500;
    color: var(--heading);
}

.level-item-points {
    font-size: 14px;
    color: var(--primary);
    font-weight: 500;
}

.level-item-benefits {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
}

.level-item-benefit {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--body-text);

    i {
        color: var(--primary);
        margin-right: $spacing-xs;
        font-size: 12px;
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

    .member-levels-page {
        padding-top: calc(56px + max(env(safe-area-inset-top), 20px));
    }
}
</style>
