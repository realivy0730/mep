<!-- src/App.vue -->
<template>
    <div id="app" :data-theme="currentTheme">
        <RouterView />

        <!-- 成功驗證後的訊息 -->
        <div v-if="showSuccessMessage" class="success-modal">
            <div class="success-content">
                <span class="success-icon">✅</span>
                <h2>驗證成功</h2>
                <p>您已成功完成手機驗證</p>
                <button @click="closeMessage" class="success-button">確定</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { ref, watch, onMounted } from 'vue';
import { VerificationManager } from './utils/verificationManager';

// 主題設定
const currentTheme = ref(import.meta.env.VITE_THEME || 'default');
console.log('VITE_THEME in App.vue:', import.meta.env.VITE_THEME);

// 驗證狀態變數
const showSuccessMessage = ref(false);

// 監聽主題變更
watch(() => currentTheme.value, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
});

// 元件掛載時設置主題
onMounted(() => {
    document.documentElement.setAttribute('data-theme', currentTheme.value);
    console.log('data-theme set to:', document.documentElement.getAttribute('data-theme'));
});

/**
 * 處理驗證成功事件 (可以被子元件呼叫)
 * @param {string} code - 用戶輸入的驗證碼
 * @param {string} phoneNumber - 手機號碼
 */
const handleVerification = async (code, phoneNumber) => {
    console.log('收到驗證碼:', code);

    // 使用驗證管理器驗證代碼
    const result = await VerificationManager.verifyCode(code, phoneNumber);

    if (result.success) {
        showSuccessMessage.value = true;

        // 實際應用中可能需要導航到其他頁面或執行其他操作
        console.log('驗證成功, token:', result.token);
        return true;
    } else {
        // 處理驗證失敗
        console.error('驗證失敗:', result.message);
        return false;
    }
};

/**
 * 關閉成功訊息
 */
const closeMessage = () => {
    showSuccessMessage.value = false;
};

// 提供方法給其他元件使用
defineExpose({
    handleVerification
});
</script>

<style lang="scss">
@use './assets/styles/main.scss';

#app {
    font-family: var(--font-family);
    background-color: var(--background-light);
    transition: all 0.3s ease;
    position: relative;
    min-height: 100vh;
}

.success-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.success-content {
    background-color: var(--white);
    border-radius: 12px;
    padding: 24px;
    width: 80%;
    max-width: 320px;
    text-align: center;
}

.success-icon {
    font-size: 48px;
    margin-bottom: 16px;
    display: block;
}

.success-button {
    background-color: var(--primary);
    color: var(--white);
    border: none;
    border-radius: var(--border-radius);
    padding: 12px 24px;
    font-size: var(--font-size-body);
    font-weight: 500;
    margin-top: 16px;
    cursor: pointer;

    &:hover {
        background-color: var(--primary-hover);
    }
}
</style>
