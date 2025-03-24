<!-- src/views/auth/PhoneLogin.vue -->
<template>
    <div class="page-container">

        <!-- 固定標頭 -->
        <header class="header">
            <div class="header-content">
                <button class="back-button" @click="$router.go(-1)">
                    <span class="material-icons">arrow_back</span>
                </button>
                <h1 class="page-title">輸入您的電話號碼</h1>
                <div class="header-right"></div>
            </div>
        </header>

        <!-- 主要內容 -->
        <main class="main-content">
            <div class="box">
                <p class="login-description">輸入電話號碼並點選繼續登入</p>

                <form class="login-form" @submit.prevent="handleSubmit">
                    <!-- 手機號碼輸入區塊 -->
                    <div class="input-group" :class="{ 'has-error': phoneError }">
                        <div class="phone-input-wrapper">
                            <div class="country-code-container">
                                <span class="country-code">+886</span>
                                <span class="dropdown-icon">▼</span>
                            </div>
                            <input id="phone" v-model="phone" type="tel" inputmode="numeric" class="phone-input"
                                placeholder="請輸入手機號碼" @input="validatePhone" @blur="validatePhone" ref="phoneInput" />
                            <button type="button" class="clear-btn" v-if="phone.length > 0 && !phoneError"
                                @click="clearPhone">
                                <span class="clear-icon">×</span>
                            </button>
                            <div class="error-icon" v-if="phoneError">
                                <span class="error-circle">!</span>
                            </div>
                        </div>
                        <p class="error-message" v-if="phoneError">{{ phoneError }}</p>

                    </div>

                    <!-- 使用條款說明 -->
                    <div class="terms-section">
                        <label class="terms-checkbox">
                            <input type="checkbox" v-model="agreeTerms">
                            <span class="checkbox-text">我已詳細閱讀並同意遵守</span>
                        </label>
                        <router-link to="/terms/privacy" class="terms-link">隱私權政策</router-link>
                        <br>
                        <label class="terms-checkbox">
                            <input type="checkbox" v-model="agreeConditions">
                            <span class="checkbox-text">我已詳細閱讀並同意遵守</span>
                        </label>
                        <router-link to="/terms/member" class="terms-link">會員服務條款</router-link>
                    </div>

                    <!-- 登入按鈕 -->

                    <div class="action-button-container">
                        <button type="submit" class="login-btn"
                            :class="{ 'login-btn-disabled': !isFormValid, 'login-btn-enabled': isFormValid }"
                            :disabled="!isFormValid || isLoading">
                            <span class="loading-spinner" v-if="isLoading"></span>
                            <span v-else>登入</span>
                        </button>
                    </div>

                </form>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// 使用路由導航
const router = useRouter();
const route = useRoute();

// 表單狀態和輸入值
const phone = ref('');
const phoneError = ref('');
const isLoading = ref(false);
const phoneInput = ref(null);
const agreeTerms = ref(false);
const agreeConditions = ref(false);

// 表單驗證計算屬性
const isPhoneValid = computed(() => {
    return phone.value.length >= 9 && !phoneError.value;
});

const isFormValid = computed(() => {
    return isPhoneValid.value && agreeTerms.value && agreeConditions.value;
});

// 手機號碼格式驗證
const validatePhone = () => {
    // 只保留數字
    phone.value = phone.value.replace(/\D/g, '');

    // 如果第一位是0，移除
    if (phone.value.startsWith('0')) {
        phone.value = phone.value.substring(1);
    }

    if (phone.value.length === 0) {
        phoneError.value = '';
    } else if (phone.value.length < 9) {
        phoneError.value = '請輸入有效的手機號碼';
    } else {
        phoneError.value = '';
    }
};

// 清除手機號碼
const clearPhone = () => {
    phone.value = '';
    phoneError.value = '';
    phoneInput.value.focus();
};

// 提交表單
const handleSubmit = async () => {
    if (!isFormValid.value || isLoading.value) return;

    isLoading.value = true;

    try {
        // 這裡將直接發送手機號碼進行驗證
        console.log(`提交登入請求，手機號碼：+886${phone.value}`);

        // 模擬API請求延遲
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 模擬登入成功，儲存令牌並導航到首頁
        localStorage.setItem('auth_token', 'sample_token_' + Date.now());
        localStorage.setItem('user_phone', phone.value);

        // 導航到首頁或驗證碼頁面
        router.push('/verification');
    } catch (error) {
        console.error('登入請求失敗', error);
        phoneError.value = '無法處理您的請求，請稍後再試';
    } finally {
        isLoading.value = false;
    }
};

// 頁面載入時，讓手機號碼輸入框獲得焦點
onMounted(() => {
    if (phoneInput.value) {
        phoneInput.value.focus();
    }
});

// 檢查用戶是否剛剛同意了條款或隱私權政策
watch(() => route.fullPath, () => {
    // 檢查是否剛剛同意了會員條款
    if (localStorage.getItem('justAgreedMemberTerms') === 'true') {
        agreeConditions.value = true;
        localStorage.removeItem('justAgreedMemberTerms');
    }
    
    // 檢查是否剛剛同意了隱私權政策
    if (localStorage.getItem('justAgreedPrivacyPolicy') === 'true') {
        agreeTerms.value = true;
        localStorage.removeItem('justAgreedPrivacyPolicy');
    }
    
    // 檢查本地存儲中的同意狀態，確保之前勾選的複選框不會消失
    if (localStorage.getItem('memberTermsAgreed') === 'true') {
        agreeConditions.value = true;
    }
    
    if (localStorage.getItem('privacyPolicyAgreed') === 'true') {
        agreeTerms.value = true;
    }
}, { immediate: true });
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

.login-description {
    padding: 16px;
    font-size: var(--font-size-body);
    color: var(--body-text);
    margin: 0;
    background-color: var(--background-light);
}

/* 表單樣式 */
.login-form {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.input-group {
    margin-bottom: 16px;
    padding: 0 16px;
}

.phone-input-wrapper {
    display: flex;
    align-items: center;
    border: 1px solid var(--border-disabled);
    border-radius: 4px;
    overflow: hidden;
    background-color: var(--white);
    position: relative;
}

.input-group.has-error .phone-input-wrapper {
    border-color: var(--down);
}

.country-code-container {
    display: flex;
    align-items: center;
    padding: 0 8px;
    background-color: var(--white);
    height: 48px;
    border-right: 1px solid var(--border-disabled);
}

.country-code {
    font-size: var(--font-size-body);
    color: var(--body-text);
}

.dropdown-icon {
    font-size: 10px;
    color: var(--placeholder);
    margin-left: 4px;
}

.phone-input {
    flex: 1;
    height: 48px;
    border: none;
    padding: 0 40px 0 12px;
    font-size: var(--font-size-body);
    color: var(--heading);
}

.clear-btn {
    position: absolute;
    right: 8px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
}

.clear-icon {
    font-size: 20px;
    color: var(--placeholder);
}

.error-icon {
    position: absolute;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.error-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: var(--down);
    color: white;
    font-size: 14px;
    font-weight: bold;
}

.error-message {
    font-size: var(--font-size-note);
    color: var(--down);
    margin-top: 4px;
}

.info-message {
    font-size: var(--font-size-note);
    color: var(--note);
    margin-top: 4px;
}

/* 條款勾選區域 */
.terms-section {
    padding: 0 16px;
    margin-top: auto;
    margin-bottom: 24px;
}

.terms-checkbox {

    margin-bottom: 8px;
    cursor: pointer;
}

.terms-checkbox input[type="checkbox"] {
    margin-right: 8px;
    margin-top: 3px;
}

.checkbox-text {
    font-size: var(--font-size-note);
    color: var(--body-text);
}

.terms-link {
    color: #FF9900;
    text-decoration: none;
    font-size: var(--font-size-note);
}

/* 登入按鈕 */
.login-btn {
    margin: 0;
    padding: 15px 0;
    width: 100%;
    border: none;
    font-size: var(--font-size-body);
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
}

.login-btn-enabled {
    background-color: #FF9900;
    color: var(--white);
}

.login-btn-disabled {
    background-color: #c4c4c4;
    color: var(--white);
    cursor: not-allowed;
}
</style>
