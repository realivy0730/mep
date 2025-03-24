<!-- src/views/auth/VerificationCode.vue -->
<template>
    <div class="verification-page">
        <!-- 固定標頭 -->
        <header class="header">
            <div class="header-content">
                <button class="back-button" @click="$router.go(-1)">
                    <span class="material-icons">arrow_back</span>
                </button>
                <h1 class="page-title">輸入驗證碼</h1>
                <div class="header-right"></div>
            </div>
        </header>
        <main class="main-content">
            <div class="content-container">
                <div class="verification-info">
                    <p class="message">我們已透過簡訊將驗證碼發送至</p>
                    <p class="phone-number">{{ formatPhoneNumber(phoneNumber) }}</p>
                </div>

                <!-- 單一輸入格子設計 -->
                <div class="verification-code-container">
                    <input type="text" class="code-input" v-model="verificationCode" maxlength="6" inputmode="numeric"
                        pattern="[0-9]*" autocomplete="one-time-code" placeholder="請輸入驗證碼" @input="handleInput"
                        @paste="handlePaste" ref="codeInput" />
                </div>

                <p class="timer-text" v-if="countdown > 0">
                    驗證碼將過期，等待 {{ countdown }}秒 再按「重新傳送驗證碼」
                </p>
                <p class="timer-text" v-else>
                    <button class="resend-button" @click="resendCode">重新傳送驗證碼</button>
                </p>
            </div>


            <div class="action-button-container">
                <button class="continue-button" :class="{ 'active': isCodeComplete }" :disabled="!isCodeComplete"
                    @click="verifyCode">
                    繼續
                </button>
            </div>

        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';

// 定義 props 和事件
const props = defineProps({
    phoneNumber: {
        type: String,
        default: '0955848333'
    },
    codeLength: {
        type: Number,
        default: 4
    },
    expiryTime: {
        type: Number,
        default: 30 // 驗證碼有效期（秒）
    }
});

const emit = defineEmits(['verified', 'resend']);

// 路由
const router = useRouter();

// 狀態變數
const verificationCode = ref('');
const codeInput = ref(null);
const countdown = ref(props.expiryTime);
let countdownTimer = null;

// 監聽驗證碼輸入變化
watch(() => verificationCode.value, (newCode) => {
    // 只保留數字
    verificationCode.value = newCode.replace(/\D/g, '');

    // 如果達到指定長度，自動驗證
    if (verificationCode.value.length === props.codeLength) {
        verifyCode();
    }
});

// 計算是否已完成驗證碼輸入
const isCodeComplete = computed(() => {
    return verificationCode.value.length === props.codeLength;
});

// 格式化電話號碼顯示
const formatPhoneNumber = (phone) => {
    if (!phone) return '';

    // 基本格式化，可以根據需求調整
    if (phone.length === 10) {
        return phone;
    }
    return phone;
};

// 處理輸入事件
const handleInput = (event) => {
    // 這裡可以加入其他輸入處理邏輯，但大部分已在 watch 中處理
};

// 處理貼上事件，支援從簡訊中自動擷取驗證碼
const handlePaste = (event) => {
    // 允許正常貼上，但通過 watch 來處理過濾
    setTimeout(() => {
        if (verificationCode.value.length > props.codeLength) {
            verificationCode.value = verificationCode.value.substring(0, props.codeLength);
        }
    }, 0);
};

// 自動從簡訊應用中識別並填充驗證碼
const setupSMSListener = () => {
    if ('OTPCredential' in window) {
        const ac = new AbortController();
        navigator.credentials.get({
            otp: { transport: ['sms'] },
            signal: ac.signal
        }).then(otp => {
            // 填充驗證碼
            verificationCode.value = otp.code.substring(0, props.codeLength);
        }).catch(err => {
            console.log('無法自動獲取驗證碼', err);
        });

        // 60秒後中止嘗試
        setTimeout(() => {
            ac.abort();
        }, 60000);
    }
};

// 提交驗證碼
const verifyCode = () => {
    if (!isCodeComplete.value) return;

    const code = verificationCode.value;
    console.log('驗證碼:', code);

    // 向後端發送驗證請求
    // 這裡模擬驗證成功，實際應用中需要串接API
    emit('verified', code);
};

// 重新發送驗證碼
const resendCode = () => {
    // 重置輸入
    verificationCode.value = '';

    // 重新開始倒計時
    countdown.value = props.expiryTime;
    startCountdown();

    // 重新聚焦輸入框
    codeInput.value.focus();

    // 通知父組件重新發送
    emit('resend');
};

// 啟動倒計時
const startCountdown = () => {
    // 先清除可能存在的計時器
    if (countdownTimer) clearInterval(countdownTimer);

    countdownTimer = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--;
        } else {
            clearInterval(countdownTimer);
        }
    }, 1000);
};

// 組件掛載時
onMounted(() => {
    // 聚焦輸入框
    codeInput.value.focus();

    // 啟動倒計時
    startCountdown();

    // 設置自動填充
    setupSMSListener();
});

// 組件卸載前清理
onBeforeUnmount(() => {
    if (countdownTimer) clearInterval(countdownTimer);
});
</script>

<style scoped lang="scss">
.verification-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--white);
}


.content-container {
    flex: 1;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.verification-info {
    text-align: center;
    margin-bottom: 32px;
}

.message {
    color: var(--body-text);
    font-size: var(--font-size-body);
    margin-bottom: 8px;
}

.phone-number {
    color: var(--primary);
    font-size: var(--font-size-h3);
    font-weight: 600;
    margin: 0;
}

.verification-code-container {
    margin-bottom: 24px;
    width: 100%;
    max-width: 320px;
}

.code-input {
    width: 100%;
    height: 70px;
    border: 1px solid var(--border-disabled);
    border-radius: 8px;
    background-color: var(--white);
    padding: 0 16px;
    font-size: 24px;
    font-weight: 500;
    color: var(--heading);
    text-align: center;
    letter-spacing: 5px;

    &:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 2px rgba(252, 136, 2, 0.2);
    }

    &::placeholder {
        color: var(--placeholder);
        font-size: 18px;
        letter-spacing: normal;
    }
}

.timer-text {
    font-size: var(--font-size-note);
    color: var(--note);
    margin-top: 16px;
    text-align: center;
}

.resend-button {
    background: none;
    border: none;
    color: var(--primary);
    font-size: var(--font-size-note);
    font-weight: 500;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;

    &:hover {
        color: var(--primary-hover);
    }
}

.action-container {
    padding: 16px;
    border-top: 1px solid var(--border-disabled);
}

.continue-button {
    width: 100%;
    height: 50px;
    border-radius: 25px;
    border: none;
    background-color: var(--border-disabled);
    color: var(--placeholder);
    font-size: var(--font-size-body);
    font-weight: 500;
    margin-bottom: env(safe-area-inset-bottom, 0);
    cursor: not-allowed;

    &.active {
        background-color: var(--primary);
        color: var(--white);
        cursor: pointer;
    }
}

@media screen and (max-width: 375px) {
    .code-input {
        height: 60px;
    }
}

@supports (padding-bottom: env(safe-area-inset-bottom)) {
    .action-container {
        padding-bottom: calc(16px + env(safe-area-inset-bottom));
    }
}
</style>
