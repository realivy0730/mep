<!-- src/views/auth/Login.vue -->
<template>
    <div class="login-page">
        <!-- 登入頁面標頭 -->
        <header class="login-header">
            <div class="logo-container">
                <img src="@/assets/images/ddpay/logo.jpg" alt="麵匡匡 Logo" class="logo-image" />

            </div>
            <h1 class="brand-title">麵匡匡集團</h1>
            <p class="brand-description">立刻登入享麵點集和獨家優惠</p>
        </header>

        <!-- 登入選項 -->
        <section class="login-options">
            <!-- LINE 登入按鈕 -->
            <button class="login-button line-login" @click="handleLineLogin">
                <span class="line-icon"></span>
                <span class="button-text">LINE 登入</span>
            </button>

            <!-- 手機號碼登入按鈕 -->
            <button class="login-button phone-login" @click="redirectToPhoneLogin">
                <span class="button-text">手機號碼登入</span>
            </button>
        </section>

        <!-- 登入頁面說明文字 -->
        <footer class="login-footer">
            <p class="disclaimer-text">
                麵匡匡集團隸屬於全球集團旗下品牌，將會使用您的手機號碼、姓名、性別、生日等相關資料，將不會商業的資料供給給第三方。在本網站登入或註冊，代表你同意「麵匡匡集團」會員條款。
            </p>
        </footer>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// 使用路由導航
const router = useRouter();

// 處理 LINE 登入
const handleLineLogin = () => {
    // 這裡實作 LINE 登入邏輯
    console.log('開始 LINE 登入流程');
    // 假設 LINE 登入 URL
    const lineLoginUrl = 'https://access.line.me/oauth2/v2.1/authorize';

    // 這裡可以添加實際的 LINE 登入參數和重定向邏輯
    // window.location.href = lineLoginUrl + '?參數...';

    // 開發測試時先重定向到首頁
    router.push('/');
};

// 重定向到手機號碼登入頁面
const redirectToPhoneLogin = () => {
    console.log('重定向到手機號碼登入頁面');
    router.push('/auth/phone-login');
};

// 頁面載入時的操作
onMounted(() => {
    // 檢查是否已有登入憑證
    const hasToken = localStorage.getItem('auth_token');

    if (hasToken) {
        console.log('已經登入，重定向到首頁');
        router.push('/');
    }
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

.login-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    min-height: 100vh;
    padding: 48px 24px;
    background-color: var(--background-light);
}

/* 標頭區域樣式 */
.login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 48px;
    width: 100%;
    max-width: 320px;
}

.logo-container {
    width: 120px;
    height: 120px;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
    background-color: var(--white);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.logo-image {
    width: 80%;
    height: auto;
}

.brand-title {
    font-size: var(--font-size-h2);
    color: var(--heading);
    margin-bottom: 8px;
    text-align: center;
}

.brand-description {
    font-size: var(--font-size-body);
    color: var(--body-text);
    margin-bottom: 48px;
    text-align: center;
}

/* 登入選項區域樣式 */
.login-options {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    gap: 16px;
    margin-bottom: 40px;
}

.login-button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    border-radius: $border-radius;
    border: none;
    font-size: var(--font-size-body);
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.line-login {
    background-color: #06C755;
    color: var(--white);
    position: relative;
}

.line-icon {
    background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"%3E%3Cpath fill="%23FFFFFF" d="M19.311 15.75c2.168-2.203 3.289-5.136 3.289-8.25C22.6 3.375 17.525 0 11.3 0S0 3.375 0 7.5C0 11.625 5.075 15 11.3 15c.636 0 1.272-.025 1.9-.075 2.28 1.526 4.726 2.624 7.386 3.075-1.012-1.112-1.6-2.139-1.275-2.25z"/%3E%3C/svg%3E');
    background-size: contain;
    background-repeat: no-repeat;
    width: 24px;
    height: 24px;
    margin-right: 8px;
}

.phone-login {
    background-color: var(--primary);
    color: var(--white);
}

.button-text {
    font-weight: 500;
}

/* 登入按鈕懸停效果 */
.line-login:hover {
    background-color: #05a848;
}

.phone-login:hover {
    background-color: var(--primary-hover);
}

/* 頁尾說明文字樣式 */
.login-footer {
    width: 100%;
    max-width: 320px;
}

.disclaimer-text {
    font-size: var(--font-size-note);
    color: var(--note);
    text-align: center;
    line-height: 1.5;
}

/* 響應式設計 */
@media (max-height: 600px) {
    .login-page {
        padding: 24px;
    }

    .login-header {
        margin-top: 24px;
    }

    .logo-container {
        width: 100px;
        height: 100px;
    }

    .brand-description {
        margin-bottom: 32px;
    }
}

@media (min-width: 768px) {
    .login-options {
        max-width: 400px;
    }

    .login-footer {
        max-width: 480px;
    }
}
</style>
