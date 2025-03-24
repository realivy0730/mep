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
