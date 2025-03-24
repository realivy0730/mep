<template>
  <div class="data-display">
    <div v-if="loading" class="loading">
      <font-awesome-icon icon="spinner" spin />
      <span>載入中...</span>
    </div>
    <div v-else>
      <!-- 個人檔案區塊 -->
      <div v-if="profileData" class="profile-section">
        <h2>個人檔案</h2>
        <div class="profile-card">
          <div class="profile-header">
            <img v-if="profileData.avatar" :src="profileData.avatar" alt="頭像" class="avatar" />
            <div v-else class="avatar-placeholder">
              <font-awesome-icon icon="user" />
            </div>
            <div class="profile-info">
              <h3>{{ profileData.name || '未知用戶' }}</h3>
              <p v-if="profileData.email">{{ profileData.email }}</p>
              <p v-if="profileData.phone">{{ profileData.phone }}</p>
            </div>
          </div>
          <div class="profile-stats">
            <div class="stat-item">
              <font-awesome-icon icon="coins" />
              <span>{{ pointData?.total || 0 }} 點</span>
            </div>
            <div class="stat-item">
              <font-awesome-icon icon="ticket-alt" />
              <span>{{ couponData?.total || 0 }} 張票券</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 商戶資料區塊 -->
      <div v-if="merchantData" class="merchant-section">
        <h2>商戶資料</h2>
        <div class="merchant-list">
          <div v-for="merchant in merchantList" :key="merchant.id" class="merchant-card">
            <img v-if="merchant.image" :src="merchant.image" alt="商戶圖片" class="merchant-image" />
            <div v-else class="image-placeholder">
              <font-awesome-icon icon="store" />
            </div>
            <div class="merchant-info">
              <h3>{{ merchant.name }}</h3>
              <p v-if="merchant.description">{{ merchant.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 票券資料區塊 -->
      <div v-if="couponData && couponData.items" class="coupon-section">
        <h2>票券資料</h2>
        <div class="coupon-list">
          <div v-for="coupon in couponData.items" :key="coupon.id" class="coupon-card">
            <div class="coupon-header">
              <h3>{{ coupon.name }}</h3>
              <span class="coupon-status" :class="getCouponStatusClass(coupon.status)">
                {{ getCouponStatusText(coupon.status) }}
              </span>
            </div>
            <div class="coupon-details">
              <p v-if="coupon.description">{{ coupon.description }}</p>
              <p v-if="coupon.expiry">有效期至: {{ formatDate(coupon.expiry) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 點數資料區塊 -->
      <div v-if="pointData && pointData.history" class="point-section">
        <h2>點數資料</h2>
        <div class="point-total">
          <font-awesome-icon icon="coins" />
          <span>總點數: {{ pointData.total || 0 }}</span>
        </div>
        <div class="point-history">
          <h3>點數歷史</h3>
          <div v-for="(record, index) in pointData.history" :key="index" class="point-record">
            <div class="record-info">
              <p class="record-title">{{ record.description || '點數變動' }}</p>
              <p class="record-date">{{ formatDate(record.date) }}</p>
            </div>
            <div class="record-amount" :class="{ 'positive': record.amount > 0, 'negative': record.amount < 0 }">
              {{ record.amount > 0 ? '+' : '' }}{{ record.amount }}
            </div>
          </div>
        </div>
      </div>

      <!-- 錯誤訊息 -->
      <div v-if="error" class="error-message">
        <font-awesome-icon icon="exclamation-circle" />
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { DataService } from '../services/dataService';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default defineComponent({
  name: 'DataDisplay',
  components: {
    FontAwesomeIcon
  },
  setup() {
    const loading = ref(true);
    const error = ref('');
    const merchantData = ref<any>(null);
    const couponData = ref<any>(null);
    const pointData = ref<any>(null);
    const profileData = ref<any>(null);
    const merchantList = ref<any[]>([]);

    // 載入所有資料
    const loadAllData = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        // 並行獲取所有資料以提高效率
        const [merchantResult, couponResult, pointResult, profileResult] = await Promise.allSettled([
          DataService.getMerchantData(),
          DataService.getCouponData(),
          DataService.getPointData(),
          DataService.getProfileData()
        ]);

        // 處理商戶資料
        if (merchantResult.status === 'fulfilled') {
          merchantData.value = merchantResult.value;
          processmerchantData();
        } else {
          console.error('獲取商戶資料失敗:', merchantResult.reason);
        }

        // 處理票券資料
        if (couponResult.status === 'fulfilled') {
          couponData.value = couponResult.value;
        } else {
          console.error('獲取票券資料失敗:', couponResult.reason);
        }

        // 處理點數資料
        if (pointResult.status === 'fulfilled') {
          pointData.value = pointResult.value;
        } else {
          console.error('獲取點數資料失敗:', pointResult.reason);
        }

        // 處理個人檔案資料
        if (profileResult.status === 'fulfilled') {
          profileData.value = profileResult.value;
        } else {
          console.error('獲取個人檔案資料失敗:', profileResult.reason);
        }

        // 檢查是否所有資料都獲取失敗
        if (
          merchantResult.status === 'rejected' &&
          couponResult.status === 'rejected' &&
          pointResult.status === 'rejected' &&
          profileResult.status === 'rejected'
        ) {
          error.value = '無法獲取資料，請檢查網路連線或稍後再試';
        }
      } catch (err) {
        console.error('載入資料時發生錯誤:', err);
        error.value = '載入資料時發生錯誤';
      } finally {
        loading.value = false;
      }
    };

    // 處理商戶資料
    const processmerchantData = () => {
      if (!merchantData.value) return;

      // 根據實際API回應結構調整此處邏輯
      if (Array.isArray(merchantData.value.brands)) {
        merchantList.value = merchantData.value.brands.map((brand: any) => ({
          id: brand.id || '',
          name: brand.name || '未命名商戶',
          image: brand.logo_image || brand.image || '',
          description: brand.description || ''
        }));
      } else if (merchantData.value.brands && typeof merchantData.value.brands === 'object') {
        // 如果brands是物件，將其轉為陣列
        merchantList.value = Object.values(merchantData.value.brands).map((brand: any) => ({
          id: brand.id || '',
          name: brand.name || '未命名商戶',
          image: brand.logo_image || brand.image || '',
          description: brand.description || ''
        }));
      } else {
        // 嘗試其他可能的資料結構
        merchantList.value = [];
        
        // 如果資料是陣列，直接使用
        if (Array.isArray(merchantData.value)) {
          merchantList.value = merchantData.value.map((item: any) => ({
            id: item.id || '',
            name: item.name || '未命名商戶',
            image: item.logo_image || item.image || '',
            description: item.description || ''
          }));
        }
        // 如果資料是物件，嘗試找出商戶資料
        else if (typeof merchantData.value === 'object') {
          // 尋找可能包含商戶資料的屬性
          for (const key in merchantData.value) {
            if (Array.isArray(merchantData.value[key])) {
              merchantList.value = merchantData.value[key].map((item: any) => ({
                id: item.id || '',
                name: item.name || '未命名商戶',
                image: item.logo_image || item.image || '',
                description: item.description || ''
              }));
              if (merchantList.value.length > 0) break;
            }
          }
        }
      }
    };

    // 格式化日期
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      } catch (err) {
        return dateString;
      }
    };

    // 獲取票券狀態樣式
    const getCouponStatusClass = (status: string) => {
      switch (status?.toLowerCase()) {
        case 'valid':
        case 'active':
          return 'status-valid';
        case 'used':
          return 'status-used';
        case 'expired':
          return 'status-expired';
        default:
          return '';
      }
    };

    // 獲取票券狀態文字
    const getCouponStatusText = (status: string) => {
      switch (status?.toLowerCase()) {
        case 'valid':
        case 'active':
          return '有效';
        case 'used':
          return '已使用';
        case 'expired':
          return '已過期';
        default:
          return status || '未知';
      }
    };

    // 組件掛載時載入資料
    onMounted(() => {
      loadAllData();
    });

    return {
      loading,
      error,
      merchantData,
      couponData,
      pointData,
      profileData,
      merchantList,
      formatDate,
      getCouponStatusClass,
      getCouponStatusText,
      loadAllData
    };
  }
});
</script>

<style scoped lang="scss">
.data-display {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    margin-top: 30px;
    margin-bottom: 15px;
    color: #333;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    color: #666;
    
    svg {
      font-size: 2rem;
      margin-bottom: 10px;
    }
  }

  .error-message {
    background-color: #fff3f3;
    border-left: 4px solid #ff4d4f;
    padding: 15px;
    margin: 20px 0;
    color: #cf1322;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 10px;
    }
  }

  // 個人檔案樣式
  .profile-section {
    .profile-card {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      
      .profile-header {
        display: flex;
        padding: 20px;
        background-color: #f8f9fa;
        
        .avatar, .avatar-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin-right: 20px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e0e0e0;
          
          svg {
            font-size: 2rem;
            color: #999;
          }
        }
        
        .profile-info {
          h3 {
            margin: 0 0 10px;
            font-size: 1.4rem;
          }
          
          p {
            margin: 5px 0;
            color: #666;
          }
        }
      }
      
      .profile-stats {
        display: flex;
        border-top: 1px solid #eee;
        
        .stat-item {
          flex: 1;
          padding: 15px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          
          &:not(:last-child) {
            border-right: 1px solid #eee;
          }
          
          svg {
            font-size: 1.5rem;
            margin-bottom: 5px;
            color: #1890ff;
          }
          
          span {
            font-weight: bold;
          }
        }
      }
    }
  }

  // 商戶資料樣式
  .merchant-section {
    .merchant-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      
      .merchant-card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: transform 0.2s;
        
        &:hover {
          transform: translateY(-5px);
        }
        
        .merchant-image, .image-placeholder {
          height: 160px;
          width: 100%;
          object-fit: cover;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          
          svg {
            font-size: 3rem;
            color: #ccc;
          }
        }
        
        .merchant-info {
          padding: 15px;
          
          h3 {
            margin: 0 0 10px;
            font-size: 1.2rem;
          }
          
          p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
          }
        }
      }
    }
  }

  // 票券資料樣式
  .coupon-section {
    .coupon-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      
      .coupon-card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 15px;
        
        .coupon-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          
          h3 {
            margin: 0;
            font-size: 1.1rem;
          }
          
          .coupon-status {
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: bold;
            
            &.status-valid {
              background-color: #e6f7ff;
              color: #1890ff;
            }
            
            &.status-used {
              background-color: #f5f5f5;
              color: #999;
            }
            
            &.status-expired {
              background-color: #fff2e8;
              color: #fa8c16;
            }
          }
        }
        
        .coupon-details {
          p {
            margin: 5px 0;
            color: #666;
            font-size: 0.9rem;
          }
        }
      }
    }
  }

  // 點數資料樣式
  .point-section {
    .point-total {
      background-color: #f6ffed;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      
      svg {
        color: #52c41a;
        font-size: 1.5rem;
        margin-right: 10px;
      }
      
      span {
        font-size: 1.2rem;
        font-weight: bold;
      }
    }
    
    .point-history {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 15px;
      
      h3 {
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 1.1rem;
      }
      
      .point-record {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        
        &:not(:last-child) {
          border-bottom: 1px solid #f0f0f0;
        }
        
        .record-info {
          .record-title {
            margin: 0 0 5px;
            font-weight: 500;
          }
          
          .record-date {
            margin: 0;
            font-size: 0.8rem;
            color: #999;
          }
        }
        
        .record-amount {
          font-weight: bold;
          
          &.positive {
            color: #52c41a;
          }
          
          &.negative {
            color: #f5222d;
          }
        }
      }
    }
  }
}

// 響應式調整
@media (max-width: 768px) {
  .data-display {
    padding: 15px;
    
    .merchant-section .merchant-list,
    .coupon-section .coupon-list {
      grid-template-columns: 1fr;
    }
    
    .profile-section .profile-card .profile-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
      
      .avatar, .avatar-placeholder {
        margin-right: 0;
        margin-bottom: 15px;
      }
    }
  }
}
</style>