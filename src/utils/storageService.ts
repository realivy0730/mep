// src/utils/storageService.ts
/**
 * 本地儲存服務
 * 提供帶有過期時間的本地儲存功能
 */
export class StorageService {
    /**
     * 儲存資料到 localStorage
     * @param key 儲存的鍵名
     * @param data 要儲存的資料
     * @param expirationMs 過期時間（毫秒）
     */
    static save(key: string, data: any, expirationMs: number): void {
        const item = {
            value: data,
            expiry: Date.now() + expirationMs
        };
        
        try {
            localStorage.setItem(key, JSON.stringify(item));
            console.log(`[Storage] 資料已儲存至 ${key}`);
        } catch (error) {
            console.error(`[Storage] 儲存資料至 ${key} 失敗:`, error);
            // 嘗試清除一些舊資料以釋放空間
            this.clearExpired();
        }
    }

    /**
     * 從 localStorage 獲取資料
     * @param key 儲存的鍵名
     * @returns 儲存的資料，如果已過期或不存在則返回 null
     */
    static get(key: string): any {
        try {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) {
                console.log(`[Storage] ${key} 不存在`);
                return null;
            }

            const item = JSON.parse(itemStr);
            
            // 檢查是否已過期
            if (this.isExpired(item)) {
                console.log(`[Storage] ${key} 已過期`);
                localStorage.removeItem(key);
                return null;
            }

            console.log(`[Storage] 成功從 ${key} 獲取資料`);
            return item.value;
        } catch (error) {
            console.error(`[Storage] 獲取 ${key} 資料失敗:`, error);
            return null;
        }
    }

    /**
     * 檢查 localStorage 中的資料是否有效（存在且未過期）
     * @param key 儲存的鍵名
     * @returns 是否有效
     */
    static isValid(key: string): boolean {
        try {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) {
                return false;
            }

            const item = JSON.parse(itemStr);
            return !this.isExpired(item);
        } catch (error) {
            console.error(`[Storage] 檢查 ${key} 是否有效失敗:`, error);
            return false;
        }
    }

    /**
     * 從 localStorage 中移除資料
     * @param key 儲存的鍵名
     */
    static remove(key: string): void {
        try {
            localStorage.removeItem(key);
            console.log(`[Storage] 已移除 ${key}`);
        } catch (error) {
            console.error(`[Storage] 移除 ${key} 失敗:`, error);
        }
    }

    /**
     * 清除所有過期的資料
     */
    static clearExpired(): void {
        try {
            const keys = Object.keys(localStorage);
            let clearedCount = 0;

            for (const key of keys) {
                try {
                    const itemStr = localStorage.getItem(key);
                    if (!itemStr) continue;

                    const item = JSON.parse(itemStr);
                    if (this.isExpired(item)) {
                        localStorage.removeItem(key);
                        clearedCount++;
                    }
                } catch (e) {
                    // 如果某個項目解析失敗，繼續處理下一個
                    continue;
                }
            }

            if (clearedCount > 0) {
                console.log(`[Storage] 已清除 ${clearedCount} 個過期項目`);
            }
        } catch (error) {
            console.error('[Storage] 清除過期資料失敗:', error);
        }
    }

    /**
     * 檢查項目是否已過期
     * @param item 儲存的項目
     * @returns 是否已過期
     */
    private static isExpired(item: any): boolean {
        return item.expiry && item.expiry < Date.now();
    }
}

export default StorageService;
