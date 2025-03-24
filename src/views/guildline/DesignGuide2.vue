// GuidelineComponents.vue
<script setup>
import { ref } from 'vue'

const dateItems = ref([
    {
        label: 'Default',
        startDate: '',
        endDate: '',
        type: 'default'
    },
    {
        label: '有值',
        startDate: '2022-10-10',
        endDate: '2022-10-20',
        type: 'filled'
    },
    {
        label: '有值hover',
        startDate: '2022-10-10',
        endDate: '2022-10-20',
        type: 'hover'
    },
    {
        label: 'del-hover',
        startDate: '2022-10-10',
        endDate: '2022-10-20',
        type: 'del-hover'
    },
    {
        label: 'label',
        startDate: '2022-10-10',
        endDate: '2022-10-20',
        type: 'with-label',
        prefix: '活動走期：'
    }
])

const statusItems = ref([
    { label: 'Processing', status: 'processing', text: '進行中' },
    { label: 'Success', status: 'success', text: '成功' },
    { label: 'Fail', status: 'fail', text: '失敗' }
])

const avatarStatuses = ref([
    { label: 'Default', type: 'default' },
    { label: 'fail', type: 'fail', text: '資格驗證' },
    { label: 'Success', type: 'success', text: '驗證成功' }
])

const chartColors = ref([
    '#FC8802', '#4AA9FF', '#159E42', '#FF4D88',
    '#FF8833', '#33D6E1', '#FF99CC', '#1A237E',
    '#FFE500', '#3366FF'
])

// 圖示尺寸定義
const iconSizes = ref([
    { name: 'md', size: '20x20', iconClass: 'icon-md' },
    { name: 'Sm', size: '18x18', iconClass: 'icon-sm' },
    { name: 'XS', size: '14x14', iconClass: 'icon-xs' }
])

// 用於展示的示例圖示
const demoIcons = ref([
    { name: 'home', label: '首頁' },
    { name: 'search', label: '搜尋' },
    { name: 'notifications', label: '通知' }
])

const levels = ref([
    { level: 1, name: '未達標準', color: '#DDDDDD' },
    { level: 2, name: '通過標準', color: '#DDDDDD', active: true },
    { level: 3, name: '銅牌客戶', color: '#B39DDB' },
    { level: 4, name: '銀牌客戶', color: '#B39DDB', active: true },
    { level: 5, name: '金牌客戶', color: '#673AB7' },
    { level: 6, name: '白金客戶', color: '#FC8802' }
])
</script>

<template>
    <div class="container">
        <h1 class="section-title">05</h1>

        <!-- 日期選擇器區域 -->
        <section class="section">
            <h2 class="section-heading">Date</h2>
            <div class="date-container">
                <div v-for="item in dateItems" :key="item.label" class="date-group">
                    <label class="date-label">{{ item.label }}</label>
                    <div :class="['date-picker', item.type]">
                        <span v-if="item.prefix" class="prefix">{{ item.prefix }}</span>
                        <input type="text" :value="item.startDate" :placeholder="!item.startDate ? '開始日期' : ''"
                            readonly />
                        <span class="separator">－</span>
                        <input type="text" :value="item.endDate" :placeholder="!item.endDate ? '結束日期' : ''" readonly />
                        <span v-if="item.type === 'del-hover'" class="clear-icon">×</span>
                    </div>
                </div>

                <div class="date-group">
                    <label class="date-label">單一日期</label>
                    <div class="date-picker single">
                        <input type="text" placeholder="單一日期" readonly />
                    </div>
                </div>
            </div>
        </section>

        <!-- 時間選擇器 -->
        <section class="section">
            <h2 class="section-heading">Time</h2>
            <div class="time-picker">
                <input type="text" value="00:00~14:00" readonly />
            </div>
        </section>

        <!-- 狀態顯示區域 -->
        <section class="section">
            <h2 class="section-heading">表格內狀態</h2>
            <div class="status-container">
                <div v-for="item in statusItems" :key="item.label" class="status-item">
                    <span class="status-label">{{ item.label }}</span>
                    <span :class="['status-tag', item.status]">{{ item.text }}</span>
                </div>
            </div>
        </section>

        <!-- 頭像狀態 -->
        <section class="section">
            <h2 class="section-heading">狀態</h2>
            <div class="avatar-container">
                <div v-for="status in avatarStatuses" :key="status.type" class="avatar-group">
                    <div :class="['avatar', status.type]"></div>
                    <span v-if="status.text" :class="['status-badge', status.type]">
                        {{ status.text }}
                    </span>
                    <span v-else class="avatar-label">{{ status.label }}</span>
                </div>
            </div>
        </section>

        <!-- 圖表配色 -->
        <section class="section">
            <h2 class="section-heading">圖表配色</h2>
            <div class="color-grid">
                <div v-for="color in chartColors" :key="color" class="color-block" :style="{ backgroundColor: color }">
                </div>
            </div>
        </section>

        <!-- Icon 大小 -->
        <section class="section">
            <h2 class="section-heading">Icon size</h2>

            <!-- 圖示尺寸展示 -->
            <div class="icon-size-container">
                <div v-for="size in iconSizes" :key="size.name" class="icon-size-section">
                    <h3 class="icon-size-title">{{ size.name }} ({{ size.size }})</h3>
                    <div class="icon-examples">
                        <div v-for="icon in demoIcons" :key="icon.name" class="icon-demo-item">
                            <div :class="['icon-wrapper', size.iconClass]">
                                <span class="material-icons">{{ icon.name }}</span>
                            </div>
                            <span class="icon-label">{{ icon.label }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 等級系統 -->
        <section class="section">
            <h2 class="section-heading">等級</h2>
            <div class="level-container">
                <div v-for="level in levels" :key="level.level" :class="['level-item', { 'is-active': level.active }]">
                    <div class="level-badge" :style="{ backgroundColor: level.color }">
                        <span class="level-star">★</span>
                        <span v-if="level.active" class="level-active-indicator">1</span>
                    </div>
                    <span class="level-name">{{ level.name }}</span>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: "PingFang TC", "微軟正黑體", sans-serif;
}

.section {
    margin-bottom: 2rem;
}

.section-title {
    font-size: 2.5rem;
    color: #666;
    margin-bottom: 2rem;
    font-weight: normal;
}

.section-heading {
    font-size: 1rem;
    color: #333;
    margin-bottom: 1.5rem;
}

/* 日期選擇器樣式 */
.date-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.date-group {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.date-label {
    width: 100px;
    color: #666;
    font-size: 0.875rem;
}

.date-picker {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border: 1px solid #EBEBEB;
    border-radius: 4px;
    background: #fff;
    min-width: 280px;
}

.date-picker input {
    border: none;
    outline: none;
    padding: 0 0.5rem;
    width: 120px;
    font-size: 0.875rem;
}

.date-picker input::placeholder {
    color: #929AA3;
}

.date-picker .separator {
    color: #666;
    padding: 0 0.5rem;
}

.date-picker.filled {
    border-color: #ddd;
}

.date-picker.hover,
.date-picker:hover {
    border-color: #FC8802;
}

.date-picker .prefix {
    color: #666;
    font-size: 0.875rem;
}

.date-picker .clear-icon {
    color: #666;
    cursor: pointer;
    padding: 0 0.5rem;
}

.date-picker.single {
    width: 200px;
}

/* 時間選擇器樣式 */
.time-picker {
    width: 200px;
    padding: 0.5rem;
    border: 1px solid #EBEBEB;
    border-radius: 4px;
    background: #fff;
}

.time-picker input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.875rem;
}

/* 狀態標籤樣式 */
.status-container {
    display: flex;
    gap: 2rem;
}

.status-item {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.status-label {
    color: #666;
    font-size: 0.875rem;
}

.status-tag {
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.875rem;
}

.status-tag.processing {
    background: #f0f0f0;
    color: #666;
}

.status-tag.success {
    background: #e6f4ea;
    color: #159E42;
}

.status-tag.fail {
    background: #fce8e8;
    color: #CC0D39;
}

/* 頭像狀態樣式 */
.avatar-container {
    display: flex;
    gap: 2rem;
}

.avatar-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #f0f0f0;
}

.avatar.success {
    border: 2px solid #159E42;
}

.avatar.fail {
    border: 2px solid #CC0D39;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
}

.status-badge.fail {
    background: #fce8e8;
    color: #CC0D39;
}

.status-badge.success {
    background: #e6f4ea;
    color: #159E42;
}

.avatar-label {
    color: #666;
    font-size: 0.875rem;
}

/* 圖表配色樣式 */
.color-grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 0.5rem;
    margin-top: 1rem;
}

.color-block {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 4px;
}

/* Icon 大小樣式 */
.icon-size-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.icon-size-section {
    margin-bottom: 2rem;
}

.icon-size-title {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 1rem;
}

.icon-examples {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.icon-demo-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #485771;
}

/* 圖示尺寸定義 */
.icon-md {
    width: 20px;
    height: 20px;
    font-size: 20px;
}

.icon-sm {
    width: 18px;
    height: 18px;
    font-size: 18px;
}

.icon-xs {
    width: 14px;
    height: 14px;
    font-size: 14px;
}

.icon-label {
    font-size: 0.75rem;
    color: #666;
}

/* 等級系統樣式 */
.level-container {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

.level-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.level-badge {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.level-star {
    color: white;
    font-size: 1.5rem;
}

.level-active-indicator {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #FC8802;
    color: white;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
}

.level-name {
    font-size: 0.75rem;
    color: #666;
}

/* 圖示共用基礎樣式 */
[class^="icon-"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #485771;
    /* 設計規範中的文字顏色 */
}

/* 中型圖示 - 20x20 */
.icon-md {
    width: 20px;
    height: 20px;
    font-size: 20px;
    line-height: 20px;
}

/* 小型圖示 - 18x18 */
.icon-sm {
    width: 18px;
    height: 18px;
    font-size: 18px;
    line-height: 18px;
}

/* 超小型圖示 - 14x14 */
.icon-xs {
    width: 14px;
    height: 14px;
    font-size: 14px;
    line-height: 14px;
}

.material-icons {
    font-size: inherit;
}
</style>
