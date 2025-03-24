// src/services/dataService.ts
import axiosInstance from '../utils/axios';
import { StorageService } from '../utils/storageService';

/**
 * API 配置常數
 */
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://cdn.sit.crm.ddpay.ai/data',
    ENDPOINTS: {
        MERCHANT_DATA: '/boday_test/tree_cache.json',
        COUPON_DATA: '/boday_test/coupons/summary.json',
        POINT_DATA: '/boday_test/points/summary.json',
        PROFILE_DATA: '/boday_test/profile.json'
    },
    STORAGE_KEYS: {
        MERCHANT_DATA: 'merchant_data_cache',
        COUPON_DATA: 'coupon_data_cache',
        POINT_DATA: 'point_data_cache',
        PROFILE_DATA: 'profile_data_cache'
    },
    CACHE_DURATION: 3600000 // 1小時（毫秒）
};

/**
 * 資料介面定義
 */
export interface MerchantData {
    // 根據實際API回應結構定義
    [key: string]: any;
}

export interface CouponData {
    // 根據實際API回應結構定義
    [key: string]: any;
}

export interface PointData {
    // 根據實際API回應結構定義
    [key: string]: any;
}

export interface ProfileData {
    // 根據實際API回應結構定義
    [key: string]: any;
}

/**
 * 資料服務類別
 * 提供獲取各種資料的方法
 */
export class DataService {
    /**
     * 通用獲取資料方法
     * @param endpoint API端點
     * @param storageKey 儲存鍵名
     * @param forceRefresh 是否強制從伺服器刷新資料
     * @param retryCount 重試次數
     * @returns Promise<any> 返回資料
     */
    private static async fetchData(endpoint: string, storageKey: string, forceRefresh = false, retryCount = 0): Promise<any> {
        // 如果不是強制刷新且有有效的快取，則使用本地快取
        if (!forceRefresh && StorageService.isValid(storageKey)) {
            console.log(`[API] 使用本地快取資料: ${storageKey}`);
            return StorageService.get(storageKey);
        }

        try {
            console.log(`[API] 嘗試獲取資料，URL: ${API_CONFIG.BASE_URL}${endpoint}`);

            const response = await axiosInstance.get(endpoint, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            console.log(`[API] 成功獲取資料: ${endpoint}`);

            // 將獲取的資料儲存到 localStorage
            const data = response.data;
            StorageService.save(storageKey, data, API_CONFIG.CACHE_DURATION);

            return data;
        } catch (error: any) {
            console.error(`[API] 獲取資料失敗: ${endpoint}`, error);

            // 檢查是否需要重試（最多重試3次）
            if (retryCount < 3) {
                console.log(`[API] 正在進行第 ${retryCount + 1} 次重試...`);
                // 每次重試增加延遲
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                return this.fetchData(endpoint, storageKey, forceRefresh, retryCount + 1);
            }

            // 如果有過期的快取，作為最後的備援仍然使用它
            const expiredData = StorageService.get(storageKey);
            if (expiredData) {
                console.log(`[API] 使用過期的快取資料作為備援: ${storageKey}`);
                return expiredData;
            }

            throw error;
        }
    }

    /**
     * 獲取商戶資料
     * @param forceRefresh 是否強制從伺服器刷新資料
     * @returns Promise<MerchantData> 返回商戶資料
     */
    static async getMerchantData(forceRefresh = false): Promise<MerchantData> {
        return this.fetchData(
            API_CONFIG.ENDPOINTS.MERCHANT_DATA,
            API_CONFIG.STORAGE_KEYS.MERCHANT_DATA,
            forceRefresh
        );
    }

    /**
     * 獲取票券資料
     * @param forceRefresh 是否強制從伺服器刷新資料
     * @returns Promise<CouponData> 返回票券資料
     */
    static async getCouponData(forceRefresh = false): Promise<CouponData> {
        return this.fetchData(
            API_CONFIG.ENDPOINTS.COUPON_DATA,
            API_CONFIG.STORAGE_KEYS.COUPON_DATA,
            forceRefresh
        );
    }

    /**
     * 獲取點數資料
     * @param forceRefresh 是否強制從伺服器刷新資料
     * @returns Promise<PointData> 返回點數資料
     */
    static async getPointData(forceRefresh = false): Promise<PointData> {
        return this.fetchData(
            API_CONFIG.ENDPOINTS.POINT_DATA,
            API_CONFIG.STORAGE_KEYS.POINT_DATA,
            forceRefresh
        );
    }

    /**
     * 獲取個人檔案資料
     * @param forceRefresh 是否強制從伺服器刷新資料
     * @returns Promise<ProfileData> 返回個人檔案資料
     */
    static async getProfileData(forceRefresh = false): Promise<ProfileData> {
        console.log('[API] 嘗試獲取個人檔案資料');
        
        // 直接使用 fetch API 而不是 axios 實例
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE_DATA}`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                // 不使用 credentials
                credentials: 'omit'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('[API] 成功獲取個人檔案資料');
            
            // 將獲取的資料儲存到 localStorage
            StorageService.save(API_CONFIG.STORAGE_KEYS.PROFILE_DATA, data, API_CONFIG.CACHE_DURATION);
            
            return data;
        } catch (error) {
            console.error('[API] 使用 fetch 獲取個人檔案資料失敗', error);
            
            // 嘗試使用原始方法
            return this.fetchData(
                API_CONFIG.ENDPOINTS.PROFILE_DATA,
                API_CONFIG.STORAGE_KEYS.PROFILE_DATA,
                forceRefresh
            );
        }
    }

    /**
     * 清除所有資料快取
     */
    static clearAllCache(): void {
        Object.values(API_CONFIG.STORAGE_KEYS).forEach(key => {
            StorageService.remove(key);
        });
        console.log('[API] 已清除所有資料快取');
    }

    /**
     * 清除過期的資料快取
     */
    static clearExpiredCache(): void {
        StorageService.clearExpired();
    }
    
    /**
     * 清除特定資料快取
     * @param key 要清除的快取鍵名
     */
    static clearCache(key: string): void {
        StorageService.remove(key);
        console.log(`[API] 已清除 ${key} 快取`);
    }
}

export default DataService;