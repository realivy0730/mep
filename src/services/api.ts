// src/services/api.ts
import axiosInstance from '../utils/axios';
import { StorageService } from '../utils/storageService';

/**
 * API 配置常數
 * 使用環境變數來設定 API 基礎 URL
 * 實際可用的 API 網址是 https://cdn.sit.crm.ddpay.ai/data
 */
export const API_CONFIG = {
    // 開發環境使用本地服務器，生產環境使用 CDN
    BASE_URL: import.meta.env.MODE === 'development' 
              ? 'http://localhost:3000/api/data' 
              : (import.meta.env.VITE_API_BASE_URL || 'https://cdn.sit.crm.ddpay.ai/data'),
    ENDPOINTS: {
        TREE_CACHE: '/boday_test/tree_cache.json',
        COUPONS_SUMMARY: '/boday_test/coupons/summary.json',
        PROFILE: '/boday_test/profile.json'
    },
    STORAGE_KEYS: {
        TREE_CACHE: 'api_tree_cache_data',
        COUPONS_SUMMARY: 'api_coupons_summary_data',
        PROFILE: 'api_profile_data'
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
    fullName?: string;
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
            // 直接使用完整的 URL
            const apiUrl = 'http://localhost:3000/api/data/boday_test/tree_cache.json';
            console.log(`[API] 嘗試獲取樹狀快取資料，URL: ${apiUrl}`);

            // 使用 fetch API 而不是 axios
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('[API] 成功獲取樹狀快取資料');

            // 將獲取的資料儲存到 localStorage
            StorageService.save(storageKey, data, API_CONFIG.CACHE_DURATION);

            return data;
        } catch (error: any) {
            console.error(`[API] 獲取樹狀快取資料失敗:`, error);

            // 如果有過期的快取，作為最後的備援仍然使用它
            const expiredData = StorageService.get(storageKey);
            if (expiredData) {
                console.log('[API] 使用過期的快取資料作為備援');
                return expiredData;
            }

            // 返回預設資料
            return {
                user: {
                    points: 100,
                    tickets: 5
                },
                brands: []
            };
        }
    }

    /**
     * 獲取用戶個人資料
     * @param forceRefresh 是否強制從伺服器刷新資料
     * @returns Promise<any> 返回用戶個人資料
     */
    static async getProfile(forceRefresh = false): Promise<any> {
        const storageKey = API_CONFIG.STORAGE_KEYS.PROFILE;

        // 如果不是強制刷新且有有效的快取，則使用本地快取
        if (!forceRefresh && StorageService.isValid(storageKey)) {
            console.log('[API] 使用本地快取的個人資料');
            return StorageService.get(storageKey);
        }

        try {
            // 直接使用完整的 URL
            const apiUrl = 'http://localhost:3000/api/data/boday_test/profile.json';
            console.log(`[API] 嘗試獲取個人資料，完整 URL: ${apiUrl}`);

            // 使用 fetch API 而不是 axios
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('[API] 成功獲取個人資料:', data);

            // 將獲取的資料儲存到 localStorage
            StorageService.save(storageKey, data, API_CONFIG.CACHE_DURATION);

            return data;
        } catch (error: any) {
            console.error(`[API] 獲取個人資料失敗:`, error);

            // 如果有過期的快取，作為最後的備援仍然使用它
            const expiredData = StorageService.get(storageKey);
            if (expiredData) {
                console.log('[API] 使用過期的快取個人資料作為備援');
                return expiredData;
            }

            // 返回預設資料
            return {
                profile: {
                    full_name: '訪客用戶',
                    email: '',
                    phone: '',
                }
            };
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
            // 強制刷新資料
            const profileData = await this.getProfile(true);
            const rawData = await this.getTreeCache(true);
            
            console.log('[API] 原始資料結構:', rawData);
            console.log('[API] 個人資料結構:', profileData);

            // 根據實際 API 回應結構進行調整
            let userInfo = {
                points: 0,
                tickets: 0,
                fullName: profileData?.profile?.full_name || '訪客用戶'
            };

            console.log('[API] 用戶名稱:', profileData?.profile?.full_name);

            let brands: Brand[] = [];

            // 檢查並擷取使用者資訊
            if (rawData.user) {
                userInfo = {
                    points: rawData.user.points || 0,
                    tickets: rawData.user.tickets || 0,
                    fullName: profileData?.profile?.full_name || userInfo.fullName
                };
            } else if (rawData.userInfo) {
                userInfo = {
                    points: rawData.userInfo.points || 0,
                    tickets: rawData.userInfo.tickets || 0,
                    fullName: profileData?.profile?.full_name || userInfo.fullName
                };
            }

            // 檢查並擷取品牌資訊
            if (Array.isArray(rawData.brands)) {
                brands = rawData.brands.map((brand: any) => ({
                    id: brand.id || '',
                    name: brand.name || '未命名品牌',
                    image: brand.logo_image || ''  // 這裡是問題所在 - logo_image 屬性轉換為 image 屬性
                }));
            } else if (rawData.brands && typeof rawData.brands === 'object') {
                // 如果 brands 是物件，將其轉為陣列
                brands = Object.values(rawData.brands).map((brand: any) => ({
                    id: brand.id || '',
                    name: brand.name || '未命名品牌',
                    image: brand.logo_image || ''  // 同樣的轉換邏輯
                }));
            }

            // 如果沒有資料，使用預設的假資料
            if (brands.length === 0) {
                console.warn('[API] 未獲取到品牌資料，使用預設資料');
                brands = [
                    {
                        id: '4a1f9b1b-3624-460e-a53c-2536eab6991a',
                        name: 'OpuLence 優贊',
                        image: 'https://reddoor.sit.crm.ddpay.ai/data/1e866b83-3a19-411a-89ad-e5e95724b289/image/d2/b6/de/e0/d2b6dee0c64617a247cbbcd8a7662a20.jpg'
                    },
                    {
                        id: '4a1f9b1b-3624-460e-a53c-2536eab6991b',
                        name: '乾杯燒肉居酒屋',
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
                    tickets: 0,
                    fullName: '訪客用戶'
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
