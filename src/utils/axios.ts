// src/utils/axios.ts
import axios, { AxiosError, AxiosResponse } from 'axios';
import { handleError } from './errorHandler';

/**
 * 自定義 Axios 實例
 * 包含基本配置、攔截器與錯誤處理
 */
const axiosInstance = axios.create({
    // 不設置 baseURL，讓每個請求使用完整的 URL
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
