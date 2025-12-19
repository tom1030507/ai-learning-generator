# 智慧教材生成平台 (AI Learning Generator)

一個基於 AI 的教材生成系統，採用三階段生成流程（大綱 → 教材 → 題目），協助教師快速建立結構化的教學內容。

## 🌟 專案特色

- **三階段生成流程**：確保教材邏輯連貫、循序漸進
  1. 生成結構化教學大綱
  2. 根據大綱生成詳細教材內容
  3. 自動產出對應的練習題與解析

- **多科目支援**：涵蓋數學、自然科學、理化、生物、物理、化學、國文、英文等科目

- **年級客製化**：從國小到高中（小一～高三），內容難度自動調整

- **歷史記錄管理**：所有生成的教材自動儲存，方便日後查閱

## 🛠️ 技術架構

### 後端
- **框架**：FastAPI (Python)
- **資料庫**：SQLite
- **AI 引擎**：Groq API (openai/gpt-oss-120b)
- **ORM**：SQLAlchemy

### 前端
- **框架**：React.js
- **建構工具**：Vite
- **樣式**：Tailwind CSS
- **HTTP 客戶端**：Axios

## 📋 環境需求

- Python 3.9 或以上
- Node.js 18 或以上
- Groq API Key（[申請連結](https://console.groq.com/keys)）

## 🚀 安裝與啟動

### 1. 複製專案

```bash
git clone <repository-url>
cd ai-learning-generator
```

### 2. 後端設定

```bash
# 進入後端目錄
cd backend

# 建立虛擬環境
python -m venv venv

# 啟動虛擬環境 (Windows)
venv\Scripts\activate
# 啟動虛擬環境 (macOS/Linux)
# source venv/bin/activate

# 安裝依賴套件
pip install -r requirements.txt

# 設定環境變數
# 將 env.template 複製為 .env
copy env.template .env  # Windows
# cp env.template .env  # macOS/Linux

# 編輯 .env 檔案，填入你的 Groq API Key
# GROQ_API_KEY=your_actual_api_key_here
```

### 3. 啟動後端服務

```bash
# 在 backend 目錄下執行
uvicorn main:app --reload
```

後端服務會在 `http://localhost:8000` 啟動

### 4. 前端設定

開啟新的終端視窗：

```bash
# 進入前端目錄
cd frontend

# 安裝依賴套件
npm install
```

### 5. 啟動前端服務

```bash
# 在 frontend 目錄下執行
npm run dev
```

前端服務會在 `http://localhost:5173` 啟動

### 6. 開始使用

在瀏覽器中開啟 `http://localhost:5173`，即可開始使用智慧教材生成平台！

## 📖 使用說明

### 生成教材流程

1. **填寫表單**
   - 選擇科目（例如：數學）
   - 選擇年級（例如：小六）
   - 輸入單元名稱（例如：速率）

2. **檢視大綱**
   - 系統自動生成教學大綱
   - 可以編輯調整大綱內容
   - 確認後進入下一步

3. **查看教材**
   - 系統根據大綱生成詳細教材
   - 包含概念說明、公式、生活化例子
   - 確認後生成練習題

4. **練習題目**
   - 自動產出對應的練習題
   - 題型多樣（選擇、填充、計算等）
   - 提供詳細解答與解析

### 查看歷史記錄

點擊右上角「歷史記錄」按鈕，可以：
- 查看所有曾經生成的教材
- 使用搜尋功能快速找到特定教材
- 點擊任一記錄重新查看完整內容

## 🔧 API 文件

後端啟動後，可訪問以下網址查看 API 文件：

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 主要 API Endpoints

| Method | Endpoint | 說明 |
|--------|----------|------|
| POST | `/api/generate-outline` | 生成教學大綱 |
| POST | `/api/generate-content` | 生成教材內容 |
| POST | `/api/generate-questions` | 生成練習題目 |
| GET | `/api/history` | 取得所有歷史記錄 |
| GET | `/api/history/{id}` | 取得特定記錄詳情 |

## 📂 專案結構

```
nccu_genai/
├── backend/                    # 後端程式
│   ├── main.py                # FastAPI 主程式
│   ├── models.py              # 資料庫模型
│   ├── schemas.py             # Pydantic 驗證模型
│   ├── database.py            # 資料庫設定
│   ├── groq_service.py        # Groq API 整合
│   ├── config.py              # 環境變數設定
│   ├── requirements.txt       # Python 依賴
│   └── .env                   # 環境變數（需自行建立）
│
├── frontend/                   # 前端程式
│   ├── src/
│   │   ├── components/        # React 元件
│   │   │   ├── GeneratorForm.jsx
│   │   │   ├── OutlineDisplay.jsx
│   │   │   ├── ContentDisplay.jsx
│   │   │   ├── QuestionsDisplay.jsx
│   │   │   ├── History.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── services/
│   │   │   └── api.js         # API 呼叫封裝
│   │   ├── App.jsx            # 主應用程式
│   │   ├── main.jsx           # 進入點
│   │   └── index.css          # 全域樣式
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md                   # 專案說明文件
```

## 🎯 開發重點

### Chain of Thought 提示工程

本專案的核心在於精心設計的 AI 提示（Prompt），確保：

1. **大綱生成**：要求 AI 先思考核心概念，再規劃教學順序
2. **教材生成**：基於大綱鎖定內容範圍，避免離題
3. **題目生成**：分析教材內容，產出精確對應的題目

### 資料庫設計

使用單一資料表 `generations` 儲存完整的生成歷程：
- 方便追蹤每次生成的完整過程
- 支援中斷後繼續（未來功能）
- 便於統計分析使用狀況

## 🐛 常見問題

### 1. Groq API 錯誤

**問題**：顯示 API Key 無效或配額用盡

**解決方法**：
- 檢查 `backend/.env` 中的 `GROQ_API_KEY` 是否正確
- 確認 API Key 沒有超過免費配額限制
- 到 [Groq Console](https://console.groq.com/keys) 檢查 API 狀態
- 確認使用的模型為 `openai/gpt-oss-120b`

### 2. 前端無法連接後端

**問題**：前端顯示網路錯誤

**解決方法**：
- 確認後端服務正在運行（`http://localhost:8000`）
- 檢查防火牆設定
- 確認 `frontend/src/services/api.js` 中的 API_BASE_URL 正確

### 3. 資料庫錯誤

**問題**：無法讀寫資料庫

**解決方法**：
- 刪除 `backend/learning_generator.db` 後重新啟動後端
- 檢查檔案權限
