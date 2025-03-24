<template>
    <div class="level-badge" :class="levelClass" @click="navigateToLevel">
        <div class="badge-icon">
            <i class="fa-solid" :class="levelIcon"></i>
        </div>
        <div class="badge-info">
            <div class="badge-name">{{ levelName }}</div>
            <div class="badge-expiry" v-if="expiryDate">有效期至: {{ expiryDate }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 定義組件的屬性
const props = defineProps({
    level: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: String,
        default: ''
    },
    clickable: {
        type: Boolean,
        default: true
    }
});

// 根據等級計算樣式類別
const levelClass = computed(() => {
    return {
        'level-1': props.level === 1,
        'level-2': props.level === 2,
        'level-3': props.level === 3,
        'level-4': props.level === 4,
        'clickable': props.clickable
    };
});

// 根據等級計算圖標
const levelIcon = computed(() => {
    switch (props.level) {
        case 1:
            return 'fa-user';
        case 2:
            return 'fa-award';
        case 3:
            return 'fa-gem';
        case 4:
            return 'fa-crown';
        default:
            return 'fa-user';
    }
});

// 根據等級計算名稱
const levelName = computed(() => {
    switch (props.level) {
        case 1:
            return '一般會員';
        case 2:
            return '白金會員';
        case 3:
            return '鑽石會員';
        case 4:
            return 'VIP 會員';
        default:
            return '一般會員';
    }
});

// 導航到等級詳情頁面
const navigateToLevel = () => {
    if (props.clickable) {
        router.push(`/levels/${props.level}`);
    }
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

.level-badge {
    display: flex;
    align-items: center;
    padding: $spacing-sm;
    border-radius: 8px;
    background-color: var(--background-light);
    
    &.clickable {
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
    }
}

.badge-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: $spacing-sm;
    
    i {
        font-size: 18px;
    }
}

.badge-info {
    flex: 1;
}

.badge-name {
    font-size: 14px;
    font-weight: 500;
}

.badge-expiry {
    font-size: 12px;
    opacity: 0.7;
    margin-top: 2px;
}

/* 等級樣式 */
.level-1 {
    .badge-icon {
        background-color: #e0e0e0;
        color: #757575;
    }
    
    .badge-name {
        color: #757575;
    }
}

.level-2 {
    .badge-icon {
        background-color: #b0bec5;
        color: #546e7a;
    }
    
    .badge-name {
        color: #546e7a;
    }
}

.level-3 {
    .badge-icon {
        background-color: #90caf9;
        color: #1976d2;
    }
    
    .badge-name {
        color: #1976d2;
    }
}

.level-4 {
    .badge-icon {
        background-color: #ffcc80;
        color: #ef6c00;
    }
    
    .badge-name {
        color: #ef6c00;
    }
}
</style>