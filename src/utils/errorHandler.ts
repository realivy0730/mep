// src/utils/errorHandler.ts
import { AxiosError } from 'axios';

/**
 * 通用錯誤處理函數
 * 處理各種類型的錯誤，提供統一的錯誤日誌格式
 * @param error 錯誤物件
 * @param context 錯誤發生的上下文
 */
export function handleError(error: any, context: string = '未知上下文'): void {
    // 基本錯誤信息
    let errorMessage = '發生錯誤';
    let errorDetails = '';
    let errorCode = '';
    let errorStack = '';

    // 處理 Axios 錯誤
    if (error && error.isAxiosError) {
        const axiosError = error as AxiosError;
        
        errorMessage = `API 請求失敗: ${axiosError.message}`;
        
        if (axiosError.response) {
            // 伺服器回應了錯誤狀態碼
            errorCode = `${axiosError.response.status}`;
            errorDetails = `狀態: ${axiosError.response.status}, 資料: ${JSON.stringify(axiosError.response.data)}`;
        } else if (axiosError.request) {
            // 請求已發送但未收到回應
            errorDetails = '未收到伺服器回應，請檢查網路連線';
        } else {
            // 請求設置出錯
            errorDetails = '請求設置錯誤';
        }
    } 
    // 處理標準 JavaScript 錯誤
    else if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack || '';
    } 
    // 處理其他類型錯誤
    else {
        errorDetails = String(error);
    }

    // 輸出格式化的錯誤日誌
    console.error(`[錯誤] ${context}: ${errorMessage}`);
    
    if (errorCode) {
        console.error(`[錯誤代碼] ${errorCode}`);
    }
    
    if (errorDetails) {
        console.error(`[錯誤詳情] ${errorDetails}`);
    }
    
    if (errorStack) {
        console.error(`[錯誤堆疊] ${errorStack}`);
    }

    // 這裡可以添加其他錯誤處理邏輯，如錯誤報告服務
    // 例如: reportErrorToService(error, context);
}

export default handleError;
