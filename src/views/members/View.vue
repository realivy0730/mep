<!-- src/views/members/View.vue -->
<template>
    <div class="page-container">
        <!-- 固定標頭 -->
        <header class="header">
            <div class="header-content">
                <button class="back-button" @click="$router.go(-1)">
                    <span class="material-icons">arrow_back</span>
                </button>
                <h1 class="page-title">會員個人資料</h1>
                <div class="header-right">
                    <router-link to="/members/profile/edit" class="edit-button">
                        <span class="material-icons">edit</span>
                    </router-link>
                </div>
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

            <!-- 會員資料顯示 -->
            <div v-else-if="memberData" class="member-profile">
                <div class="profile-section">
                    <div class="section-title">姓名</div>
                    <div class="section-content">{{ memberData.name }}</div>
                </div>

                <div class="profile-section">
                    <div class="section-title">性別</div>
                    <div class="section-content">{{ memberData.gender }}</div>
                </div>

                <div class="profile-section">
                    <div class="section-title">生日</div>
                    <div class="section-content">{{ formatDate(memberData.birthDate) }}</div>
                </div>

                <div class="profile-section">
                    <div class="section-title">電子郵件</div>
                    <div class="section-content">{{ memberData.email }}</div>
                </div>

                <div class="profile-section">
                    <div class="section-title">地址</div>
                    <div class="section-content">{{ memberData.address }}</div>
                </div>
            </div>

            <div v-else class="empty-state">
                <p>查無會員資料</p>
                <router-link to="/" class="home-link">返回首頁</router-link>
            </div>
        </main>

        <!-- 頁尾導覽列 -->
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Footer from '@/components/Footer.vue';
import { DataService } from '@/services/dataService';
import { handleError } from '@/utils/errorHandler';

// 路由
const router = useRouter();

// 資料狀態
const loading = ref(true);
const error = ref<Error | null>(null);
const memberData = ref<any>({
    name: '林垣均',
    gender: '女性',
    birthDate: '1980-07-30',
    email: 'ivy0730@gmail.com',
    address: '台灣台中市北屯區太祥路8號'
});

/**
 * 格式化日期為 YYYY-MM-DD 格式
 * @param dateString - 日期字串
 * @returns 格式化後的日期字串
 */
const formatDate = (dateString: string): string => {
    // 這裡可以依照需求調整日期格式
    return dateString;
};

/**
 * 獲取會員資料
 * 使用優化過的加載策略，減少等待時間
 */
const fetchMemberData = async () => {
    try {
        loading.value = true;
        error.value = null;

        // 首先檢查本地存儲中是否有最新的會員資料
        const localProfileData = localStorage.getItem('memberProfileData');
        if (localProfileData) {
            console.log('使用本地存儲的會員資料');
            const profileData = JSON.parse(localProfileData);
            processMemberData(profileData);
            return;
        }

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
            processMemberData(profileData);
            return;
        } catch (directError) {
            console.warn('直接獲取資料失敗，嘗試使用 DataService:', directError);

            // 嘗試使用 DataService
            const profileData = await DataService.getProfileData();
            if (profileData) {
                processMemberData(profileData);
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
 * 處理會員資料
 * @param profileData - API 回傳的個人資料
 */
const processMemberData = (profileData) => {
    // 檢查是否有 profile 物件
    const profile = profileData.profile || profileData;

    // 處理性別顯示
    let genderText = '未設定';
    if (profile.gender) {
        genderText = profile.gender === 1 ? '男性' :
            (profile.gender === 2 ? '女性' : '其他');
    }

    memberData.value = {
        name: profile.full_name || profile.name || '未設定',
        gender: genderText,
        birthDate: profile.birthday || profile.birthDate || profile.birth_date || '未設定',
        email: profile.email || '未設定',
        address: buildFullAddress(profile)
    };
    console.log('會員資料載入成功:', memberData.value);
};

/**
 * 組合完整地址
 * @param profileData - 個人資料物件
 * @returns 格式化的完整地址
 */
const buildFullAddress = (profileData) => {
    if (!profileData) return '未設定';

    // 依照規格從屬性獲取地址資訊
    const country = profileData.country || '台灣';
    const county = profileData.county || '';
    const district = profileData.district || '';
    const address = profileData.address || '';

    // 組合完整地址
    return [country, county, district, address].filter(Boolean).join('');
};

// 元件掛載時獲取資料
onMounted(() => {
    fetchMemberData();
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;



/* 會員資料顯示 */
.member-profile {
    background-color: var(--white);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.profile-section {
    display: flex;
    flex-direction: column;
    padding: 16px;
    border-bottom: 1px solid var(--border-disabled);
}

.profile-section:last-child {
    border-bottom: none;
}

.section-title {
    font-size: 14px;
    color: var(--body-text);
    margin-bottom: 8px;
}

.section-content {
    font-size: 16px;
    color: var(--heading);
    font-weight: 500;
}
</style>
