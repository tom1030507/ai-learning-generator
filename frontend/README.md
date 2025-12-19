# 前端使用說明

## 快速開始

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

應用程式會在 `http://localhost:5173` 啟動

### 建構生產版本

```bash
npm run build
```

## 專案結構

```
src/
├── components/          # React 元件
│   ├── GeneratorForm.jsx      # 輸入表單
│   ├── OutlineDisplay.jsx     # 大綱顯示
│   ├── ContentDisplay.jsx     # 教材顯示
│   ├── QuestionsDisplay.jsx   # 題目顯示
│   ├── History.jsx            # 歷史記錄
│   └── LoadingSpinner.jsx     # 載入動畫
├── services/           # API 服務
│   └── api.js         # Axios 封裝
├── App.jsx            # 主應用程式
├── main.jsx           # 進入點
└── index.css          # Tailwind 樣式
```

## 元件說明

### GeneratorForm

輸入表單元件，包含：
- 科目下拉選單
- 年級下拉選單
- 單元名稱輸入框

### OutlineDisplay

顯示生成的大綱，功能：
- 顯示大綱內容
- 支援編輯功能
- 確認後進入下一階段

### ContentDisplay

顯示教材內容，功能：
- 格式化顯示教材
- 支援長文本滾動
- 確認後生成題目

### QuestionsDisplay

顯示練習題目，功能：
- 解析 JSON 格式題目
- 顯示/隱藏答案切換
- 支援多種題型展示

### History

歷史記錄管理，功能：
- 列表顯示所有記錄
- 搜尋與篩選
- 點擊查看詳情

## API 整合

所有 API 呼叫都封裝在 `src/services/api.js` 中：

```javascript
import { generateOutline, generateContent, generateQuestions, getHistory } from './services/api';

// 使用範例
const response = await generateOutline('數學', '小六', '速率');
```

## 樣式系統

使用 Tailwind CSS 建立響應式介面：

### 自訂樣式類別

- `.card`：卡片容器
- `.btn-primary`：主要按鈕
- `.btn-secondary`：次要按鈕
- `.input-field`：輸入框
- `.label`：標籤

### 顏色主題

主要色系：Primary Blue
- `primary-50` ~ `primary-900`

## 開發技巧

### 狀態管理

使用 React Hooks 管理狀態：
- `useState`：元件狀態
- `useEffect`：副作用處理

### 錯誤處理

所有 API 呼叫都包含 try-catch 錯誤處理：

```javascript
try {
  const response = await generateOutline(...);
} catch (error) {
  console.error('生成失敗:', error);
  alert('操作失敗，請稍後再試');
}
```

## 最佳實踐

1. **元件化**：將可重用的 UI 拆分為獨立元件
2. **Props 驗證**：確保元件接收正確的 props
3. **載入狀態**：顯示適當的載入指示器
4. **錯誤處理**：提供友善的錯誤訊息
5. **響應式設計**：確保在各種螢幕尺寸下都能正常顯示

## 調試技巧

### React DevTools

安裝 React DevTools 瀏覽器擴充功能來調試元件狀態

### 網路檢查

使用瀏覽器的開發者工具檢查 API 請求和回應

### Console.log

在開發過程中使用 console.log 追蹤資料流
