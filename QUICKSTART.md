# ⚡ 快速開始

## Windows 使用者（最簡單的方式）

### 1️⃣ 取得 Gemini API Key

前往 https://makersuite.google.com/app/apikey 並登入，點擊「Create API Key」取得金鑰。

### 2️⃣ 設定環境變數

```bash
# 進入後端目錄
cd backend

# 複製環境變數範本
copy env.template .env

# 編輯 .env 檔案，填入你的 API Key
notepad .env
```

將 `your_gemini_api_key_here` 替換為你的實際 API Key。

### 3️⃣ 啟動後端

在專案根目錄執行：

```bash
start_backend.bat
```

### 4️⃣ 啟動前端

**開啟新的命令提示字元視窗**，在專案根目錄執行：

```bash
start_frontend.bat
```

### 5️⃣ 開始使用

瀏覽器會自動開啟 `http://localhost:5173`，開始生成教材！

---

## macOS/Linux 使用者

### 1️⃣ 取得 Gemini API Key

前往 https://makersuite.google.com/app/apikey 取得金鑰。

### 2️⃣ 啟動後端

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 建立 .env 檔案
cp env.template .env
# 編輯 .env 並填入 API Key
nano .env

# 啟動服務
uvicorn main:app --reload
```

### 3️⃣ 啟動前端

開啟新的終端視窗：

```bash
cd frontend
npm install
npm run dev
```

### 4️⃣ 開始使用

開啟瀏覽器訪問 `http://localhost:5173`

---

## 驗證安裝

✅ 後端：開啟 http://localhost:8000/docs 應該看到 API 文件

✅ 前端：開啟 http://localhost:5173 應該看到網站首頁

---

## 遇到問題？

查看完整的安裝指南：[SETUP_GUIDE.md](SETUP_GUIDE.md)

查看常見問題排解：[README.md](README.md)

---

**提示**：第一次生成教材可能需要 10-30 秒，請耐心等待！





