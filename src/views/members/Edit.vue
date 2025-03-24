<!-- src/views/members/Edit.vue -->
<template>
    <div class="page-container">
        <!-- 固定標頭 -->
        <header class="header">
            <div class="header-content">
                <button @click="goBack" class="back-button">
                    <span class="material-icons">arrow_back</span>
                </button>
                <h1 class="page-title">編輯個人資料</h1>
                <div class="header-right"></div>
            </div>
        </header>

        <!-- 主要內容區域 -->
        <main class="main-content">
            <!-- 載入中狀態 -->
            <div v-if="loading" class="loading-state">
                <div class="loading-spinner"></div>
                <p>載入中...</p>
            </div>

            <!-- 錯誤狀態 -->
            <div v-else-if="error" class="error-state">
                <p>{{ error.message || '無法載入會員資料，請稍後再試' }}</p>
                <button @click="fetchMemberData" class="retry-button">重試</button>
            </div>

            <!-- 編輯表單 -->
            <form v-else @submit.prevent="submitForm" class="edit-form">
                <!-- 姓名 -->
                <div class="form-group">
                    <label for="name" class="required-field">姓名</label>
                    <input type="text" id="name" v-model="formData.name" class="form-control" required />
                    <div class="form-hint">姓名僅允許中英文，不可使用特殊符號</div>
                    <div v-if="errors.name" class="form-error">{{ errors.name }}</div>
                </div>

                <!-- 性別 -->
                <div class="form-group">
                    <label for="gender" class="required-field">性別</label>
                    <div class="custom-select">
                        <select id="gender" v-model="formData.gender" class="form-control" required>
                            <option value="1">男性</option>
                            <option value="2">女性</option>
                            <option value="3">其他</option>
                        </select>
                        <span class="select-arrow material-icons">expand_more</span>
                    </div>
                </div>

                <!-- 生日 -->
                <div class="form-group">
                    <label for="birthday" class="required-field">生日</label>
                    <input type="date" id="birthday" v-model="formData.birthday" class="form-control" required />
                </div>

                <!-- 電子郵件 -->
                <div class="form-group">
                    <label for="email">電子郵件</label>
                    <input type="email" id="email" v-model="formData.email" class="form-control" />
                    <div v-if="errors.email" class="form-error">{{ errors.email }}</div>
                </div>

                <!-- 地址 - 國家 -->
                <div class="form-group">
                    <label for="country">地址</label>
                    <div class="custom-select">
                        <select id="country" v-model="formData.country" class="form-control" @change="resetDistrict">
                            <option value="台灣">台灣</option>
                            <option value="其他">其他</option>
                        </select>
                        <span class="select-arrow material-icons">expand_more</span>
                    </div>
                </div>

                <!-- 地址 - 縣市 -->
                <div class="form-group">
                    <div class="custom-select">
                        <select id="county" v-model="formData.county" class="form-control" @change="resetDistrict">
                            <option value="">選擇縣市</option>
                            <option v-for="county in counties" :key="county" :value="county">
                                {{ county }}
                            </option>
                        </select>
                        <span class="select-arrow material-icons">expand_more</span>
                    </div>
                </div>

                <!-- 地址 - 鄉鎮市區 -->
                <div class="form-group">
                    <div class="custom-select">
                        <select id="district" v-model="formData.district" class="form-control">
                            <option value="">選擇鄉鎮市區</option>
                            <option v-for="district in districts" :key="district" :value="district">
                                {{ district }}
                            </option>
                        </select>
                        <span class="select-arrow material-icons">expand_more</span>
                    </div>
                </div>

                <!-- 地址 - 街道地址 -->
                <div class="form-group">
                    <input type="text" id="address" v-model="formData.address" class="form-control"
                        placeholder="街道門牌號碼" />
                </div>

                <!-- 提交按鈕 -->
                <button type="submit" class="submit-button" :disabled="submitting">
                    儲存
                </button>
            </form>
        </main>

        <!-- 頁尾導覽列 -->
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Footer from '@/components/Footer.vue';
import { DataService } from '@/services/dataService';
import { handleError } from '@/utils/errorHandler';
import { taiwanAddressData } from '@/data/taiwanAddress';

// 路由
const router = useRouter();

// 資料狀態
const loading = ref(true);
const error = ref<Error | null>(null);
const submitting = ref(false);

// 表單資料
const formData = reactive({
    name: '',
    gender: '',
    birthday: '',
    email: '',
    country: '台灣',
    county: '',
    district: '',
    address: ''
});

// 表單錯誤
const errors = reactive({
    name: '',
    email: ''
});

// 台灣縣市資料
const counties = computed(() => {
    return Object.keys(taiwanAddressData);
});

// 鄉鎮市區資料
const districts = computed(() => {
    if (!formData.county) return [];
    return taiwanAddressData[formData.county] || [];
});

/**
 * 重置鄉鎮市區
 * 當縣市變更時重置鄉鎮市區選擇
 */
const resetDistrict = () => {
    formData.district = '';
};

/**
 * 表單驗證
 * @returns 是否驗證通過
 */
const validateForm = () => {
    let isValid = true;
    errors.name = '';
    errors.email = '';

    // 驗證姓名（僅允許中英文）
    const namePattern = /^[a-zA-Z\u4e00-\u9fa5]+$/;
    if (!namePattern.test(formData.name)) {
        errors.name = '姓名僅允許中英文，不可使用特殊符號';
        isValid = false;
    }

    // 驗證電子郵件（如果有輸入）
    if (formData.email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(formData.email)) {
            errors.email = '請輸入有效的電子郵件地址';
            isValid = false;
        }
    }

    return isValid;
};

/**
 * 提交表單
 * 驗證並發送更新請求
 */
const submitForm = async () => {
    if (!validateForm()) {
        return;
    }

    try {
        submitting.value = true;

        // 準備要提交的數據
        const updateData = {
            profile: {
                full_name: formData.name,
                gender: parseInt(formData.gender),
                birthday: formData.birthday,
                email: formData.email,
                country: formData.country,
                county: formData.county,
                district: formData.district,
                address: formData.address
            }
        };

        // 發送更新請求，這裡需要修改為實際的 API 調用
        console.log('提交資料:', updateData);

        // 模擬 API 請求延遲
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 將更新的資料保存到本地存儲，以便在 View 頁面使用
        localStorage.setItem('memberProfileData', JSON.stringify(updateData));

        // 強制清除 DataService 的快取，確保下次獲取資料時會使用最新的資料
        DataService.clearCache('profile_data_cache');

        // 顯示成功訊息
        alert('資料已成功更新！');

        // 更新成功後導航回檢視頁面
        router.push('/members/profile');
    } catch (err) {
        error.value = err instanceof Error ? err : new Error('更新會員資料時發生未知錯誤');
        handleError(error.value, '更新會員資料');
    } finally {
        submitting.value = false;
    }
};

/**
 * 返回上一頁
 */
const goBack = () => {
    router.back();
};

/**
 * 獲取會員資料
 * 使用優化過的加載策略，減少等待時間
 */
const fetchMemberData = async () => {
    try {
        loading.value = true;
        error.value = null;

        // 使用一次性超時設定的 Promise
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('請求超時')), 5000)
        );

        // 嘗試直接通過代理獲取資料
        try {
            // 使用 Promise.race 確保請求不會長時間等待
            const response = await Promise.race([
                fetch('/api/data/boday_test/profile.json'),
                timeoutPromise
            ]);

            if (!response.ok) throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);

            const profileData = await response.json();
            populateFormData(profileData);
            return;
        } catch (directError) {
            console.warn('直接獲取資料失敗，嘗試使用 DataService:', directError);

            // 嘗試使用 DataService
            const profileData = await DataService.getProfileData();
            if (profileData) {
                populateFormData(profileData);
                return;
            }

            // 如果 DataService 也失敗，拋出錯誤
            throw new Error('無法從伺服器獲取會員資料');
        }
    } catch (err) {
        error.value = err instanceof Error ? err : new Error('獲取會員資料時發生未知錯誤');
        handleError(error.value, '獲取會員資料');
    } finally {
        loading.value = false;
    }
};

/**
 * 填充表單資料
 * @param profileData - API 回傳的個人資料
 */
const populateFormData = (profileData) => {
    // 檢查是否有 profile 物件
    const profile = profileData.profile || profileData;

    // 填充表單資料
    formData.name = profile.full_name || profile.name || '';
    formData.gender = profile.gender ? profile.gender.toString() : '2';
    formData.birthday = profile.birthday || profile.birthDate || profile.birth_date || '';
    formData.email = profile.email || '';
    formData.country = profile.country || '台灣';
    formData.county = profile.county || '';
    formData.district = profile.district || '';
    formData.address = profile.address || '';

    console.log('會員資料載入成功:', formData);
};

// 元件掛載時獲取資料
onMounted(() => {
    fetchMemberData();
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

/* 表單樣式 */
.edit-form {
    background-color: var(--white);
    padding: 16px;
    border-radius: 8px;
}

.form-group {
    margin-bottom: 16px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--body-text);
}

.required-field::after {
    content: ' *';
    color: #ff4d4f;
}

.form-control {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-disabled);
    border-radius: 4px;
    font-size: 16px;
    color: var(--heading);
}

.form-control:focus {
    border-color: var(--primary);
    outline: none;
}

.form-hint {
    margin-top: 4px;
    font-size: 12px;
    color: var(--note);
}

.form-error {
    margin-top: 4px;
    font-size: 12px;
    color: #ff4d4f;
}

.custom-select {
    position: relative;
}

.custom-select select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: transparent;
    cursor: pointer;
}

.select-arrow {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--placeholder);
}

/* 提交按鈕 */
.submit-button {
    width: 100%;
    padding: 14px;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 24px;
}

.submit-button:disabled {
    background-color: var(--border-disabled);
    cursor: not-allowed;
}
</style>
