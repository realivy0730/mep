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
