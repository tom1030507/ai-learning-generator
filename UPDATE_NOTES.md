# 更新說明

## 已修復的問題

### 1. 模型已棄用錯誤
**問題：** `llama3-70b-8192` 模型已被 Groq 棄用
**修復：** 已更新為 `gpt-oss-120b` 模型

### 2. JSON 格式顯示問題
**問題：** 前端顯示原始的 JSON 格式，不易閱讀
**修復：** 
- 後端改為生成 Markdown 格式的內容
- 前端使用 `react-markdown` 渲染，顯示更美觀易讀

## 變更內容

### 後端變更 (`backend/groq_service.py`)
1. **模型更新**：`llama3-70b-8192` → `gpt-oss-120b`
2. **大綱格式**：從 JSON 格式改為 Markdown 格式
3. **教材格式**：增強了 Markdown 結構化輸出
4. **題目格式**：從 JSON 格式改為 Markdown 格式，包含分隔線和格式化排版

### 前端變更
1. **新增依賴**：
   - `react-markdown`：用於渲染 Markdown 內容
   - `@tailwindcss/typography`：提供美觀的文字排版樣式

2. **更新組件**：
   - `OutlineDisplay.jsx`：使用 ReactMarkdown 渲染大綱
   - `ContentDisplay.jsx`：使用 ReactMarkdown 渲染教材
   - `QuestionsDisplay.jsx`：簡化為使用 ReactMarkdown 渲染題目

3. **樣式優化**：
   - 更新 `tailwind.config.js` 加入 typography 插件
   - 自定義 prose 樣式以配合主題色

## 如何使用

### 第一次使用（需要安裝依賴）

#### 前端安裝
```bash
cd frontend
npm install
npm run dev
```

或直接執行：
```bash
cd frontend
.\install_and_start.bat
```

#### 後端重啟
如果後端正在運行，需要重啟才能應用模型變更：
```bash
cd backend
python main.py
```

### 後續使用
直接啟動前後端服務即可，不需要重新安裝依賴。

## 顯示效果

### 大綱顯示
現在會以結構化的標題和列表顯示：
```
# 分數基礎概念

## 學習目標
1. 認識分數的意義
2. 理解分數的表示方法
...

## 教學大綱

### 一、認識分數
- 什麼是分數
- 分數的組成
...
```

### 教材內容
以清晰的段落、標題和列表呈現，包含：
- 多層級標題結構
- 條列重點
- 範例說明
- 粗體強調

### 練習題目
格式化的題目顯示：
- 題號和題型標記
- 清楚的選項排列
- 答案和解析分離
- 分隔線區分每題

## 注意事項

1. **API Key**：確保 `backend/.env` 檔案中有正確的 `GROQ_API_KEY`
2. **依賴安裝**：前端需要重新執行 `npm install` 以安裝新的依賴
3. **後端重啟**：後端服務需要重啟才能應用模型變更
4. **瀏覽器緩存**：如果前端更新後沒有生效，可以清除瀏覽器緩存或強制重新整理 (Ctrl+F5)

## 技術棧

- **後端**：FastAPI + Groq API (`gpt-oss-120b`)
- **前端**：React + Vite + TailwindCSS + react-markdown
- **資料庫**：SQLite

## 支援

如有問題，請檢查：
1. 後端控制台是否有錯誤訊息
2. 瀏覽器開發者工具的 Console 是否有錯誤
3. API Key 是否有效
4. 網路連線是否正常

