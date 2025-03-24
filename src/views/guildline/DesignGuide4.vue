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
