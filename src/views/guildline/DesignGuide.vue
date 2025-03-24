<!-- src/views/guildline/DesignGuide.vue -->
<template>
    <div class="container">
        <h1 class="section-title">01</h1>

        <!-- 顏色部分 -->
        <section class="color-section">
            <h2>Color</h2>
            <div class="color-grid">
                <div class="color-item">
                    <div class="color-preview" style="background-color: var(--primary);"></div>
                    <div class="color-info">
                        <div class="color-name">Primary</div>
                        <div class="color-hex">{{ getHex('--primary') }}</div>
                    </div>
                </div>
                <div class="color-item">
                    <div class="color-preview" style="background-color: var(--down);"></div>
                    <div class="color-info">
                        <div class="color-name">Down</div>
                        <div class="color-hex">{{ getHex('--down') }}</div>
                    </div>
                </div>
                <div class="color-item">
                    <div class="color-preview" style="background-color: var(--up);"></div>
                    <div class="color-info">
                        <div class="color-name">Up</div>
                        <div class="color-hex">{{ getHex('--up') }}</div>
                    </div>
                </div>
                <div class="color-item">
                    <div class="color-preview" style="background-color: var(--white);"></div>
                    <div class="color-info">
                        <div class="color-name">白</div>
                        <div class="color-hex">{{ getHex('--white') }}</div>
                    </div>
                </div>
                <div class="color-item">
                    <div class="color-preview" style="background-color: var(--background-light);"></div>
                    <div class="color-info">
                        <div class="color-name">Bg-light/頁面底色</div>
                        <div class="color-hex">{{ getHex('--background-light') }}</div>
                    </div>
                </div>
                <div class="color-item">
                    <div class="color-preview" style="background-color: var(--table-striped);"></div>
                    <div class="color-info">
                        <div class="color-name">table-striped</div>
                        <div class="color-hex">{{ getHex('--table-striped') }}</div>
                    </div>
                </div>
                <div class="color-item">
                    <div class="color-preview" style="background-color: var(--border-disabled);"></div>
                    <div class="color-info">
                        <div class="color-name">Border/Disabled</div>
                        <div class="color-hex">{{ getHex('--border-disabled') }}</div>
                    </div>
                </div>
                <div class="color-item">
                    <div class="color-preview" style="background-color: var(--placeholder);"></div>
                    <div class="color-info">
                        <div class="color-name">欄位說明 placeholder</div>
                        <div class="color-hex">{{ getHex('--placeholder') }}</div>
                    </div>
                </div>
                <div class="color-item">
                    <div class="color-preview" style="background-color: var(--body-text);"></div>
                    <div class="color-info">
                        <div class="color-name">全站文字/次標題</div>
                        <div class="color-hex">{{ getHex('--body-text') }}</div>
                    </div>
                </div>
                <div class="color-item">
                    <div class="color-preview" style="background-color: var(--heading);"></div>
                    <div class="color-info">
                        <div class="color-name">主標題</div>
                        <div class="color-hex">{{ getHex('--heading') }}</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 類型部分 -->
        <section class="typography-section">
            <h2>Type</h2>
            <div v-for="type in typography" :key="type.name" class="type-item">
                <div class="type-name">{{ type.name }}</div>
                <component :is="type.tag" :class="type.className" v-html="type.content"></component>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 動態獲取 CSS 變數的顏色值
const getHex = (varName) => {
    const style = getComputedStyle(document.documentElement);
    const color = style.getPropertyValue(varName).trim();
    return color; // 返回實際的顏色值，例如 #FF3333
};

// 文字樣式資料
const typography = ref([
    {
        name: '內文',
        tag: 'p',
        className: 'body-text',
        content: '簡報段落是文章中最基本的單位，從內容上說，它具有一個獨立完整的意思。在文學寫作中，段與段之間常常只有一行間距。',
    },
    {
        name: '文字連結',
        tag: 'a',
        className: 'text-link',
        content: '文字連結',
    },
    {
        name: 'Heading1',
        tag: 'h1',
        className: 'heading-1',
        content: 'h1. Bootstrap',
    },
    {
        name: 'Heading2',
        tag: 'h2',
        className: 'heading-2',
        content: 'h2. Bootstrap',
    },
    {
        name: 'Heading3',
        tag: 'h3',
        className: 'heading-3',
        content: 'h3. Bootstrap',
    },
    {
        name: '備註',
        tag: 'p',
        className: 'note-text',
        content: '備註/提示型文字',
    },
    {
        name: '強調文字',
        tag: 'p',
        className: 'emphasis-text',
        content: '強調文字',
    },
]);

// 可選：頁面載入時檢查顏色值（用於除錯）
onMounted(() => {
    console.log('Primary Color:', getHex('--primary'));
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

// 容器
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: var(--font-family);
    color: var(--body-text);
    line-height: 1.5;
    background-color: var(--background-light);
}

// 章節標題
.section-title {
    font-size: var(--font-size-h1);
    color: var(--heading);
    margin-bottom: 2rem;
    font-weight: 500;
    text-align: center;
}

// 顏色區塊
.color-section {
    margin-bottom: 3rem;

    h2 {
        font-size: var(--font-size-h2);
        color: var(--heading);
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .color-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        padding: 1rem;
    }

    .color-item {
        padding: 1rem;
        border-radius: 8px;
        background-color: var(--white);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    .color-preview {
        width: 100%;
        height: 100px;
        border-radius: 4px;
        margin-bottom: 1rem;
        border: 1px solid var(--border-disabled);
    }

    .color-info {
        font-size: var(--font-size-body);
    }

    .color-name {
        font-weight: 500;
        color: var(--body-text);
        margin-bottom: 0.5rem;
    }

    .color-hex {
        color: var(--placeholder);
        font-size: var(--font-size-note);
    }
}

// 文字樣式區塊
.typography-section {
    margin-bottom: 3rem;

    h2 {
        font-size: var(--font-size-h2);
        color: var(--heading);
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .type-item {
        margin-bottom: 2rem;
        padding: 1rem;
        border-radius: 8px;
        background-color: var(--white);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    .type-name {
        font-size: var(--font-size-note);
        color: var(--placeholder);
        margin-bottom: 0.5rem;
    }

    .body-text {
        font-size: var(--font-size-body);
        color: var(--body-text);
    }

    .text-link {
        font-size: var(--font-size-body);
        color: var(--primary);
        text-decoration: none;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }

    .heading-1 {
        font-size: var(--font-size-h1);
        color: var(--heading);
        margin-bottom: 1rem;
    }

    .heading-2 {
        font-size: var(--font-size-h2);
        color: var(--heading);
        margin-bottom: 0.875rem;
    }

    .heading-3 {
        font-size: var(--font-size-h3);
        color: var(--heading);
        margin-bottom: 0.75rem;
    }

    .note-text {
        font-size: var(--font-size-note);
        color: var(--placeholder);
    }

    .emphasis-text {
        font-size: var(--font-size-body);
        color: var(--primary);
        font-weight: 500;
    }
}
</style>
