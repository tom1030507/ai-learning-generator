# 🚀 快速安裝指南

這是一份簡化的安裝指南，幫助您快速啟動智慧教材生成平台。

## 📝 前置準備

### 1. 安裝必要軟體

請確保您的電腦已安裝：

- **Python 3.9+**
  - 下載：https://www.python.org/downloads/
  - 安裝時記得勾選「Add Python to PATH」

- **Node.js 18+**
  - 下載：https://nodejs.org/
  - 建議下載 LTS（長期支援）版本

### 2. 取得 Gemini API Key

1. 前往 Google AI Studio：https://makersuite.google.com/app/apikey
2. 登入您的 Google 帳號
3. 點擊「Create API Key」
4. 複製產生的 API Key（格式類似：`AIza...`）

## ⚙️ 安裝步驟

### 方法一：使用啟動腳本（推薦 - Windows）

#### 1. 設定後端

```bash
# 在專案根目錄執行
start_backend.bat
```

第一次執行時，腳本會：
- 自動建立虛擬環境
- 安裝所有依賴套件
- 提醒您設定 .env 檔案

**重要：首次啟動會失敗，請按照以下步驟設定 API Key**

#### 2. 設定 Gemini API Key

```bash
# 進入後端目錄
cd backend

# 複製環境變數範例檔案
copy .env.example .env

# 使用記事本編輯 .env 檔案
notepad .env
```

在 `.env` 檔案中，將 `your_gemini_api_key_here` 替換為您的實際 API Key：

```
GEMINI_API_KEY=AIzaSy...你的實際API金鑰
DATABASE_URL=sqlite:///./learning_generator.db
```

儲存後關閉檔案。

#### 3. 再次啟動後端

```bash
# 回到專案根目錄，再次執行
start_backend.bat
```

成功後，您會看到：
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

#### 4. 啟動前端

開啟**新的命令提示字元視窗**，執行：

```bash
start_frontend.bat
```

成功後，前端會自動在瀏覽器開啟 `http://localhost:5173`

### 方法二：手動安裝

#### 後端安裝

```bash
# 進入後端目錄
cd backend

# 建立虛擬環境
python -m venv venv

# 啟動虛擬環境
venv\Scripts\activate

# 安裝依賴
pip install -r requirements.txt

# 設定環境變數（參考上面的步驟 2）
copy .env.example .env
notepad .env

# 啟動服務
uvicorn main:app --reload
```

#### 前端安裝

開啟新的終端視窗：

```bash
# 進入前端目錄
cd frontend

# 安裝依賴
npm install

# 啟動服務
npm run dev
```

## ✅ 驗證安裝

### 1. 檢查後端

在瀏覽器中開啟：`http://localhost:8000/docs`

您應該會看到 API 文件頁面（Swagger UI）

### 2. 檢查前端

在瀏覽器中開啟：`http://localhost:5173`

您應該會看到智慧教材生成平台的首頁

## 🎯 開始使用

1. 在前端頁面選擇科目、年級
2. 輸入單元名稱（例如：速率、圓周率）
3. 點擊「開始生成教材」
4. 系統會依序生成：大綱 → 教材 → 題目

## 🐛 常見問題排解

### 問題 1：Python 指令找不到

**錯誤訊息**：`'python' is not recognized as an internal or external command`

**解決方法**：
- 重新安裝 Python，確保勾選「Add Python to PATH」
- 或使用完整路徑：`C:\Python39\python.exe`

### 問題 2：npm 指令找不到

**錯誤訊息**：`'npm' is not recognized as an internal or external command`

**解決方法**：
- 重新安裝 Node.js
- 安裝後重新啟動命令提示字元

### 問題 3：後端啟動失敗

**錯誤訊息**：`ModuleNotFoundError: No module named 'fastapi'`

**解決方法**：
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### 問題 4：Gemini API 錯誤

**錯誤訊息**：API key not valid 或 quota exceeded

**解決方法**：
- 檢查 `backend/.env` 中的 API Key 是否正確
- 確認沒有多餘的空格或引號
- 檢查 API Key 的配額是否已用盡

### 問題 5：前端無法連接後端

**錯誤訊息**：Network Error 或 CORS Error

**解決方法**：
- 確認後端服務正在運行（`http://localhost:8000`）
- 確認沒有其他程式佔用 8000 或 5173 埠號
- 重新啟動兩個服務

### 問題 6：埠號被佔用

**錯誤訊息**：Address already in use

**解決方法（Windows）**：
```bash
# 找出佔用埠號的程式（例如 8000）
netstat -ano | findstr :8000

# 終止該程式（PID 是上一步的最後一欄數字）
taskkill /PID <PID> /F
```

## 📚 下一步

安裝完成後，建議閱讀：
- [README.md](README.md) - 完整專案說明
- [backend/README.md](backend/README.md) - 後端 API 文件
- [frontend/README.md](frontend/README.md) - 前端開發指南

## 💡 小提示

- 後端和前端需要**同時運行**才能正常使用
- 建議使用兩個終端視窗分別運行
- 首次生成教材可能需要 10-30 秒，請耐心等待
- 所有生成的教材會自動儲存在資料庫中

## 📞 需要幫助？

如果遇到其他問題，請：
1. 檢查錯誤訊息
2. 查看終端輸出的詳細資訊
3. 確認環境設定正確
4. 聯繫開發團隊

祝您使用愉快！🎉





