# 主要需求

請幫我用附件裡面的所有的css來取樣，我要製作一個網站樣板的顏色
請協助我產生`主要色系` `文字色系` `背景色系` `輔助色系`


# 附加檔案

## src/views/guildline/DesignGuide.vue
```
<!-- StyleGuide.vue -->
<template>
    <div class="container">
        <h1 class="section-title">01</h1>

        <!-- 顏色部分 -->
        <section class="color-section">
            <h2>Color</h2>
            <div class="color-grid">
                <div v-for="color in colors" :key="color.name" class="color-item">
                    <div class="color-preview" :style="{ backgroundColor: color.hex }"></div>
                    <div class="color-info">
                        <div class="color-name">{{ color.name }}</div>
                        <div class="color-hex">{{ color.hex }}</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 類型部分 -->
        <section class="typography-section">
            <h2>Type</h2>
            <div v-for="type in typography" :key="type.name" class="type-item">
                <div class="type-name">{{ type.name }}</div>
                <component :is="type.tag" :class="type.className" v-html="type.content"></component>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// 顏色資料
const colors = ref([
    { name: 'Primary', hex: '#FC8802' },
    { name: 'Down', hex: '#CC0D39' },
    { name: 'Up', hex: '#159E42' },
    { name: '白', hex: '#FFFFFF' },
    { name: 'Bg-light/頁面底色', hex: '#F9F9F9' },
    { name: 'table-striped', hex: '#F7F8F9' },
    { name: 'Border/Disabled', hex: '#EBEBEB' },
    { name: '欄位說明 placeholder', hex: '#929AA3' },
    { name: '全站文字/次標題', hex: '#485771' },
    { name: '主標題', hex: '#293954' }
])

// 文字樣式資料
const typography = ref([
    {
        name: '內文',
        tag: 'p',
        className: 'body-text',
        content: '簡報段落是文章中最基本的單位，從內容上說，它具有一個獨立完整的意思。在文學寫作中，段與段之間常常只有一行間距。'
    },
    {
        name: '文字連結',
        tag: 'a',
        className: 'text-link',
        content: '文字連結'
    },
    {
        name: 'Heading1',
        tag: 'h1',
        className: 'heading-1',
        content: 'h1. Bootstrap'
    },
    {
        name: 'Heading2',
        tag: 'h2',
        className: 'heading-2',
        content: 'h2. Bootstrap'
    },
    {
        name: 'Heading3',
        tag: 'h3',
        className: 'heading-3',
        content: 'h3. Bootstrap'
    },
    {
        name: '備註',
        tag: 'p',
        className: 'note-text',
        content: '備註/提示型文字'
    },
    {
        name: '強調文字',
        tag: 'p',
        className: 'emphasis-text',
        content: '強調文字'
    }
])
</script>

<style scoped>
/* 重置樣式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* 基礎樣式 */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: "PingFang TC", "微軟正黑體", sans-serif;
    color: #293954;
    line-height: 1.5;
}

/* 章節標題 */
.section-title {
    font-size: 2.5rem;
    color: #293954;
    margin-bottom: 2rem;
    font-weight: 500;
}

/* 顏色區塊 */
.color-section {
    margin-bottom: 3rem;
}

.color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
}

.color-item {
    padding: 1rem;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-preview {
    width: 100%;
    height: 100px;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.color-info {
    font-size: 0.875rem;
}

.color-name {
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.color-hex {
    color: #666;
}

/* 文字樣式區塊 */
.typography-section {
    margin-bottom: 3rem;
}

.type-item {
    margin-bottom: 2rem;
    padding: 1rem;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.type-name {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 0.5rem;
}

/* 文字樣式 */
.text-link {
    color: #FC8802;
    text-decoration: none;
    cursor: pointer;
}

.text-link:hover {
    text-decoration: underline;
}

.heading-1 {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.heading-2 {
    font-size: 1.5rem;
    margin-bottom: 0.875rem;
}

.heading-3 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
}

.note-text {
    color: #666;
    font-size: 0.875rem;
}

.emphasis-text {
    color: #FC8802;
    font-weight: 500;
}

/* 白色背景的顏色預覽需要邊框 */
.color-preview[style*="background-color: #FFFFFF"] {
    border: 1px solid #EBEBEB;
}
</style>

```

## src/views/guildline/DesignGuide2.vue
```
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

```

## src/views/guildline/DesignGuide3.vue
```
<!-- ButtonInputSystem.vue -->
<template>
    <div class="container">
        <h1 class="section-title">02</h1>

        <!-- 按鈕系統 -->
        <section class="section">
            <h2 class="section-heading">Button</h2>

            <!-- 預設按鈕 -->
            <div class="button-group">
                <div class="button-row">
                    <span class="button-label">Default</span>
                    <button class="btn btn-default">一般</button>
                    <button class="btn btn-default hover">Hover</button>
                    <button class="btn btn-default" disabled>Disabled</button>
                </div>

                <!-- 主要按鈕 -->
                <div class="button-row">
                    <span class="button-label">Primary</span>
                    <button class="btn btn-primary">主要</button>
                    <button class="btn btn-primary hover">主要</button>
                    <button class="btn btn-primary" disabled>主要</button>
                </div>

                <!-- 表格內按鈕 -->
                <div class="button-row">
                    <span class="button-label">表格內</span>
                    <button class="btn btn-table">刪除</button>
                    <button class="btn btn-table hover">刪除</button>
                </div>

                <!-- 表格右上角按鈕 -->
                <div class="button-row">
                    <span class="button-label">表格右上角</span>
                    <button class="btn btn-outline">新增</button>
                    <button class="btn btn-primary">確定</button>
                </div>

                <!-- 整頁表單下方按鈕 -->
                <div class="button-row">
                    <span class="button-label">整頁表單下</span>
                    <button class="btn btn-large btn-outline">查詢受眾</button>
                    <button class="btn btn-large btn-primary">查詢受眾</button>
                </div>

                <!-- 功能按鈕 -->
                <div class="button-row">
                    <span class="button-label">功能按鈕</span>
                    <button class="btn btn-icon">
                        <span class="material-icons">download</span>
                        下載
                    </button>
                    <button class="btn btn-icon hover">
                        <span class="material-icons">download</span>
                        下載
                    </button>
                </div>

                <!-- 集合型單選 -->
                <div class="button-row">
                    <span class="button-label">集合型單選</span>
                    <div class="btn-group">
                        <button class="btn btn-group-item active">每日</button>
                        <button class="btn btn-group-item">每日</button>
                        <button class="btn btn-group-item">每日</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- 輸入框系統 -->
        <section class="section">
            <h2 class="section-heading">Input</h2>

            <!-- 基本輸入框 -->
            <div class="input-group">
                <div class="input-row">
                    <span class="input-label">Default</span>
                    <div class="input-wrapper">
                        <input type="text" placeholder="未輸入文字" class="input-default" />
                        <span class="material-icons input-icon">edit</span>
                    </div>
                </div>

                <div class="input-row">
                    <span class="input-label">hover</span>
                    <div class="input-wrapper hover">
                        <input type="text" placeholder="未輸入文字" class="input-default" />
                        <span class="material-icons input-icon">edit</span>
                    </div>
                </div>

                <div class="input-row">
                    <span class="input-label">Focus</span>
                    <div class="input-wrapper focus">
                        <input type="text" value="已輸入文字" class="input-default" />
                    </div>
                </div>

                <div class="input-row">
                    <span class="input-label">Disabled</span>
                    <div class="input-wrapper">
                        <input type="text" placeholder="無法輸入文字" class="input-default" disabled />
                    </div>
                </div>

                <div class="input-row">
                    <span class="input-label">Error</span>
                    <div class="input-wrapper error">
                        <input type="text" value="輸入錯誤" class="input-default" />
                    </div>
                </div>

                <!-- 分頁控制 -->
                <div class="input-row pagination">
                    <span class="input-label">後頁</span>
                    <div class="pagination-controls">
                        <input type="text" value="2" class="input-page" />
                        <span>次</span>
                        <span class="divider"></span>
                        <span>前頁</span>
                        <span>NT$</span>
                        <input type="text" value="2,521" class="input-amount" />
                        <span class="divider"></span>
                        <span>固定數</span>
                        <input type="text" value="12" class="input-fixed" />
                    </div>
                </div>
            </div>
        </section>

        <!-- 輸入框群組 -->
        <section class="section">
            <h2 class="section-heading">Inputgroup</h2>

            <div class="input-group-container">
                <div class="input-group-row">
                    <span class="input-group-label">Default</span>
                    <div class="input-group-content">
                        <label>姓名</label>
                        <input type="text" placeholder="未輸入文字" class="input-group-field" />
                        <span class="input-group-hint">請輸入需複製的LINE OA UID，若需多筆UID，請透行編寫。</span>
                    </div>
                </div>

                <div class="input-group-row">
                    <span class="input-group-label">Error</span>
                    <div class="input-group-content error">
                        <label>姓名</label>
                        <input type="text" placeholder="輸入錯誤" class="input-group-field" />
                        <span class="input-group-error">這裡顯示您輸入的錯誤訊息。</span>
                    </div>
                </div>

                <div class="input-group-row">
                    <span class="input-group-label">Success</span>
                    <div class="input-group-content success">
                        <label>姓名</label>
                        <input type="text" value="即時驗證正確" class="input-group-field" />
                        <span class="input-group-success">這裡顯示完驗證後的成功訊息。</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
/* 容器樣式 */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: "PingFang TC", "微軟正黑體", sans-serif;
}

.section-title {
    font-size: 2.5rem;
    color: #666;
    margin-bottom: 2rem;
}

.section {
    margin-bottom: 3rem;
}

.section-heading {
    font-size: 1.25rem;
    color: #333;
    margin-bottom: 1.5rem;
}

/* 按鈕基礎樣式 */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: 1px solid transparent;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

/* 按鈕變體 */
.btn-default {
    background: #fff;
    border-color: #EBEBEB;
    color: #485771;
}

.btn-default:hover,
.btn-default.hover {
    border-color: #FC8802;
    color: #FC8802;
}

.btn-default:disabled {
    background: #F9F9F9;
    border-color: #EBEBEB;
    color: #929AA3;
    cursor: not-allowed;
}

.btn-primary {
    background: #FC8802;
    color: #fff;
}

.btn-primary:hover,
.btn-primary.hover {
    background: #E37A02;
}

.btn-primary:disabled {
    background: #FFE4CC;
    cursor: not-allowed;
}

.btn-table {
    padding: 0.25rem 0.75rem;
    color: #485771;
}

.btn-table:hover,
.btn-table.hover {
    color: #FC8802;
}

.btn-outline {
    border-color: #EBEBEB;
    color: #485771;
}

.btn-large {
    padding: 0.75rem 2rem;
}

.btn-icon {
    gap: 0.5rem;
}

/* 按鈕群組 */
.btn-group {
    display: flex;
    border: 1px solid #EBEBEB;
    border-radius: 4px;
    overflow: hidden;
}

.btn-group-item {
    flex: 1;
    border: none;
    border-radius: 0;
    background: #fff;
    padding: 0.5rem 1rem;
}

.btn-group-item.active {
    background: #FC8802;
    color: #fff;
}

/* 輸入框基礎樣式 */
.input-default {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #EBEBEB;
    border-radius: 4px;
    font-size: 0.875rem;
    color: #485771;
}

.input-wrapper {
    position: relative;
    width: 300px;
}

.input-wrapper.hover .input-default {
    border-color: #FC8802;
}

.input-wrapper.focus .input-default {
    border-color: #FC8802;
    box-shadow: 0 0 0 2px rgba(252, 136, 2, 0.2);
}

.input-wrapper.error .input-default {
    border-color: #CC0D39;
}

.input-icon {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: #929AA3;
}

/* 分頁控制樣式 */
.pagination-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.input-page,
.input-amount,
.input-fixed {
    width: 60px;
    padding: 0.25rem;
    border: 1px solid #EBEBEB;
    border-radius: 4px;
    text-align: center;
}

.divider {
    width: 1px;
    height: 20px;
    background: #EBEBEB;
    margin: 0 0.5rem;
}

/* 輸入框群組樣式 */
.input-group-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.input-group-row {
    display: flex;
    gap: 2rem;
}

.input-group-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-group-field {
    width: 400px;
    padding: 0.5rem;
    border: 1px solid #EBEBEB;
    border-radius: 4px;
}

.input-group-hint {
    font-size: 0.75rem;
    color: #929AA3;
}

.input-group-error {
    font-size: 0.75rem;
    color: #CC0D39;
}

.input-group-success {
    font-size: 0.75rem;
    color: #159E42;
}

/* 布局輔助樣式 */
.button-group,
.input-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.button-row,
.input-row {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.button-label,
.input-label {
    width: 120px;
    color: #666;
    font-size: 0.875rem;
}
</style>

```

## src/views/guildline/DesignGuide4.vue
```
<!-- LightboxSystem.vue -->
<template>
    <div class="container">
        <h1 class="section-title">08</h1>

        <!-- 標題系統 -->
        <section class="section">
            <!-- 頁面標題 -->
            <div class="page-title">
                <div class="title-container">
                    <h2 class="main-title">頁面標題</h2>
                    <div class="title-content">頁面標題</div>
                </div>
            </div>

            <!-- 區域標題 -->
            <div class="page-title">
                <div class="title-container">
                    <h2 class="sub-title">區域標題</h2>
                    <div class="title-content">
                        <span>區域標題</span>
                        <span class="title-note">窗宽1433px置中</span>
                    </div>
                </div>
            </div>

            <!-- 按鈕區域 -->
            <div class="button-container">
                <button class="btn btn-default">取消</button>
                <button class="btn btn-primary">儲存</button>
                <span class="button-note">有表單提出，action在下方</span>
            </div>
        </section>

        <!-- Lightbox 展示區域 -->
        <section class="section lightbox-demo">
            <h2 class="section-heading">Lightbox</h2>

            <!-- Lightbox 背景 -->
            <div class="lightbox-background">
                <!-- 小型 Lightbox -->
                <div class="lightbox small-lightbox">
                    <div class="lightbox-header">
                        <h3>小型Lightbox</h3>
                        <button class="close-button">×</button>
                    </div>
                    <div class="lightbox-content">
                        <p>點擊確定是希望永久刪除「服務宗旨受眾（暫存：30）」5比王日誌嗎？</p>
                    </div>
                    <div class="lightbox-footer">
                        <button class="btn btn-default">取消</button>
                        <button class="btn btn-primary">確定</button>
                    </div>
                </div>

                <!-- 中型 Lightbox -->
                <div class="lightbox medium-lightbox">
                    <div class="lightbox-header">
                        <h3>中型Lightbox</h3>
                        <button class="close-button">×</button>
                    </div>
                    <div class="lightbox-content">
                        <div class="form-group">
                            <label class="required">Channel name</label>
                            <input type="text" placeholder="測試的官方帳號" class="form-input" />
                            <p class="form-hint">Messaging API Channel 裡面中有「Basic setting」頁面「Channel Name」字樣。</p>
                        </div>
                        <div class="form-group">
                            <label class="required">Channel ID</label>
                            <input type="text" class="form-input" />
                            <p class="form-hint">Messaging API Channel 裡面中有「Basic setting」頁面「Channel ID」字樣。</p>
                        </div>
                        <div class="form-group">
                            <label>新增權限</label>
                            <div class="checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" checked />
                                    <span>LINE 帳號測試權限</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="lightbox-footer">
                        <button class="btn btn-primary full-width">確定</button>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
/* 容器樣式 */
.container {
    max-width: 1433px;
    margin: 0 auto;
    padding: 2rem;
    font-family: "PingFang TC", "微軟正黑體", sans-serif;
}

.section-title {
    font-size: 2.5rem;
    color: #666;
    margin-bottom: 2rem;
}

/* 標題系統樣式 */
.page-title {
    border-bottom: 1px solid #EBEBEB;
    margin-bottom: 1.5rem;
}

.title-container {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    padding: 1rem 0;
}

.main-title,
.sub-title {
    font-size: 1rem;
    color: #485771;
    font-weight: normal;
    min-width: 120px;
}

.title-content {
    color: #485771;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.title-note {
    color: #929AA3;
    font-size: 0.875rem;
}

/* 按鈕樣式 */
.button-container {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin: 2rem 0;
}

.btn {
    padding: 0.5rem 2rem;
    border-radius: 4px;
    border: 1px solid transparent;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.3s ease;
}

.btn-default {
    background: #fff;
    border-color: #EBEBEB;
    color: #485771;
}

.btn-default:hover {
    border-color: #FC8802;
    color: #FC8802;
}

.btn-primary {
    background: #FC8802;
    color: #fff;
}

.btn-primary:hover {
    background: #E37A02;
}

.button-note {
    color: #929AA3;
    font-size: 0.875rem;
}

/* Lightbox 樣式 */
.lightbox-background {
    background: rgba(0, 0, 0, 0.5);
    padding: 2rem;
    position: relative;
    min-height: 500px;
}

.lightbox {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    position: absolute;
}

.small-lightbox {
    width: 400px;
    left: 20%;
    top: 20%;
}

.medium-lightbox {
    width: 600px;
    right: 10%;
    top: 10%;
}

.lightbox-header {
    padding: 1rem;
    border-bottom: 1px solid #EBEBEB;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.lightbox-header h3 {
    font-size: 1rem;
    color: #485771;
    font-weight: normal;
}

.close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #929AA3;
    cursor: pointer;
}

.lightbox-content {
    padding: 1.5rem;
}

.lightbox-footer {
    padding: 1rem;
    border-top: 1px solid #EBEBEB;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

/* 表單樣式 */
.form-group {
    margin-bottom: 1.5rem;
}

.form-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #EBEBEB;
    border-radius: 4px;
    font-size: 0.875rem;
}

.form-hint {
    font-size: 0.75rem;
    color: #929AA3;
    margin-top: 0.5rem;
}

.required::after {
    content: '*';
    color: #FC8802;
    margin-left: 0.25rem;
}

.checkbox-group {
    margin-top: 0.5rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #485771;
    font-size: 0.875rem;
}

.full-width {
    width: 100%;
}
</style>

```

## src/views/guildline/DesignGuide5.vue
```
<!-- FormComponents.vue -->
<template>
    <div class="container">
        <h1 class="section-title">03</h1>

        <!-- Tab 元件 -->
        <section class="section">
            <h2 class="section-heading">Tab</h2>
            <div class="tab-container">
                <div class="tab-group">
                    <button class="tab-item completed">Completed</button>
                    <button class="tab-item current">當前</button>
                    <button class="tab-item disabled">無法訪問</button>
                </div>
            </div>
        </section>

        <!-- Pagination 元件 -->
        <section class="section">
            <h2 class="section-heading">Pagination</h2>
            <div class="pagination-container">
                <span class="pagination-total">共 380 筆</span>
                <div class="pagination-controls">
                    <button class="page-btn" disabled>&lt;&lt;</button>
                    <button class="page-btn" disabled>&lt;</button>
                    <button class="page-btn">1</button>
                    <button class="page-btn current">2</button>
                    <button class="page-btn">3</button>
                    <button class="page-btn">&gt;</button>
                    <button class="page-btn">&gt;&gt;</button>
                    <button class="page-btn">前往</button>
                    <input type="text" class="page-input" value="1" />
                    <span>頁</span>
                </div>
            </div>
        </section>

        <!-- Tag 元件 -->
        <section class="section">
            <h2 class="section-heading">Tag</h2>
            <div class="tag-container">
                <div class="tag-group">
                    <span class="tag-label">Default</span>
                    <span class="tag">標籤</span>
                </div>
                <div class="tag-group">
                    <span class="tag-label">Hover(選點)</span>
                    <span class="tag hover">標籤</span>
                </div>
                <div class="tag-group">
                    <span class="tag-label">Edit</span>
                    <span class="tag edit">標籤</span>
                </div>
                <div class="tag-group">
                    <span class="tag-label">Disabled</span>
                    <span class="tag disabled">標籤</span>
                </div>
                <div class="tag-group">
                    <span class="tag-label">限字數</span>
                    <span class="tag limit">標籤</span>
                </div>
            </div>
        </section>

        <!-- 右側元件區域 -->
        <section class="right-section">
            <!-- Checkbox 元件 -->
            <div class="form-group">
                <h2 class="section-heading">Checkbox</h2>
                <div class="checkbox-container">
                    <div class="checkbox-row">
                        <span class="status-label">Default</span>
                        <label class="checkbox-wrapper">
                            <input type="checkbox" class="checkbox-input" />
                            <span class="checkbox-text">未選擇</span>
                        </label>
                    </div>
                    <div class="checkbox-row">
                        <span class="status-label">Checked</span>
                        <label class="checkbox-wrapper">
                            <input type="checkbox" class="checkbox-input" checked />
                            <span class="checkbox-text">已選擇</span>
                        </label>
                    </div>
                    <div class="checkbox-row">
                        <span class="status-label">Checked-one</span>
                        <label class="checkbox-wrapper">
                            <input type="checkbox" class="checkbox-input checkbox-indeterminate" />
                            <span class="checkbox-text">選中1項</span>
                        </label>
                    </div>
                    <div class="checkbox-row">
                        <span class="status-label">Disabled</span>
                        <label class="checkbox-wrapper">
                            <input type="checkbox" class="checkbox-input" disabled />
                            <span class="checkbox-text">預設選擇</span>
                        </label>
                    </div>
                    <div class="checkbox-row">
                        <span class="status-label">checked-Disabled</span>
                        <label class="checkbox-wrapper">
                            <input type="checkbox" class="checkbox-input" checked disabled />
                            <span class="checkbox-text">預設選擇</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Radio 元件 -->
            <div class="form-group">
                <h2 class="section-heading">Radio</h2>
                <div class="radio-container">
                    <div class="radio-row">
                        <span class="status-label">Default</span>
                        <label class="radio-wrapper">
                            <input type="radio" name="radio-group" class="radio-input" />
                            <span class="radio-text">未選擇</span>
                        </label>
                    </div>
                    <div class="radio-row">
                        <span class="status-label">Checked</span>
                        <label class="radio-wrapper">
                            <input type="radio" name="radio-group" class="radio-input" checked />
                            <span class="radio-text">已選擇</span>
                        </label>
                    </div>
                    <div class="radio-row">
                        <span class="status-label">Disabled</span>
                        <label class="radio-wrapper">
                            <input type="radio" name="radio-group-disabled" class="radio-input" disabled />
                            <span class="radio-text">預設選擇</span>
                        </label>
                    </div>
                    <div class="radio-row">
                        <span class="status-label">checked-Disabled</span>
                        <label class="radio-wrapper">
                            <input type="radio" name="radio-group-disabled" class="radio-input" checked disabled />
                            <span class="radio-text">預設選擇</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Switch 元件 -->
            <div class="form-group">
                <h2 class="section-heading">Switch</h2>
                <div class="switch-container">
                    <label class="switch">
                        <input type="checkbox" checked />
                        <span class="switch-slider"></span>
                    </label>
                    <label class="switch">
                        <input type="checkbox" disabled />
                        <span class="switch-slider"></span>
                    </label>
                </div>
            </div>

            <!-- Textarea 元件 -->
            <div class="form-group">
                <h2 class="section-heading">Textarea</h2>
                <div class="textarea-container">
                    <div class="textarea-group">
                        <span class="status-label">Default</span>
                        <textarea class="textarea" placeholder="多行文字"></textarea>
                    </div>
                    <div class="textarea-group">
                        <span class="status-label">Focus</span>
                        <textarea class="textarea focus" value="已輸入文字"></textarea>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
/* 共用樣式 */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: "PingFang TC", "微軟正黑體", sans-serif;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.section-title {
    font-size: 2.5rem;
    color: #666;
    margin-bottom: 2rem;
    grid-column: 1 / -1;
}

.section-heading {
    font-size: 1rem;
    color: #333;
    margin-bottom: 1.5rem;
}

/* Tab 元件樣式 */
.tab-container {
    margin-bottom: 2rem;
}

.tab-group {
    display: flex;
    gap: 1rem;
}

.tab-item {
    padding: 0.5rem 1.5rem;
    border: 1px solid #EBEBEB;
    border-radius: 20px;
    color: #485771;
    background: none;
    cursor: pointer;
}

.tab-item.current {
    color: #FC8802;
    border-color: #FC8802;
}

.tab-item.completed {
    color: #485771;
}

.tab-item.disabled {
    color: #929AA3;
    border-color: #EBEBEB;
    cursor: not-allowed;
}

/* Pagination 元件樣式 */
.pagination-container {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.page-btn {
    padding: 0.25rem 0.75rem;
    border: 1px solid #EBEBEB;
    background: #fff;
    color: #485771;
    cursor: pointer;
}

.page-btn.current {
    color: #FC8802;
    border-color: #FC8802;
}

.page-btn:disabled {
    color: #929AA3;
    cursor: not-allowed;
}

.page-input {
    width: 40px;
    padding: 0.25rem;
    border: 1px solid #EBEBEB;
    text-align: center;
}

/* Tag 元件樣式 */
.tag-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.tag-group {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.tag {
    padding: 0.25rem 0.75rem;
    border-radius: 16px;
    background: #F9F9F9;
    color: #485771;
    font-size: 0.875rem;
}

.tag.hover {
    background: #FC8802;
    color: #fff;
}

.tag.disabled {
    background: #F9F9F9;
    color: #929AA3;
}

/* Checkbox 樣式 */
.checkbox-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.checkbox-row {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.checkbox-input {
    width: 16px;
    height: 16px;
    border: 1px solid #EBEBEB;
    border-radius: 2px;
}

.checkbox-input:checked {
    background: #FC8802;
    border-color: #FC8802;
}

.checkbox-input:disabled {
    background: #F9F9F9;
    border-color: #EBEBEB;
    cursor: not-allowed;
}

.checkbox-indeterminate {
    position: relative;
}

.checkbox-indeterminate::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 2px;
    background: #FC8802;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Radio 樣式 */
.radio-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.radio-row {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.radio-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.radio-input {
    width: 16px;
    height: 16px;
    border: 1px solid #EBEBEB;
    border-radius: 50%;
}

.radio-input:checked {
    border-color: #FC8802;
    background: #FC8802;
}

.radio-input:disabled {
    background: #F9F9F9;
    cursor: not-allowed;
}

/* Switch 樣式 */
.switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.switch-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #EBEBEB;
    transition: .4s;
    border-radius: 20px;
}

.switch-slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked+.switch-slider {
    background-color: #FC8802;
}

input:disabled+.switch-slider {
    background-color: #F9F9F9;
    cursor: not-allowed;
}

input:checked+.switch-slider:before {
    transform: translateX(20px);
}

/* Textarea 樣式 */
.textarea-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.textarea-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.textarea {
    width: 100%;
    height: 100px;
    padding: 0.75rem;
    border: 1px solid #EBEBEB;
    border-radius: 4px;
    resize: none;
    font-family: inherit;
}

.textarea.focus {
    border-color: #FC8802;
    box-shadow: 0 0 0 2px rgba(252, 136, 2, 0.2);
}

.textarea::placeholder {
    color: #929AA3;
}

/* 狀態標籤 */
.status-label {
    width: 120px;
    color: #666;
    font-size: 0.875rem;
}
</style>

```

## src/views/guildline/DesignGuide6.vue
```
<!-- SelectSystem.vue -->
<template>
    <div class="container">
        <h1 class="section-title">04</h1>

        <!-- 基礎選擇器 -->
        <section class="section">
            <h2 class="section-heading">Select</h2>

            <!-- 一般狀態 -->
            <div class="select-row">
                <span class="select-label">Normal</span>
                <div class="select-wrapper">
                    <select class="select-input">
                        <option value="" disabled selected>下拉選</option>
                        <option value="1">西文描寫</option>
                        <option value="2">設計中的設計</option>
                        <option value="3">版式設計原理</option>
                    </select>
                    <span class="select-arrow"></span>
                </div>
            </div>

            <!-- 懸浮狀態 -->
            <div class="select-row">
                <span class="select-label">Hover</span>
                <div class="select-wrapper hover">
                    <select class="select-input">
                        <option value="" disabled selected>下拉選</option>
                        <option value="1">西文描寫</option>
                        <option value="2">設計中的設計</option>
                        <option value="3">版式設計原理</option>
                    </select>
                    <span class="select-arrow"></span>
                </div>
            </div>

            <!-- 選中狀態 -->
            <div class="select-row">
                <span class="select-label">Active</span>
                <div class="select-wrapper active">
                    <select class="select-input">
                        <option value="">下拉選</option>
                        <option value="1" selected>西文描寫</option>
                        <option value="2">設計中的設計</option>
                        <option value="3">版式設計原理</option>
                    </select>
                    <span class="select-arrow"></span>
                </div>
            </div>

            <!-- 禁用狀態 -->
            <div class="select-row">
                <span class="select-label">Disabled</span>
                <div class="select-wrapper disabled">
                    <select class="select-input" disabled>
                        <option value="">下拉選</option>
                    </select>
                    <span class="select-arrow"></span>
                </div>
            </div>
        </section>

        <!-- Radio and Clear -->
        <section class="section">
            <div class="select-row">
                <span class="select-label">Radio and Clear</span>
                <div class="select-wrapper">
                    <select class="select-input">
                        <option value="">可清除的選項</option>
                        <option value="1">西文描寫</option>
                        <option value="2">設計中的設計</option>
                    </select>
                    <span class="select-arrow"></span>
                </div>
            </div>
        </section>

        <!-- 多重選擇 -->
        <section class="section">
            <div class="select-row">
                <span class="select-label">Multiselect</span>
                <div class="multiselect-container">
                    <div class="select-wrapper">
                        <select class="select-input" multiple>
                            <option value="1">已選擇選項</option>
                            <option value="2">選項</option>
                            <option value="3">選項</option>
                        </select>
                        <span class="select-arrow"></span>
                    </div>
                    <div class="tag-container">
                        <div class="selected-tag">
                            已選擇選項
                            <span class="tag-remove">×</span>
                        </div>
                        <div class="selected-tag">
                            選項
                            <span class="tag-remove">×</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 月份選擇器 -->
        <section class="section">
            <div class="select-row">
                <span class="select-label">Month</span>
                <div class="month-picker">
                    <div class="month-header">
                        <button class="month-nav">&lt;</button>
                        <span class="year">2023</span>
                        <button class="month-nav">&gt;</button>
                    </div>
                    <div class="month-grid">
                        <button v-for="month in 12" :key="month" :class="['month-btn', { active: month === 5 }]">
                            {{ month }}月
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- 分組選單展示 -->
        <section class="section group-section">
            <h3 class="group-title">Group</h3>
            <div class="select-group">
                <div class="select-card">
                    <div class="card-content">
                        <div class="option-item active">設計中的設計</div>
                        <div class="option-item">版式設計原理</div>
                        <div class="option-item">色彩設計的原理</div>
                        <div class="option-item">一字一生</div>
                        <div class="option-item">寫給大家看的設計</div>
                        <div class="option-item">設計師的自我修養</div>
                    </div>
                </div>

                <!-- Active & Hover 狀態 -->
                <div class="select-card hover">
                    <div class="card-content">
                        <div class="option-item">現金</div>
                        <div class="option-item active">第三方支付</div>
                        <div class="option-item">信用卡</div>
                        <div class="option-item">APPLEPAY</div>
                        <div class="option-item">LINEPAY</div>
                        <div class="option-item">CARREFOUR</div>
                        <div class="option-item">GOOGLEPAY</div>
                        <div class="option-item">SAMSUNGPAY</div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
/* 基礎樣式 */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: "PingFang TC", "微軟正黑體", sans-serif;
}

.section-title {
    font-size: 2.5rem;
    color: #666;
    margin-bottom: 2rem;
}

.section {
    margin-bottom: 2rem;
}

/* 選擇器基礎樣式 */
.select-row {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
}

.select-label {
    width: 120px;
    color: #666;
    font-size: 0.875rem;
}

.select-wrapper {
    position: relative;
    width: 300px;
}

.select-input {
    width: 100%;
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    border: 1px solid #EBEBEB;
    border-radius: 4px;
    appearance: none;
    background: white;
    color: #485771;
    font-size: 0.875rem;
    cursor: pointer;
}

.select-arrow {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #485771;
    pointer-events: none;
}

/* 選擇器狀態樣式 */
.select-wrapper.hover .select-input {
    border-color: #FC8802;
}

.select-wrapper.active .select-input {
    border-color: #FC8802;
    box-shadow: 0 0 0 2px rgba(252, 136, 2, 0.2);
}

.select-wrapper.disabled .select-input {
    background: #F9F9F9;
    cursor: not-allowed;
}

/* 多重選擇樣式 */
.multiselect-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.tag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.selected-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    background: #F9F9F9;
    border-radius: 16px;
    font-size: 0.875rem;
    color: #485771;
}

.tag-remove {
    cursor: pointer;
    color: #929AA3;
}

/* 月份選擇器樣式 */
.month-picker {
    background: white;
    border: 1px solid #EBEBEB;
    border-radius: 4px;
    padding: 1rem;
    width: 300px;
}

.month-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.month-nav {
    border: none;
    background: none;
    color: #485771;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
}

.month-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
}

.month-btn {
    padding: 0.5rem;
    border: none;
    background: none;
    color: #485771;
    cursor: pointer;
    border-radius: 4px;
}

.month-btn.active {
    background: #FC8802;
    color: white;
}

/* 分組選單樣式 */
.group-section {
    margin-top: 2rem;
}

.group-title {
    font-size: 1rem;
    color: #333;
    margin-bottom: 1rem;
}

.select-group {
    display: flex;
    gap: 2rem;
}

.select-card {
    background: white;
    border: 1px solid #EBEBEB;
    border-radius: 4px;
    width: 200px;
    overflow: hidden;
}

.card-content {
    padding: 0.5rem 0;
}

.option-item {
    padding: 0.5rem 1rem;
    color: #485771;
    font-size: 0.875rem;
    cursor: pointer;
}

.option-item.active {
    color: #FC8802;
    background: #FFF5E8;
}

.select-card.hover .option-item:hover {
    background: #FFF5E8;
}
</style>

```


參考這種寫法
```
@use "sass:color";
@use "sass:map";

// === 主要色系 ===
$primary-color: #103c5d;
$second-color: #870D0E;
$accent-blue: #4A90E2;  // 新增
$accent-green: #50B794; // 新增
$accent-orange: #F5A623; // 新增
// === 文字色系 ===
$text-color: #333;
$white-color: #ffffff;  // 新增

// === 灰階色系 ===
$gray-500: #272828;
$gray-400: #5f5f5f;
$gray-300: #929292;
$gray-200: #D1D1D1;
$gray-100: #BFBFBF;

// === 白色系列 ===
$white: #ffffff;
$white-100: #F8F0E5;

// === 背景色系 ===
$bg-color: #F9F6F0;

// === 輔助色系 ===
$accent: (
  "blue": #4A90E2,
  "green": #50B794,
  "orange": #F5A623
);

// === 響應式斷點 ===
// 先定義 breakpoints map
$breakpoints: (
  "mobile": 768px,
  "tablet": 992px,
  "desktop": 1200px
);

// 再定義基於 breakpoints 的變數
$mobile-width: 768px;
$tablet-width: 992px;
$desktop-width: 1200px;
$container-width: 1200px;

// === 間距單位 ===
$spacing-unit: 1rem;

// === 輔助函數 ===
@function get-accent($color) {
  @return map.get($accent, $color);
}

@function get-breakpoint($point) {
  @return map.get($breakpoints, $point);
}

// === 顏色調整輔助混入 ===
@mixin color-variant($color, $lightness: 10%) {
    background: linear-gradient(45deg, $color, color.adjust($color, $lightness: $lightness));
  }

  // === 響應式設計混入 ===
  @mixin respond-to($breakpoint) {
      @if map.has-key($breakpoints, $breakpoint) {
          @media (max-width: map.get($breakpoints, $breakpoint)) {
              @content;
          }
      } @else {
          @warn "無效的斷點: #{$breakpoint}。可用的斷點是: #{map.keys($breakpoints)}";
      }
  }

```
