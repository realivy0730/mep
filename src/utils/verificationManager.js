// src/utils/verificationManager.js

/**
 * 驗證碼管理器
 * 處理簡訊驗證碼的發送、確認和自動填充相關功能
 */
export class VerificationManager {
    /**
     * 請求發送簡訊驗證碼
     * @param {string} phoneNumber - 接收驗證碼的手機號碼
     * @param {string} type - 驗證類型 (login, register, resetPassword)
     * @returns {Promise<{success: boolean, message: string, requestId?: string}>}
     */
    static async requestCode(phoneNumber, type = 'login') {
        try {
            console.log(`正在向 ${phoneNumber} 發送${type}驗證碼`);

            // 實際應用中應向後端API發送請求
            // 這裡模擬API響應
            const response = {
                success: true,
                message: '驗證碼已發送',
                requestId: `REQ_${Date.now()}`
            };

            // 在開發環境下，模擬顯示驗證碼（實際生產環境不應該這樣做）
            if (import.meta.env.DEV) {
                console.log('開發環境模擬驗證碼：1234');
            }

            // 儲存請求ID以便後續驗證使用
            localStorage.setItem('verification_request_id', response.requestId);

            return response;
        } catch (error) {
            console.error('發送驗證碼失敗', error);
            return {
                success: false,
                message: error.message || '發送驗證碼失敗，請稍後再試'
            };
        }
    }

    /**
     * 驗證用戶輸入的驗證碼
     * @param {string} code - 用戶輸入的驗證碼
     * @param {string} phoneNumber - 接收驗證碼的手機號碼
     * @returns {Promise<{success: boolean, message: string, token?: string}>}
     */
    static async verifyCode(code, phoneNumber) {
        try {
            console.log(`驗證手機 ${phoneNumber} 的驗證碼: ${code}`);

            // 獲取之前儲存的請求ID
            const requestId = localStorage.getItem('verification_request_id');

            // 實際應用中應向後端API發送驗證請求
            // 這裡模擬API響應

            // 在開發環境下，模擬驗證（任何4位數字都通過）
            let success = false;
            if (import.meta.env.DEV) {
                success = /^\d{4}$/.test(code);
            } else {
                // 生產環境應由服務器驗證
                success = true; // 模擬成功
            }

            if (success) {
                // 清理請求ID
                localStorage.removeItem('verification_request_id');

                return {
                    success: true,
                    message: '驗證成功',
                    token: `TOKEN_${Date.now()}`
                };
            } else {
                return {
                    success: false,
                    message: '驗證碼錯誤，請重新輸入'
                };
            }
        } catch (error) {
            console.error('驗證碼驗證失敗', error);
            return {
                success: false,
                message: error.message || '驗證失敗，請稍後再試'
            };
        }
    }

    /**
     * 設置自動填充SMS OTP的偵測
     * 相容支援WebOTP API的瀏覽器
     * @param {Function} callback - 成功偵測到驗證碼時的回調函數
     * @param {number} timeout - 等待超時時間（毫秒），預設60秒
     * @returns {AbortController} - 可用於中止偵測的控制器
     */
    static setupSMSAutofill(callback, timeout = 60000) {
        const ac = new AbortController();

        // 檢查瀏覽器是否支援WebOTP API
        if ('OTPCredential' in window) {
            navigator.credentials.get({
                otp: { transport: ['sms'] },
                signal: ac.signal
            }).then(otp => {
                if (otp && otp.code) {
                    console.log('已自動偵測到簡訊驗證碼');
                    callback(otp.code);
                }
            }).catch(err => {
                console.log('無法自動獲取驗證碼', err);
            });

            // 設置超時自動中止
            setTimeout(() => {
                ac.abort();
            }, timeout);
        } else {
            console.log('此瀏覽器不支援自動填充驗證碼功能');
        }

        return ac;
    }

    /**
     * 格式化手機號碼顯示
     * @param {string} phoneNumber - 手機號碼
     * @returns {string} 格式化後的手機號碼
     */
    static formatPhoneNumber(phoneNumber) {
        if (!phoneNumber) return '';

        // 移除非數字字符
        const cleaned = phoneNumber.replace(/\D/g, '');

        // 處理台灣手機號碼格式 (09xx-xxx-xxx)
        if (cleaned.length === 10 && cleaned.startsWith('09')) {
            return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
        }

        return phoneNumber;
    }

    /**
     * 從文本中提取可能的驗證碼
     * 用於處理貼上事件
     * @param {string} text - 包含驗證碼的文本
     * @param {number} length - 預期的驗證碼長度
     * @returns {string|null} - 提取的驗證碼，如果未找到則返回null
     */
    static extractVerificationCode(text, length = 4) {
        if (!text) return null;

        // 嘗試匹配常見驗證碼格式
        // 1. 嘗試匹配「您的驗證碼是1234」格式
        let match = text.match(/驗證碼[是為:]?\s*(\d{4,6})/);
        if (match && match[1] && match[1].length >= length) {
            return match[1].substring(0, length);
        }

        // 2. 嘗試匹配「[服務名] 1234」格式
        match = text.match(/\[\w+\]\s*(\d{4,6})/);
        if (match && match[1] && match[1].length >= length) {
            return match[1].substring(0, length);
        }

        // 3. 嘗試匹配任何連續數字
        const digits = text.match(/\d+/g);
        if (digits) {
            for (const digit of digits) {
                if (digit.length >= length) {
                    return digit.substring(0, length);
                }
            }
        }

        // 4. 如果文本自身就是純數字且長度合適
        if (/^\d+$/.test(text) && text.length >= length) {
            return text.substring(0, length);
        }

        return null;
    }
}

export default VerificationManager;
