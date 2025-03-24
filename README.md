# MEPS Project

這是一個純前端切版專案，專注於網頁設計與實現，不包含後端 API。

## 專案結構

```
meps/
├── src/                # 原始碼
│   ├── css/            # CSS 樣式表
│   ├── js/             # JavaScript 檔案
│   ├── images/         # 圖片資源
│   ├── fonts/          # 字型檔案
│   └── index.html      # 主頁面
├── public/             # 靜態資源
└── README.md           # 專案說明
```

## 開始使用

1. 複製專案到本地
   ```bash
   git clone [repository-url]
   cd meps
   ```

2. 開啟 `src/index.html` 檔案在瀏覽器中預覽

3. 開始編輯 HTML、CSS 和 JavaScript 檔案

## 開發指南

- HTML 檔案放在 `src/` 目錄下
- CSS 樣式放在 `src/css/` 目錄下
- JavaScript 檔案放在 `src/js/` 目錄下
- 圖片資源放在 `src/images/` 目錄下
- 字型檔案放在 `src/fonts/` 目錄下

## Git Flow Workflow

This project uses Git Flow for branch management. Here's how to work with it:

### Main Branches
- `master`: Production-ready code
- `develop`: Latest development changes for the next release

### Supporting Branches
- `feature/*`: New features development
- `release/*`: Preparation for a new production release
- `hotfix/*`: Urgent fixes for production issues
- `support/*`: Maintenance for older versions

### Common Workflows

#### Starting a new feature
```bash
git flow feature start feature_name
# Work on your feature...
git flow feature finish feature_name
```

#### Creating a release
```bash
git flow release start 1.0.0
# Make release-specific changes if needed...
git flow release finish 1.0.0
```

#### Fixing a production issue
```bash
git flow hotfix start hotfix_name
# Fix the issue...
git flow hotfix finish hotfix_name
```
