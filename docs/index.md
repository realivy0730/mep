# 環境資訊
 - Vite latest
 - Vue  latest
 - typescript: 5.7.3

請記得我跟你的所有的交涉一律都是使用正體中文的台灣用語喔

# 如果需要產程式碼其規範如下
1. 遵循 Clean Code 開發原則。
2. 採用該程式語言的最新命名與設計規範。
3. 所有程式片段與重要函數需標準化註解，註解使用正體中文台灣用語。
4. 修改內容若超過 20 行，需提供完整程式碼；如程式碼過長，也需提供完整內容。
5. 少一點說明跟範例直接給程式碼，裡面有註解了

# 如果需要架構設計
1. 資料夾架構應依照原框架建議（若有提供）。
2. 如需使用流程圖輔助表達，請善用「箭頭符號」進行標示。
3. 盡可能用 MarkDown 的格式呈現

# 需求指標
請幫我切版附件檔案


# 參考架構
```
src/
├── themes/                 # 主題相關檔案
│   ├── config/            # 主題配置
│   │   ├── index.ts      # 主題管理器
│   │   └── variables.ts  # 共用變數定義
│   ├── components/        # 主題元件
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   └── ...
│   └── styles/            # 主題樣式
│       ├── base/         # 基礎樣式
│       │   ├── _colors.scss
│       │   ├── _typography.scss
│       │   └── _variables.scss
│       └── themes/       # 主題定義
│           ├── default/  # 預設主題
│           ├── ddpay-crm/  # A 主題
│           └── reddoor-crm/  # B 主題
├── components/            # 共用元件
└── views/                # 頁面檔案
    └── guideline/        # 設計規範頁面
        └── ThemeGuide.vue # 主題展示頁面
```

# 附加檔案

## src/themes/config/ddpay.config.ts
```
import { ThemeConfig } from './variables.ts';

export const ddpayTheme: ThemeConfig = {
    name: 'DDPay CRM',
    colors: {
        primary: '#FC8802',
        down: '#CC0D39',
        up: '#159E42',
        white: '#FFFFFF',
        bgLight: '#F9F9F9',
        tableStriped: '#F7F8F9',
        borderDisabled: '#EBEBEB',
        placeholder: '#929AA3',
        textSecondary: '#485771',
        textPrimary: '#293954'
    },
    typography: {
        headings: {
            h1: '#293954',
            h2: '#293954',
            h3: '#293954'
        },
        link: {
            default: '#FC8802',
            hover: '#FC8802'
        }
    }
};

```

## src/themes/config/variables.ts
```
// 定義主題介面
export interface ThemeConfig {
    name: string;
    colors: {
        primary: string;
        down: string;
        up: string;
        white: string;
        bgLight: string;
        tableStriped: string;
        borderDisabled: string;
        placeholder: string;
        textSecondary: string;
        textPrimary: string;
    };
    typography: {
        headings: {
            h1: string;
            h2: string;
            h3: string;
        };
        link: {
            default: string;
            hover: string;
        };
    };
}

```

## src/themes/config/index.ts
```
import { ddpayTheme } from './ddpay.config';
import { reddoorTheme } from './reddoor.config';

export const themes = {
    'crm-ddpay': ddpayTheme,
    'crm-reddoor': reddoorTheme
};

export const getTheme = (themeName: string) => {
    return themes[themeName] || themes['crm-ddpay'];
};

```

## src/themes/styles/themes/crm-ddpay/_colors.scss
```
// src/themes/styles/themes/ddpay-crm/_variables.scss
:root[data-theme='ddpay-crm'] {
    // 主要顏色系統
    --color-primary: #FC8802;
    --color-down: #CC0D39;
    --color-up: #159E42;

    // 背景系統
    --color-white: #FFFFFF;
    --color-bg-light: #F9F9F9;
    --color-table-striped: #F7F8F9;
    --color-border-disabled: #EBEBEB;

    // 文字系統
    --color-placeholder: #929AA3;
    --color-text-secondary: #485771;
    --color-text-primary: #293954;
  }

```

## src/themes/styles/base/_colors.scss
```
.theme-ddpay {
    // 按鈕樣式
    --button-primary-bg: var(--color-primary);
    --button-primary-text: var(--color-white);
    --button-disabled-bg: var(--color-border-disabled);

    // 輸入框樣式
    --input-border: var(--color-border-disabled);
    --input-focus-border: var(--color-primary);
    --input-error-border: var(--color-down);

    // 標籤樣式
    --tag-bg: var(--color-bg-light);
    --tag-border: var(--color-border-disabled);

    // 狀態樣式
    --status-success: var(--color-up);
    --status-error: var(--color-down);
  }

```
