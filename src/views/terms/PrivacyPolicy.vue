<template>
    <div class="page-container">


        <!-- 固定標頭 -->
        <header class="header">
            <div class="header-content">
                <button class="back-button" @click="$router.go(-1)">
                    <span class="material-icons">arrow_back</span>
                </button>
                <h1 class="page-title">隱私權政策</h1>
                <div class="header-right"></div>
            </div>
        </header>

        <main class="main-content">
            <div class="privacy-container" ref="privacyContainer" @scroll="handleScroll">
                <div class="privacy-section">
                    <h3>一、前言</h3>
                    <p>感謝您使用我們的服務。我們重視您的隱私，並致力於保護您的個人資料。本隱私權政策旨在說明我們如何收集、使用、儲存和保護您的個人資料，以及您對這些資料的權利。請您詳細閱讀本政策，以了解我們對您個人資料的處理方式。
                    </p>
                </div>

                <div class="privacy-section">
                    <h3>二、資料收集</h3>
                    <p>2.1
                        <strong>您主動提供的資料</strong>：當您註冊帳號、使用我們的服務或參與活動時，我們可能會收集您提供的個人資料，包括但不限於：姓名、聯絡方式、電子郵件地址、出生日期、性別等。
                    </p>
                    <p>2.2 <strong>自動收集的資料</strong>：當您使用我們的網站或應用程式時，我們可能會自動收集某些資料，如IP地址、瀏覽器類型、裝置資訊、使用時間、瀏覽記錄等。</p>
                    <p>2.3 <strong>第三方來源的資料</strong>：在某些情況下，我們可能會從合作夥伴或公開來源獲取您的資料，以補充我們已有的資料。</p>
                </div>

                <div class="privacy-section">
                    <h3>三、資料使用</h3>
                    <p>我們可能會將您的個人資料用於以下目的：</p>
                    <p>3.1 提供、維護和改善我們的服務。</p>
                    <p>3.2 處理您的訂單、付款和退款。</p>
                    <p>3.3 發送服務通知、更新和促銷資訊。</p>
                    <p>3.4 回應您的問題和請求。</p>
                    <p>3.5 分析使用趨勢和優化用戶體驗。</p>
                    <p>3.6 防止欺詐和確保安全。</p>
                    <p>3.7 遵守法律義務。</p>
                </div>

                <div class="privacy-section">
                    <h3>四、資料分享</h3>
                    <p>除非有以下情況，否則我們不會與第三方分享您的個人資料：</p>
                    <p>4.1 <strong>經您同意</strong>：在獲得您的明確同意後，我們可能會與特定第三方分享您的資料。</p>
                    <p>4.2 <strong>服務提供商</strong>：我們可能會與協助我們提供服務的第三方服務提供商分享必要的資料，如支付處理、資料分析、電子郵件發送等。</p>
                    <p>4.3 <strong>法律要求</strong>：如法律要求、法院命令或政府機構的合法要求，我們可能會披露您的資料。</p>
                    <p>4.4 <strong>保護權益</strong>：為保護我們或他人的權利、財產或安全，我們可能會披露必要的資料。</p>
                </div>

                <div class="privacy-section">
                    <h3>五、資料安全</h3>
                    <p>5.1 我們採取適當的技術和組織措施來保護您的個人資料，防止未經授權的訪問、使用或披露。</p>
                    <p>5.2 儘管我們努力保護您的資料，但網際網路傳輸和電子儲存並非絕對安全，我們無法保證資料的絕對安全。</p>
                </div>

                <div class="privacy-section">
                    <h3>六、資料保留</h3>
                    <p>我們會在必要的時間內保留您的個人資料，以實現本政策中描述的目的，除非法律要求或允許更長的保留期限。</p>
                </div>

                <div class="privacy-section">
                    <h3>七、您的權利</h3>
                    <p>根據適用的資料保護法律，您可能擁有以下權利：</p>
                    <p>7.1 <strong>訪問權</strong>：您有權獲取我們持有的關於您的個人資料副本。</p>
                    <p>7.2 <strong>更正權</strong>：您有權要求更正不準確或不完整的個人資料。</p>
                    <p>7.3 <strong>刪除權</strong>：在某些情況下，您有權要求刪除您的個人資料。</p>
                    <p>7.4 <strong>限制處理權</strong>：在某些情況下，您有權要求限制處理您的個人資料。</p>
                    <p>7.5 <strong>資料可攜權</strong>：您有權以結構化、常用和機器可讀的格式接收您的個人資料，並有權將這些資料傳輸給另一個控制者。</p>
                    <p>7.6 <strong>反對權</strong>：在某些情況下，您有權反對處理您的個人資料。</p>
                </div>

                <div class="privacy-section">
                    <h3>八、Cookie 和類似技術</h3>
                    <p>8.1 我們使用 Cookie 和類似技術來收集和使用資料，以提供、維護和改善我們的服務。</p>
                    <p>8.2 您可以通過瀏覽器設置來控制或刪除 Cookie，但這可能會影響某些服務功能的使用。</p>
                </div>

                <div class="privacy-section">
                    <h3>九、兒童隱私</h3>
                    <p>我們的服務不面向未滿18歲的兒童。如果我們發現已收集了未滿18歲兒童的個人資料，我們會採取措施刪除這些資料。</p>
                </div>

                <div class="privacy-section">
                    <h3>十、政策更新</h3>
                    <p>10.1 我們可能會不時更新本隱私權政策，更新後的政策將在我們的網站上發布。</p>
                    <p>10.2 重大變更時，我們可能會通過電子郵件或網站通知等方式通知您。</p>
                    <p>10.3 繼續使用我們的服務即表示您接受更新後的隱私權政策。</p>
                </div>

                <div class="privacy-section">
                    <h3>十一、聯絡我們</h3>
                    <p>如您對本隱私權政策有任何疑問或需要行使您的權利，請通過以下方式聯絡我們：</p>
                    <p>電子郵件：privacy@reddoor.com.tw</p>
                    <p>客服電話：02-1234-5678</p>
                </div>
            </div>

            <!-- 同意按鈕 -->
            <div class="action-button-container">
                <button class="agree-button" :class="{ 'agree-button-enabled': hasScrolledToBottom }"
                    :disabled="!hasScrolledToBottom" @click="agreeToPrivacy">
                    我同意
                </button>
            </div>
        </main>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();
const privacyContainer = ref(null);
const hasScrolledToBottom = ref(false);

/**
 * 返回上一頁
 */
const goBack = () => {
    router.back();
};

/**
 * 處理滾動事件 - 用戶第一次滾動時自動滾到底部並啟用按鈕
 */
const handleScroll = () => {
    if (!privacyContainer.value) return;

    // 如果按鈕還未啟用，則自動滾到底部
    if (!hasScrolledToBottom.value) {
        // 用戶第一次滾動時自動滾到底部
        scrollToBottom();

        // 設置為已滾動到底部，啟用按鈕
        hasScrolledToBottom.value = true;

        // 移除滾動事件監聽器，這樣用戶後續可以自由滾動
        privacyContainer.value.removeEventListener('scroll', handleScroll);
    }
};

/**
 * 同意隱私權政策
 */
const agreeToPrivacy = () => {
    if (!hasScrolledToBottom.value) return;

    // 儲存用戶已同意隱私權政策的狀態
    localStorage.setItem('privacyPolicyAgreed', 'true');
    localStorage.setItem('privacyPolicyAgreedDate', new Date().toISOString());
    
    // 設置一個標記，表示用戶剛剛同意了隱私權政策
    localStorage.setItem('justAgreedPrivacyPolicy', 'true');

    // 返回上一頁
    router.back();
};

/**
 * 快速滾動到底部的功能
 */
const scrollToBottom = () => {
    if (privacyContainer.value) {
        privacyContainer.value.scrollTop = privacyContainer.value.scrollHeight;
    }
};

onMounted(() => {
    // 監聽滾動事件
    if (privacyContainer.value) {
        privacyContainer.value.addEventListener('scroll', handleScroll);
    }
});
</script>

<style scoped>
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.privacy-container {
    padding: var(--spacing-lg);
    background-color: var(--white);
    border-radius: var(--border-radius);
    margin: var(--spacing-md);
    box-shadow: var(--shadow-sm);
    overflow-y: auto;
    max-height: calc(100vh - 180px);
    /* 留出底部按鈕的空間 */
    flex: 1;
}

.privacy-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
    text-align: center;
}

.privacy-date {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
    text-align: center;
}

.privacy-section {
    margin-bottom: var(--spacing-lg);
}

.privacy-section h3 {
    font-size: var(--font-size-lg);
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
}

.privacy-section p {
    font-size: var(--font-size-body);
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-sm);
}

.privacy-section strong {
    font-weight: 500;
    color: var(--text-primary);
}

/* 底部檢測器 - 隱藏但用於檢測滾動到底部 */
.bottom-detector {
    height: 1px;
    width: 100%;
    opacity: 0;
}


/* 同意按鈕 */
.agree-button {
    width: 100%;
    padding: var(--spacing-md);
    border: none;
    border-radius: var(--border-radius);
    font-size: var(--font-size-md);
    font-weight: 500;
    cursor: not-allowed;
    transition: all 0.3s ease;
    background-color: var(--border-disabled);
    color: var(--text-tertiary);
}

.agree-button-enabled {
    background-color: var(--primary);
    color: var(--white);
    cursor: pointer;
}

/* 響應式設計 */
@media (max-width: 768px) {
    .privacy-container {
        padding: var(--spacing-md);
        margin: var(--spacing-sm);
    }
}
</style>
