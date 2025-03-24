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
