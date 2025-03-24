# 主要需求

`src/views/Index.vue`
請幫忙我把圖片路徑做判斷
```
<div class="brand-image" :style="{ backgroundImage: `url(${brand.image})` }"></div>
if( url has 'https://cdn' ) {
   return url;
}
url = https://cdn.sit.crm.ddpay.ai/+url;
```

# 附加檔案

## src/services/api.ts
```
// src/services/api.ts
import axiosInstance from '../utils/axios';
import StorageService from '../utils/storageService';

/**
 * API 配置常數
 * 使用環境變數來設定 API 基礎 URL
 * 實際可用的 API 網址是 https://cdn.sit.crm.ddpay.ai/data
 */
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://cdn.sit.crm.ddpay.ai/data',
    ENDPOINTS: {
        TREE_CACHE: '/tree_cache.json'
    },
    STORAGE_KEYS: {
        TREE_CACHE: 'api_tree_cache_data'
    },
    CACHE_DURATION: 3600000 // 1小時（毫秒）
};

/**
 * 業務資料介面定義
 */
export interface Brand {
    id: string;
    name: string;
    image: string;
}

export interface UserInfo {
    points: number;
    tickets: number;
}

export interface AppData {
    userInfo: UserInfo;
    brands: Brand[];
}

/**
 * API 服務類別
 * 提供所有與後端 API 互動的方法，整合本地儲存與過期機制
 */
export class ApiService {
    /**
     * 獲取樹狀快取資料
     * 增加了錯誤重試機制、本地快取和詳細的錯誤日誌
     * @param forceRefresh 是否強制從伺服器刷新資料
     * @returns Promise<any> 返回樹狀快取資料
     */
    static async getTreeCache(forceRefresh = false, retryCount = 0): Promise<any> {
        // 儲存鍵名
        const storageKey = API_CONFIG.STORAGE_KEYS.TREE_CACHE;

        // 如果不是強制刷新且有有效的快取，則使用本地快取
        if (!forceRefresh && StorageService.isValid(storageKey)) {
            console.log('[API] 使用本地快取資料');
            return StorageService.get(storageKey);
        }

        try {
            console.log(`[API] 嘗試獲取樹狀快取資料，URL: ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TREE_CACHE}`);

            const response = await axiosInstance.get(
                `${API_CONFIG.ENDPOINTS.TREE_CACHE}`,
                {
                    // 明確設定不使用快取，避免舊資料問題
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                }
            );

            console.log('[API] 成功獲取樹狀快取資料');

            // 將獲取的資料儲存到 localStorage，設定過期時間為 1 小時
            const data = response.data;
            StorageService.save(storageKey, data, API_CONFIG.CACHE_DURATION);

            return data;
        } catch (error: any) {
            console.error(`[API] 獲取樹狀快取資料失敗:`, error);

            // 檢查是否需要重試（最多重試3次）
            if (retryCount < 3) {
                console.log(`[API] 正在進行第 ${retryCount + 1} 次重試...`);
                // 每次重試增加延遲，避免立即重試造成伺服器負擔
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                return this.getTreeCache(forceRefresh, retryCount + 1);
            }

            // 嘗試不同的 URL 策略
            try {
                if (retryCount === 3) {
                    // 嘗試使用相對路徑
                    console.log('[API] 嘗試使用相對路徑獲取資料...');
                    const response = await axiosInstance.get('/tree_cache.json');
                    const data = response.data;
                    StorageService.save(storageKey, data, API_CONFIG.CACHE_DURATION);
                    console.log('[API] 使用相對路徑成功獲取資料');
                    return data;
                } else if (retryCount === 4) {
                    // 嘗試使用代理路徑
                    console.log('[API] 嘗試使用代理路徑獲取資料...');
                    const response = await fetch('/api/tree_cache.json');
                    const data = await response.json();
                    StorageService.save(storageKey, data, API_CONFIG.CACHE_DURATION);
                    console.log('[API] 使用代理路徑成功獲取資料');
                    return data;
                } else if (retryCount === 5) {
                    // 最後嘗試使用本地備用資料
                    console.log('[API] 嘗試使用本地備用資料...');
                    const response = await fetch('/mock/tree_cache.json');
                    const data = await response.json();
                    StorageService.save(storageKey, data, API_CONFIG.CACHE_DURATION);
                    console.log('[API] 使用本地備用資料成功');
                    return data;
                }
            } catch (secondaryError) {
                console.error('[API] 替代方法也失敗:', secondaryError);
            }

            // 如果有過期的快取，作為最後的備援仍然使用它
            const expiredData = StorageService.get(storageKey);
            if (expiredData) {
                console.log('[API] 使用過期的快取資料作為備援');
                return expiredData;
            }

            throw error;
        }
    }

    /**
     * 處理並轉換後端資料為應用程式所需格式
     * 增加了錯誤處理，提供合理的預設值
     * @param forceRefresh 是否強制從伺服器刷新資料
     * @returns Promise<AppData> 返回轉換後的應用程式資料
     */
    static async getAppData(forceRefresh = false): Promise<AppData> {
        try {
            const rawData = await this.getTreeCache(forceRefresh);
            console.log('[API] 原始資料結構:', JSON.stringify(rawData).substring(0, 200) + '...');

            // 根據實際 API 回應結構進行調整
            // 這裡假設 API 回應具有以下結構，需要根據實際情況修改

            let userInfo = {
                points: 0,
                tickets: 0
            };

            let brands: Brand[] = [];

            // 檢查並擷取使用者資訊
            if (rawData.user) {
                userInfo = {
                    points: rawData.user.points || 0,
                    tickets: rawData.user.tickets || 0
                };
            } else if (rawData.userInfo) {
                userInfo = {
                    points: rawData.userInfo.points || 0,
                    tickets: rawData.userInfo.tickets || 0
                };
            }

            // 檢查並擷取品牌資訊
            if (Array.isArray(rawData.brands)) {
                brands = rawData.brands.map((brand: any) => ({
                    id: brand.id || '',
                    name: brand.name || '未命名品牌',
                    image: brand.image || ''
                }));
            } else if (rawData.brands && typeof rawData.brands === 'object') {
                // 如果 brands 是物件，將其轉為陣列
                brands = Object.values(rawData.brands).map((brand: any) => ({
                    id: brand.id || '',
                    name: brand.name || '未命名品牌',
                    image: brand.image || ''
                }));
            }

            // 如果沒有資料，使用預設的假資料
            if (brands.length === 0) {
                console.warn('[API] 未獲取到品牌資料，使用預設資料');
                brands = [
                    {
                        id: '4a1f9b1b-3624-460e-a53c-2536eab6991a', name: 'OpuLence 優贊',
                        image: 'https://reddoor.sit.crm.ddpay.ai/data/1e866b83-3a19-411a-89ad-e5e95724b289/image/d2/b6/de/e0/d2b6dee0c64617a247cbbcd8a7662a20.jpg'
                    },
                    {
                        id: '4a1f9b1b-3624-460e-a53c-2536eab6991b', name: '乾杯燒肉居酒屋',
                        image: 'https://reddoor.sit.crm.ddpay.ai/data/1e866b83-3a19-411a-89ad-e5e95724b289/image/cf/fc/04/ec/cffc04ecdba0f7676ce2b3b572af0e66.jpg'
                    }
                ];
            }

            const result = {
                userInfo,
                brands
            };

            console.log('[API] 處理後資料:', result);
            return result;
        } catch (error) {
            console.error('[API] 處理應用程式資料失敗:', error);

            // 發生錯誤時返回預設資料，確保 UI 不會崩潰
            return {
                userInfo: {
                    points: 0,
                    tickets: 0
                },
                brands: [
                    { id: '1', name: '預設品牌 1', image: '' },
                    { id: '2', name: '預設品牌 2', image: '' }
                ]
            };
        }
    }

    /**
     * 清除 API 相關的所有快取
     * 用於登出或強制刷新情況
     */
    static clearAllCache(): void {
        Object.values(API_CONFIG.STORAGE_KEYS).forEach(key => {
            StorageService.remove(key);
        });
        console.log('[API] 已清除所有 API 相關快取');
    }

    /**
     * 清除過期的 API 快取
     * 可以定期呼叫，例如在應用啟動時
     */
    static clearExpiredCache(): void {
        StorageService.clearExpired();
    }
}

export default ApiService;

```

## src/utils/axios.ts
```
// src/utils/axios.ts
import axios, { AxiosError, AxiosResponse } from 'axios';
import { handleError } from './errorHandler';

/**
 * 自定義 Axios 實例
 * 包含基本配置、攔截器與錯誤處理
 */
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://cdn.sit.crm.ddpay.ai/data',
    timeout: 15000, // 增加到15秒，避免網路緩慢問題
    headers: { 'Content-Type': 'application/json' },
    // 為了處理可能的 CORS 問題
    withCredentials: false
});

/**
 * 請求攔截器
 * 在發送請求前執行一些操作，例如添加認證標頭或日誌記錄
 */
axiosInstance.interceptors.request.use(
    config => {
        console.log(`[API 請求] ${config.url}`);

        // 如果需要添加認證標頭，可以在這裡處理
        // 例如: if (localStorage.getItem('token')) {
        //     config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        // }

        return config;
    },
    error => {
        handleError(error, '請求攔截器');
        return Promise.reject(error);
    }
);

/**
 * 回應攔截器
 * 處理所有回應，包括成功回應與錯誤回應
 */
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log(`[API 回應] ${response.config.url} - 狀態: ${response.status}`);
        return response;
    },
    (error: AxiosError) => {
        // 處理特定錯誤碼
        if (error.response) {
            const status = error.response.status;

            switch (status) {
                case 401:
                    console.error('認證失敗，請重新登入');
                    // 這裡可以觸發登出操作或重定向到登入頁面
                    break;

                case 403:
                    console.error('權限不足，無法存取此資源');
                    break;

                case 404:
                    console.error(`找不到資源: ${error.config?.url}`);
                    break;

                case 500:
                    console.error('伺服器發生錯誤，請稍後再試');
                    break;

                default:
                    console.error(`API 錯誤: ${status} - ${error.message}`);
            }
        } else if (error.request) {
            // 已送出請求但未收到回應
            console.error('無法連接到伺服器，請檢查網路連線');
        } else {
            // 請求配置出錯
            console.error(`請求錯誤: ${error.message}`);
        }

        // 使用通用錯誤處理函數
        handleError(error, '回應攔截器');

        return Promise.reject(error);
    }
);

export default axiosInstance;

```

## src/utils/errorHandler.ts
```
// src/utils/errorHandler.ts

/**
 * 錯誤處理工具
 * 用於統一處理應用程式中的錯誤情況
 * @param error - 錯誤物件
 * @param context - 錯誤發生的上下文描述
 * @returns void
 */
export const handleError = (error: unknown, context: string): void => {
    // 取得錯誤訊息
    const errorMessage = error instanceof Error
        ? error.message
        : '未知錯誤';

    // 輸出錯誤日誌
    console.error(`[${context}] 錯誤: ${errorMessage}`);

    // 如果是開發環境，輸出完整錯誤堆疊
    if (process.env.NODE_ENV === 'development') {
        console.error('詳細錯誤資訊:', error);
    }
};

```

## src/utils/storageService.ts
```
// src/utils/storageService.ts
import { handleError } from './errorHandler';

/**
 * LocalStorage 儲存服務
 * 提供資料壓縮、過期機制和錯誤處理
 */
class StorageService {
    /**
     * 儲存資料到 localStorage，包含壓縮和過期時間設定
     * @param key - 儲存的鍵名
     * @param data - 要儲存的資料
     * @param expiryTimeMs - 過期時間（毫秒），預設為 1 小時
     * @returns 儲存是否成功
     */
    static save(key: string, data: any, expiryTimeMs: number = 3600000): boolean {
        try {
            // 建立包含資料和過期時間的物件
            const item = {
                data,
                expiry: Date.now() + expiryTimeMs
            };

            // 轉換為 JSON 字串並進行壓縮
            const jsonValue = JSON.stringify(item);
            const compressedValue = this.compressString(jsonValue);

            // 儲存壓縮後的資料
            localStorage.setItem(key, compressedValue);

            console.log(`[儲存服務] 成功儲存資料到 ${key}，過期時間設為 ${expiryTimeMs / 60000} 分鐘`);
            return true;
        } catch (error) {
            handleError(error, '儲存資料到 localStorage');
            return false;
        }
    }

    /**
     * 從 localStorage 獲取資料，自動處理過期和解壓縮
     * @param key - 儲存的鍵名
     * @returns 儲存的資料，如果過期或不存在則返回 null
     */
    static get<T>(key: string): T | null {
        try {
            const compressedValue = localStorage.getItem(key);

            // 檢查資料是否存在
            if (!compressedValue) {
                return null;
            }

            // 解壓縮資料
            const jsonValue = this.decompressString(compressedValue);
            const item = JSON.parse(jsonValue);

            // 檢查資料是否過期
            if (Date.now() > item.expiry) {
                console.log(`[儲存服務] ${key} 的資料已過期，移除中...`);
                localStorage.removeItem(key);
                return null;
            }

            // 返回未過期的資料
            return item.data as T;
        } catch (error) {
            handleError(error, '從 localStorage 獲取資料');
            return null;
        }
    }

    /**
     * 檢查特定鍵的資料是否存在且未過期
     * @param key - 儲存的鍵名
     * @returns 資料是否有效
     */
    static isValid(key: string): boolean {
        try {
            const compressedValue = localStorage.getItem(key);

            // 檢查資料是否存在
            if (!compressedValue) {
                return false;
            }

            // 解壓縮資料
            const jsonValue = this.decompressString(compressedValue);
            const item = JSON.parse(jsonValue);

            // 檢查資料是否過期
            return Date.now() <= item.expiry;
        } catch (error) {
            handleError(error, '檢查 localStorage 資料有效性');
            return false;
        }
    }

    /**
     * 移除特定鍵的資料
     * @param key - 儲存的鍵名
     */
    static remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            handleError(error, '移除 localStorage 資料');
        }
    }

    /**
     * 清除所有已過期的資料
     * @returns 清除的項目數量
     */
    static clearExpired(): number {
        let clearedCount = 0;

        try {
            // 遍歷所有 localStorage 項目
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);

                if (key) {
                    const compressedValue = localStorage.getItem(key);

                    if (compressedValue) {
                        try {
                            // 嘗試解壓縮並解析
                            const jsonValue = this.decompressString(compressedValue);
                            const item = JSON.parse(jsonValue);

                            // 如果有 expiry 屬性且已過期，則移除
                            if (item.expiry && Date.now() > item.expiry) {
                                localStorage.removeItem(key);
                                clearedCount++;
                            }
                        } catch {
                            // 如果解析失敗，忽略此項目（可能不是由此服務儲存）
                        }
                    }
                }
            }
        } catch (error) {
            handleError(error, '清除過期的 localStorage 資料');
        }

        console.log(`[儲存服務] 已清除 ${clearedCount} 個過期項目`);
        return clearedCount;
    }

    /**
     * 使用 Base64 壓縮字串
     * @param str - 要壓縮的字串
     * @returns 壓縮後的字串
     */
    private static compressString(str: string): string {
        try {
            // 使用 Base64 編碼
            // 注意：這不是真正的壓縮，但可以節省一些空間並提供編碼一致性
            // 真正的壓縮可能需要額外的庫如 pako 或 lz-string
            return btoa(unescape(encodeURIComponent(str)));
        } catch (error) {
            handleError(error, '壓縮字串');
            return str; // 失敗時返回原始字串
        }
    }

    /**
     * 使用 Base64 解壓縮字串
     * @param compressedStr - 壓縮後的字串
     * @returns 原始字串
     */
    private static decompressString(compressedStr: string): string {
        try {
            // 使用 Base64 解碼
            return decodeURIComponent(escape(atob(compressedStr)));
        } catch (error) {
            handleError(error, '解壓縮字串');
            return compressedStr; // 失敗時返回壓縮字串
        }
    }
}

// 導出 StorageService 類
export { StorageService };
export default StorageService;

```

## src/views/Index.vue
```
<!-- src/views/Index.vue -->
<template>
    <div class="page-container">
        <!-- 固定的 Header -->
        <header class="header">
            <div class="header-content">
                <h1 class="username">張元益</h1>
                <button class="notification-btn">
                    <span class="material-icons">notifications</span>
                    <span class="notification-dot"></span>
                </button>
            </div>
        </header>

        <!-- 主要內容區域 -->
        <main class="main-content">
            <div class="content-container">
                <div class="profile-page">
                    <!-- 點數和票券資訊 -->
                    <div class="info-cards" v-if="appData && !loading">
                        <div class="info-card">
                            <div class="info-value">
                                <span class="info-number">{{ appData.userInfo.points }}</span>
                                <span>點</span>
                            </div>
                            <div class="info-label">會員點數</div>
                        </div>
                        <div class="info-card">
                            <div class="info-value">
                                <span class="info-number">{{ appData.userInfo.tickets }}</span>
                                <span>張</span>
                            </div>
                            <div class="info-label">電子票券</div>
                        </div>
                    </div>
                    <div v-else-if="loading" class="loading">資料載入中...</div>
                    <div v-else class="error-message">無法載入資料，請稍後再試</div>

                    <!-- 品牌資訊 -->
                    <section class="brand-section" v-if="appData && !loading">
                        <h2>品牌資訊</h2>
                        <ul class="brand-list">
                            <li class="brand-card" v-for="brand in appData.brands" :key="brand.id">
                                <a :href="`/brands/${brand.id}`">
                                    <div class="brand-image" :style="{ backgroundImage: `url(${brand.image})` }">
                                    </div>
                                    <h3 class="brand-name">{{ brand.name }}</h3>
                                </a>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </main>

        <!-- 頁尾元件 -->
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Footer from '@/components/Footer.vue';
import { ApiService, AppData } from '@/services/api';
import { handleError } from '@/utils/errorHandler';

// 資料狀態
const appData = ref < AppData | null > (null);
const loading = ref(true);
const error = ref < Error | null > (null);

/**
 * 獲取應用程式資料
 * 從 API 服務獲取並設置應用程式所需資料
 */
const fetchAppData = async () => {
    try {
        loading.value = true;
        // 使用 API 服務獲取資料
        const data = await ApiService.getAppData();
        appData.value = data;
    } catch (err) {
        error.value = err instanceof Error ? err : new Error('獲取資料時發生未知錯誤');
        handleError(error.value, '獲取應用程式資料');
    } finally {
        loading.value = false;
    }
};

// 在元件掛載時獲取資料
onMounted(() => {
    fetchAppData();
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

/* 頁面容器 */
.page-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* Header 樣式 */
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: var(--bg-container, #FFFFFF);
    border-bottom: 1px solid var(--border-base, #D9E2EC);
    z-index: 1000;
    height: 56px;
    padding-top: env(safe-area-inset-top, 0);
}

.header-content {
    max-width: 768px;
    margin: 0 auto;
    padding: 0 16px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.username {
    font-size: var(--font-size-lg, 20px);
    font-weight: var(--font-weight-medium, 500);
    color: var(--text-primary, #1A2633);
}

.notification-btn {
    position: relative;
    background: none;
    border: none;
    padding: 8px;
    color: var(--text-secondary, #4D5E71);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notification-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 8px;
    height: 8px;
    background-color: var(--primary-color, #2B6CBF);
    border-radius: 50%;
}

/* 主要內容區域 */
.main-content {
    flex: 1;
    padding-bottom: 70px;
    padding-top: 56px; // 確保內容不被固定 Header 遮蓋
}

.content-container {
    max-width: 768px;
    margin: 0 auto;
    width: 100%;
    padding: 16px;
}

/* 個人資料頁面樣式 */
.profile-page {
    background-color: transparent;
}

/* 點數和票券資訊卡片 */
.info-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: $spacing-lg;
}

.info-card {
    background-color: var(--bg-container, #FFFFFF);
    padding: $spacing-md;
    border-radius: $border-radius-lg;
    text-align: center;
    box-shadow: var(--shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.05));
}

.info-value {
    font-size: var(--font-size-body);
    color: var(--primary-color, #2B6CBF);
}

.info-value .info-number {
    font-size: var(--font-size-h1, 24px);
}

.info-label {
    font-size: var(--font-size-sm, 1.125rem);
    color: var(--heading);
}

/* 品牌資訊卡片 */
.brand-section {
    h2 {
        font-size: var(--font-size-h2);
        color: var(--heading);
        margin-bottom: $spacing-md;
    }
}

.brand-list {
    list-style: none;
    padding: 0;
    display: grid;
    gap: $spacing-md;
}

.brand-list li {
    padding: 5px;
}

.brand-card {
    background-color: var(--bg-white);
    border-radius: $border-radius-lg;
    overflow: hidden;
    box-shadow: var(--shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.05));
    margin-bottom: 15px;
}

.brand-image {
    position: relative;
    width: 100%;
    height: 394px; // 根據 16:9 比例
    background-size: cover;
    background-position: center;
}

.brand-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
}

.brand-name {
    font-size: var(--font-size-h3);
    font-weight: bold;
    text-align: center;
    padding: $spacing-sm;
}

/* 載入中與錯誤訊息 */
.loading {
    text-align: center;
    padding: $spacing-md;
    color: var(--text-subtitle);
}

.error-message {
    text-align: center;
    padding: $spacing-md;
    color: var(--error-color, #E53935);
}

/* 響應式設計 */
@media (max-width: 768px) {

    .header-content,
    .content-container {
        padding: 0 16px;
    }

    .brand-image {
        height: 200px; // 手機端縮小圖片高度
    }
}

/* Safari 瀏覽器適配 */
@supports (-webkit-touch-callout: none) {
    .header {
        padding-top: max(env(safe-area-inset-top), 20px);
    }

    .main-content {
        padding-top: calc(56px + max(env(safe-area-inset-top), 20px));
    }
}
</style>

```

## vite.config.ts
```
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        base: '/',
        plugins: [vue()],
        server: {
            port: 3000,
            open: true,
            host: true,
            // 加入跨域代理設定，解決 API 請求問題
            proxy: {
                // 當路徑以 /api 開頭時，代理到實際的 API 伺服器
                '/api': {
                    target: 'https://cdn.sit.crm.ddpay.ai',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '/data'),
                },
                // 直接代理特定路徑
                '/data': {
                    target: 'https://cdn.sit.crm.ddpay.ai',
                    changeOrigin: true,
                },
            },
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        define: {
            'process.env.VITE_THEME': JSON.stringify(env.VITE_THEME),
        },
        build: {
            outDir: 'dist',
            assetsDir: 'assets',
            sourcemap: true,
            rollupOptions: {
                input: {
                    main: fileURLToPath(new URL('./index.html', import.meta.url)),
                },
                output: {
                    chunkFileNames: 'assets/js/[name]-[hash].js',
                    entryFileNames: 'assets/js/[name]-[hash].js',
                    assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
                },
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
            @use "@/assets/themes/${env.VITE_THEME || 'default'}/theme" as *;
          `,
                },
            },
        },
    };
});

```

## .env
```
VITE_THEME=ddpay
# .env 檔案（基礎設定）
VITE_APP_TITLE=DDPay 會員系統
VITE_API_BASE_URL=https://cdn.sit.crm.ddpay.ai/data

# .env.development 檔案（開發環境設定）
VITE_APP_TITLE=DDPay 會員系統 - 開發環境
VITE_API_BASE_URL=https://cdn.sit.crm.ddpay.ai/data

# .env.production 檔案（生產環境設定）
VITE_APP_TITLE=DDPay 會員系統
VITE_API_BASE_URL=https://cdn.sit.crm.ddpay.ai/data

```
