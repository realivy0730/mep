<!-- src/views/auth/VerificationView.vue -->
<template>
    <div class="verification-view">
        <verification-code :phone-number="phoneNumber" @verified="handleVerification" @resend="handleResend" />
    </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import VerificationCode from '@/views/auth/VerificationCode.vue';
import { VerificationManager } from '@/utils/verificationManager';

// 取得路由
const router = useRouter();

// 狀態變數
const phoneNumber = ref('0955848333'); // 預設電話號碼，實際應用中可以通過路由參數傳遞

/**
 * 處理驗證成功事件
 * @param {string} code - 用戶輸入的驗證碼
 */
const handleVerification = async (code) => {
    console.log('收到驗證碼:', code);

    // 使用驗證管理器驗證代碼
    const result = await VerificationManager.verifyCode(code, phoneNumber.value);

    if (result.success) {
        // 驗證成功，可以導航到下一頁
        console.log('驗證成功, token:', result.token);

        // 儲存驗證狀態或 token
        localStorage.setItem('auth_token', result.token);

        // 導航至首頁或指定頁面
        router.push('/');
    } else {
        // 處理驗證失敗
        alert(result.message);
    }
};

/**
 * 處理重新發送驗證碼事件
 */
const handleResend = async () => {
    // 使用驗證管理器重新請求驗證碼
    const result = await VerificationManager.requestCode(phoneNumber.value);

    if (result.success) {
        console.log('已重新發送驗證碼');
    } else {
        alert(result.message);
    }
};
</script>

<style scoped lang="scss">
.verification-view {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--white);
}
</style>
