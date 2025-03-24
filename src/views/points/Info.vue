<template>
  <div class="page-container">
    <!-- 固定標頭 -->
    <header class="header">
        <div class="header-content">
            <button class="back-button" @click="$router.go(-1)">
                <span class="material-icons">arrow_back</span>
            </button>
            <h1 class="page-title">點數說明</h1>
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
        <p>{{ error.message || '無法載入點數說明，請稍後再試' }}</p>
        <button @click="fetchTermsContent" class="retry-button">重試</button>
      </div>

      <!-- 點數說明內容 -->
      <div v-else class="points-info-content">
        <section class="terms-section" v-html="formattedTermsContent"></section>
      </div>
    </main>

    <!-- 底部導航 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Footer from '@/components/Footer.vue';
import axios from 'axios';

// 狀態變數
const termsContent = ref('');
const loading = ref(true);
const error = ref(null);

// 格式化條款內容
const formattedTermsContent = computed(() => {
  if (!termsContent.value) return '';
  
  // 將原始文本轉換為HTML格式
  return termsContent.value
    // 處理標題 (數字開頭的行)
    .replace(/(\d+\.[\w\u4e00-\u9fa5]+)/g, '<h2>$1</h2>')
    // 處理列表項 (o開頭的行)
    .replace(/o([\w\u4e00-\u9fa5].+)/g, '<li>$1</li>')
    // 將連續的列表項包裝在ul標籤中
    .replace(/(<li>.+<\/li>)(\s*<li>.+<\/li>)+/g, '<ul>$&</ul>')
    // 處理段落 (非標題非列表的行)
    .replace(/^(?!<h2>|<li>|<ul>)(.+)$/gm, '<p>$1</p>')
    // 修復可能的嵌套問題
    .replace(/<ul>(<li>.+<\/li>)<ul>/g, '<ul>$1')
    .replace(/<\/ul>(<li>.+<\/li>)<\/ul>/g, '$1</ul>');
});

// 獲取條款內容
const fetchTermsContent = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await axios.get('https://cdn.sit.crm.ddpay.ai/data/boday_test/tree_cache.json');
    if (response.data && response.data.contents && response.data.contents[0] && response.data.contents[0].content) {
      // 獲取內容並替換\r\n為實際換行
      termsContent.value = response.data.contents[0].content.replace(/\\r\\n/g, '\n');
    } else {
      throw new Error('無法獲取條款內容');
    }
  } catch (err) {
    console.error('獲取條款內容失敗:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

// 組件掛載時獲取條款內容
onMounted(() => {
  fetchTermsContent();
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

/* 點數說明頁面特定樣式 */
.points-info-content {
  background-color: var(--white);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 由於使用v-html，需要使用:deep()來樣式化動態內容 */
:deep(h2) {
  font-size: 18px;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 12px;
  color: var(--heading);
}

:deep(h2:first-child) {
  margin-top: 0;
}

:deep(p) {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text);
  margin-bottom: 16px;
}

:deep(ul) {
  padding-left: 20px;
  margin-bottom: 16px;
}

:deep(li) {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text);
  margin-bottom: 8px;
  list-style-type: disc;
}

/* 適配移動設備 */
@media (max-width: 768px) {
  .points-info-content {
    padding: 16px;
  }
  
  :deep(h2) {
    font-size: 16px;
  }
  
  :deep(p),
  :deep(li) {
    font-size: 13px;
  }
}
</style>
