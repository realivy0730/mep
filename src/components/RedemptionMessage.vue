// src/components/RedemptionMessage.vue
<template>
    <div v-if="visible" class="message-overlay" @click.self="closeMessage">
        <div class="message-container">
            <!-- 成功或錯誤圖示 -->
            <div class="message-icon" :class="{ 'success': isSuccess, 'error': !isSuccess }">
                <span v-if="isSuccess" class="check-icon">✓</span>
                <span v-else class="close-icon">×</span>
            </div>

            <!-- 訊息文字 -->
            <div class="message-text">{{ message }}</div>

            <!-- 確認按鈕 -->
            <button class="confirm-button" @click="closeMessage">
                {{ confirmText }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 元件屬性定義
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    isSuccess: {
        type: Boolean,
        default: true
    },
    message: {
        type: String,
        default: ""
    },
    confirmText: {
        type: String,
        default: "我知道了"
    }
});

// 定義事件
const emit = defineEmits(['close']);

// 關閉訊息視窗
const closeMessage = () => {
    emit('close');
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

.message-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
}

.message-container {
    background-color: var(--white);
    border-radius: 8px;
    width: 90%;
    max-width: 320px;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.message-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    font-size: 30px;

    &.success {
        background-color: #f0f9f0;
        border: 2px solid #4caf50;
        color: #4caf50;
    }

    &.error {
        background-color: #fff0f0;
        border: 2px solid #e53935;
        color: #e53935;
    }
}

.check-icon,
.close-icon {
    font-weight: bold;
}

.message-text {
    text-align: center;
    margin-bottom: 24px;
    color: var(--body-text);
    font-size: var(--font-size-body);
}

.confirm-button {
    width: 100%;
    padding: 12px;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    font-size: var(--font-size-body);
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: var(--primary-hover);
    }
}
</style>
