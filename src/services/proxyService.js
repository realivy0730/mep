// src/services/proxyService.js
/**
 * 代理服務
 * 用於解決 CORS 問題，通過 Node.js 代理伺服器獲取外部 API 資料
 */

/**
 * 通過代理獲取資料
 * @param {string} url - 要獲取的 URL
 * @param {Object} options - fetch 選項
 * @returns {Promise<any>} - 返回獲取的資料
 */
export async function fetchViaProxy(url, options = {}) {
  try {
    // 使用本地代理伺服器
    const proxyUrl = '/api/proxy';
    
    // 構建請求選項
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify({
        url: url,
        method: options.method || 'GET',
        headers: options.headers || {},
        body: options.body || null
      })
    };
    
    console.log(`[代理服務] 嘗試通過代理獲取: ${url}`);
    const response = await fetch(proxyUrl, requestOptions);
    
    if (!response.ok) {
      throw new Error(`代理請求失敗: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`[代理服務] 成功獲取資料: ${url}`);
    return data;
  } catch (error) {
    console.error(`[代理服務] 錯誤: ${error.message}`);
    throw error;
  }
}

/**
 * 直接獲取資料 (嘗試多種方法)
 * @param {string} url - 要獲取的 URL
 * @param {Object} options - fetch 選項
 * @returns {Promise<any>} - 返回獲取的資料
 */
export async function fetchWithFallback(url, options = {}) {
  const methods = [
    // 方法 1: 直接使用 fetch
    async () => {
      console.log(`[方法 1] 直接使用 fetch: ${url}`);
      const response = await fetch(url, {
        ...options,
        mode: 'cors',
        credentials: 'omit'
      });
      return await response.json();
    },
    
    // 方法 2: 使用相對路徑
    async () => {
      const relativeUrl = url.replace('https://cdn.sit.crm.ddpay.ai/data', '/api');
      console.log(`[方法 2] 使用相對路徑: ${relativeUrl}`);
      const response = await fetch(relativeUrl, {
        ...options,
        credentials: 'omit'
      });
      return await response.json();
    },
    
    // 方法 3: 使用代理服務
    async () => {
      console.log(`[方法 3] 使用代理服務: ${url}`);
      return await fetchViaProxy(url, options);
    }
  ];
  
  // 嘗試所有方法
  for (let i = 0; i < methods.length; i++) {
    try {
      return await methods[i]();
    } catch (error) {
      console.warn(`[方法 ${i+1}] 失敗: ${error.message}`);
      if (i === methods.length - 1) {
        throw error; // 如果是最後一個方法，則拋出錯誤
      }
    }
  }
}

export default {
  fetchViaProxy,
  fetchWithFallback
};