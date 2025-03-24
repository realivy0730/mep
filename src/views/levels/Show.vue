<template>
    <div class="level-detail-page">
        <!-- 固定標頭 -->
        <header class="header">
            <div class="header-content">
                <button class="back-btn" @click="$router.go(-1)">
                    <span class="material-icons">arrow_back</span>
                </button>
                <h1 class="page-title">等級詳情</h1>
            </div>
        </header>

        <!-- 主要內容區域 -->
        <main class="main-content">
            <div class="content-container">
                <!-- 等級卡片 -->
                <div class="level-card" :style="{ 'background-color': levelData.bgColor }">
                    <div class="level-pattern"></div>
                    <div class="level-header">
                        <div class="level-name">{{ levelData.name }}</div>
                        <div class="level-badge">
                            <i class="fa-solid" :class="levelData.icon"></i>
                        </div>
                    </div>
                    <div class="level-description">
                        {{ levelData.description }}
                    </div>
                </div>

                <!-- 等級權益 -->
                <div class="benefits-section">
                    <h2 class="section-title">等級權益</h2>
                    <div class="benefits-list">
                        <div class="benefit-item" v-for="(benefit, index) in levelData.benefits" :key="index">
                            <div class="benefit-icon">
                                <i class="fa-solid" :class="benefit.icon"></i>
                            </div>
                            <div class="benefit-content">
                                <div class="benefit-title">{{ benefit.title }}</div>
                                <div class="benefit-description">{{ benefit.description }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 升級條件 -->
                <div class="upgrade-section">
                    <h2 class="section-title">升級條件</h2>
                    <div class="upgrade-requirements">
                        <div class="requirement-item" v-for="(req, index) in levelData.requirements" :key="index">
                            <div class="requirement-icon">
                                <i class="fa-solid" :class="req.icon"></i>
                            </div>
                            <div class="requirement-content">
                                <div class="requirement-title">{{ req.title }}</div>
                                <div class="requirement-description">{{ req.description }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 等級有效期 -->
                <div class="validity-section">
                    <h2 class="section-title">等級有效期</h2>
                    <div class="validity-info">
                        <p>{{ levelData.validityInfo }}</p>
                        <div class="validity-dates">
                            <div class="date-item">
                                <div class="date-label">開始日期</div>
                                <div class="date-value">{{ levelData.startDate }}</div>
                            </div>
                            <div class="date-item">
                                <div class="date-label">到期日期</div>
                                <div class="date-value">{{ levelData.endDate }}</div>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Footer from '@/components/Footer.vue';

const route = useRoute();
const levelId = route.params.id;

// 等級詳細資料
const levelData = ref({
    id: levelId || '2',
    name: '白金會員',
    description: '白金會員是我們的高級會員等級，享有專屬優惠和服務。',
    bgColor: '#6a5acd',
    icon: 'fa-gem',
    startDate: '2024/01/01',
    endDate: '2025/12/31',
    validityInfo: '會員等級有效期為一年，達到續約條件可自動延長等級有效期。',
    benefits: [
        {
            icon: 'fa-gift',
            title: '生日禮金',
            description: '生日當月獲得 200 點生日禮金'
        },
        {
            icon: 'fa-percent',
            title: '消費回饋',
            description: '所有消費享 2% 點數回饋'
        },
        {
            icon: 'fa-tag',
            title: '專屬折扣',
            description: '指定商品享 9 折優惠'
        },
        {
            icon: 'fa-ticket',
            title: '專屬優惠券',
            description: '每月獲得專屬優惠券'
        }
    ],
    requirements: [
        {
            icon: 'fa-coins',
            title: '累積消費',
            description: '年度累積消費達 20,000 元'
        },
        {
            icon: 'fa-calendar-check',
            title: '消費頻率',
            description: '一年內至少消費 5 次'
        }
    ]
});

// 生成等級卡片背景圖案
const generateLevelPattern = () => {
    const levelCard = document.querySelector('.level-card');
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
    // 這裡可以加入 API 請求載入特定等級的詳細資料
    // 例如: fetchLevelDetails(levelId);

    // 生成等級卡片背景圖案
    generateLevelPattern();
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

.level-detail-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--background-light);
    padding-top: 56px; // 確保內容不被固定標頭遮蓋
    padding-bottom: 70px; // 為頁尾留出空間
}


/* 等級卡片 */
.level-card {
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
    min-height: 150px;
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
    align-items: center;
    margin-bottom: $spacing-md;
}

.level-name {
    font-size: 24px;
    font-weight: bold;
}

.level-badge {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;

    i {
        font-size: 20px;
    }
}

.level-description {
    position: relative;
    z-index: 1;
    font-size: 16px;
    opacity: 0.9;
}

/* 共用區塊樣式 */
.benefits-section,
.upgrade-section,
.validity-section {
    background-color: white;
    border-radius: 12px;
    padding: $spacing-md;
    margin-bottom: $spacing-lg;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
    font-size: 18px;
    font-weight: 500;
    color: var(--heading);
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid var(--border-disabled);
}

/* 權益列表 */
.benefits-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
}

.benefit-item {
    display: flex;
    align-items: flex-start;
}

.benefit-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(var(--primary-rgb), 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: $spacing-md;

    i {
        font-size: 18px;
        color: var(--primary);
    }
}

.benefit-content {
    flex: 1;
}

.benefit-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--heading);
    margin-bottom: $spacing-xs;
}

.benefit-description {
    font-size: 14px;
    color: var(--body-text);
}

/* 升級條件 */
.upgrade-requirements {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
}

.requirement-item {
    display: flex;
    align-items: flex-start;
}

.requirement-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(var(--primary-rgb), 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: $spacing-md;

    i {
        font-size: 18px;
        color: var(--primary);
    }
}

.requirement-content {
    flex: 1;
}

.requirement-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--heading);
    margin-bottom: $spacing-xs;
}

.requirement-description {
    font-size: 14px;
    color: var(--body-text);
}

/* 等級有效期 */
.validity-info {
    p {
        font-size: 14px;
        color: var(--body-text);
        margin-bottom: $spacing-md;
    }
}

.validity-dates {
    display: flex;
    justify-content: space-between;
    gap: $spacing-md;
}

.date-item {
    flex: 1;
    background-color: var(--background-light);
    padding: $spacing-md;
    border-radius: 8px;
    text-align: center;
}

.date-label {
    font-size: 14px;
    color: var(--body-text);
    margin-bottom: $spacing-xs;
}

.date-value {
    font-size: 16px;
    font-weight: 500;
    color: var(--heading);
}

.footer-divider {
    width: 100%;
    height: 1px;
    background-color: var(--border-disabled);
    margin-top: auto;
}

/* Safari 瀏覽器適配 */
@supports (-webkit-touch-callout: none) {

    .level-detail-page {
        padding-top: calc(56px + max(env(safe-area-inset-top), 20px));
    }
}
</style>
