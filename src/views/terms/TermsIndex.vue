<template>
    <div class="page-container">
        <!-- 固定標頭 -->
        <header class="header">
            <div class="header-content">
                <button class="back-button" @click="goBack">
                    <span class="material-icons">arrow_back_ios</span>
                </button>
                <h1 class="header-title">條款與政策</h1>
                <div class="header-right"></div>
            </div>
        </header>

        <main class="main-content">
            <div class="terms-list-container">
                <div class="terms-list">
                    <router-link to="/terms/member" class="terms-item">
                        <div class="terms-item-content">
                            <div class="terms-item-title">會員條款</div>
                            <div class="terms-item-description">使用我們服務的權利與義務</div>
                        </div>
                        <span class="material-icons">chevron_right</span>
                    </router-link>

                    <router-link to="/terms/privacy" class="terms-item">
                        <div class="terms-item-content">
                            <div class="terms-item-title">隱私權政策</div>
                            <div class="terms-item-description">我們如何收集、使用和保護您的資料</div>
                        </div>
                        <span class="material-icons">chevron_right</span>
                    </router-link>

                    <router-link to="/terms/payment" class="terms-item">
                        <div class="terms-item-content">
                            <div class="terms-item-title">支付條款</div>
                            <div class="terms-item-description">付款、退款和帳單相關規定</div>
                        </div>
                        <span class="material-icons">chevron_right</span>
                    </router-link>

                    <router-link to="/terms/delivery" class="terms-item">
                        <div class="terms-item-content">
                            <div class="terms-item-title">配送政策</div>
                            <div class="terms-item-description">商品配送、取貨和退換貨規定</div>
                        </div>
                        <span class="material-icons">chevron_right</span>
                    </router-link>
                </div>

                <div class="terms-version">
                    <p>版本：1.0.0</p>
                    <p>最後更新：2025年3月1日</p>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

/**
 * 返回上一頁
 */
const goBack = () => {
    router.back();
};
</script>

<style scoped>
.page-container {
    padding-top: 56px;
    min-height: 100vh;
    background-color: var(--background-light);
}

.terms-list-container {
    padding: var(--spacing-md);
}

.terms-list {
    background-color: var(--white);
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
}

.terms-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border-light);
    text-decoration: none;
    color: var(--text-primary);
}

.terms-item:last-child {
    border-bottom: none;
}

.terms-item-content {
    flex: 1;
}

.terms-item-title {
    font-size: var(--font-size-md);
    font-weight: 500;
    margin-bottom: 4px;
}

.terms-item-description {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
}

.terms-item .material-icons {
    color: var(--text-tertiary);
    font-size: 20px;
}

.terms-version {
    margin-top: var(--spacing-lg);
    text-align: center;
    font-size: var(--font-size-xs);
    color: var(--text-tertiary);
}

.terms-version p {
    margin: 4px 0;
}
</style>
