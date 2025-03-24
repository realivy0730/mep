<template>
    <div class="page-container">

        <!-- 固定標頭 -->
        <header class="header">
            <div class="header-content">
                <button class="back-button" @click="$router.go(-1)">
                    <span class="material-icons">arrow_back</span>
                </button>
                <h1 class="page-title">會員條款</h1>
                <div class="header-right"></div>
            </div>
        </header>

        <main class="main-content">
            <div class="terms-container" ref="termsContainer" @scroll="handleScroll">
                <div class="terms-section">
                    <h3>一、總則</h3>
                    <p>歡迎您使用我們的會員服務。本條款旨在說明您使用我們服務時的權利與義務，請您詳細閱讀。當您註冊成為會員或使用我們的服務時，即表示您已閱讀、理解並同意接受本條款的所有內容。</p>
                </div>

                <div class="terms-section">
                    <h3>二、會員資格與帳號</h3>
                    <p>2.1 您必須年滿18歲或依照當地法律規定的法定年齡，方可註冊成為會員。</p>
                    <p>2.2 您必須提供真實、準確、完整的個人資料，並在資料變更時及時更新。</p>
                    <p>2.3 您應妥善保管帳號密碼，所有使用您帳號和密碼進行的操作均視為您本人的行為。</p>
                    <p>2.4 如發現帳號遭盜用或安全漏洞，請立即通知我們。</p>
                </div>

                <div class="terms-section">
                    <h3>三、會員權益與服務</h3>
                    <p>3.1 會員可享有專屬優惠、積分累積與兌換、活動參與等權益。</p>
                    <p>3.2 會員等級與相關權益可能會依據您的消費金額、頻率等因素進行調整。</p>
                    <p>3.3 我們保留隨時調整會員服務內容的權利，調整前將透過官方網站或電子郵件等方式通知。</p>
                </div>

                <div class="terms-section">
                    <h3>四、隱私權保護</h3>
                    <p>4.1 我們重視您的隱私，將依照隱私權政策收集、處理及利用您的個人資料。</p>
                    <p>4.2 您同意我們可能會將您的資料用於提供服務、改善體驗、發送通知等用途。</p>
                    <p>4.3 未經您的同意，我們不會將您的個人資料提供給第三方，但法律要求或為保護我們權益的情況除外。</p>
                </div>

                <div class="terms-section">
                    <h3>五、會員義務與禁止行為</h3>
                    <p>5.1 您應遵守所有適用的法律法規及本條款的規定。</p>
                    <p>5.2 禁止使用我們的服務從事任何非法、欺詐、侵權或不當行為。</p>
                    <p>5.3 禁止干擾或破壞我們服務的正常運作。</p>
                    <p>5.4 禁止冒充他人或提供虛假資訊。</p>
                </div>

                <div class="terms-section">
                    <h3>六、智慧財產權</h3>
                    <p>6.1 我們的網站、應用程式及服務中的所有內容，包括但不限於文字、圖像、標誌、設計等，均受智慧財產權法律保護。</p>
                    <p>6.2 未經我們明確書面許可，您不得複製、修改、傳播或使用這些內容。</p>
                </div>

                <div class="terms-section">
                    <h3>七、責任限制</h3>
                    <p>7.1 我們將盡力確保服務的安全性和穩定性，但不對服務中斷或資料損失承擔責任。</p>
                    <p>7.2 對於因使用或無法使用我們服務而導致的任何直接或間接損失，我們不承擔責任。</p>
                </div>

                <div class="terms-section">
                    <h3>八、條款修改</h3>
                    <p>8.1 我們保留隨時修改本條款的權利。修改後的條款將在官方網站上公布。</p>
                    <p>8.2 修改後，如您繼續使用我們的服務，即表示您接受修改後的條款。</p>
                </div>

                <div class="terms-section">
                    <h3>九、終止服務</h3>
                    <p>9.1 您可以隨時申請終止會員資格。</p>
                    <p>9.2 如您違反本條款，我們有權暫停或終止您的會員資格。</p>
                </div>

                <div class="terms-section">
                    <h3>十、適用法律與爭議解決</h3>
                    <p>10.1 本條款的解釋、效力及其他相關事項，均依照中華民國法律規定。</p>
                    <p>10.2 因本條款所生的爭議，雙方同意以台灣台北地方法院為第一審管轄法院。</p>
                </div>

                <div class="terms-section">
                    <h3>十一、聯絡方式</h3>
                    <p>如您對本條款有任何疑問，請透過以下方式聯絡我們：</p>
                    <p>電子郵件：service@reddoor.com.tw</p>
                    <p>客服電話：02-1234-5678</p>
                </div>
            </div>

            <!-- 同意按鈕 -->
            <div class="action-button-container">
                <button class="agree-button" :class="{ 'agree-button-enabled': hasScrolledToBottom }"
                    :disabled="!hasScrolledToBottom" @click="agreeToTerms">
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
const termsContainer = ref(null);
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
    if (!termsContainer.value) return;

    // 如果按鈕還未啟用，則自動滾到底部
    if (!hasScrolledToBottom.value) {
        // 用戶第一次滾動時自動滾到底部
        scrollToBottom();

        // 設置為已滾動到底部，啟用按鈕
        hasScrolledToBottom.value = true;

        // 移除滾動事件監聽器，這樣用戶後續可以自由滾動
        termsContainer.value.removeEventListener('scroll', handleScroll);
    }
};

/**
 * 同意條款
 */
const agreeToTerms = () => {
    if (!hasScrolledToBottom.value) return;

    // 儲存用戶已同意條款的狀態
    localStorage.setItem('memberTermsAgreed', 'true');
    localStorage.setItem('memberTermsAgreedDate', new Date().toISOString());
    
    // 設置一個標記，表示用戶剛剛同意了條款
    localStorage.setItem('justAgreedMemberTerms', 'true');

    // 返回上一頁
    router.back();
};

/**
 * 快速滾動到底部的功能
 */
const scrollToBottom = () => {
    if (termsContainer.value) {
        termsContainer.value.scrollTop = termsContainer.value.scrollHeight;
    }
};

onMounted(() => {
    // 監聽滾動事件
    if (termsContainer.value) {
        termsContainer.value.addEventListener('scroll', handleScroll);
    }
});
</script>

<style scoped>
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.terms-container {
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

.terms-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
    text-align: center;
}

.terms-date {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
    text-align: center;
}

.terms-section {
    margin-bottom: var(--spacing-lg);
}

.terms-section h3 {
    font-size: var(--font-size-lg);
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
}

.terms-section p {
    font-size: var(--font-size-body);
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-sm);
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
    .terms-container {
        padding: var(--spacing-md);
        margin: var(--spacing-sm);
    }
}
</style>
