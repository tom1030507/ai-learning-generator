@echo off
chcp 65001 >nul
echo ========================================
echo 智慧教材生成平台 - 後端啟動腳本
echo ========================================
echo.

cd backend

if not exist venv (
    echo [1/4] 建立虛擬環境...
    python -m venv venv
    if errorlevel 1 (
        echo [錯誤] 建立虛擬環境失敗，請確認已安裝 Python
        pause
        exit /b 1
    )
) else (
    echo [1/4] 虛擬環境已存在
)

echo [2/4] 啟動虛擬環境...
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
) else (
    echo [錯誤] 找不到虛擬環境啟動檔案
    echo 請刪除 venv 資料夾後重新執行此腳本
    pause
    exit /b 1
)

echo [3/4] 安裝/更新依賴套件...
python -m pip install --upgrade pip
pip install -r requirements.txt

if not exist .env (
    echo [警告] 找不到 .env 檔案！
    echo 請從 .env.example 複製並設定你的 Groq API Key
    pause
    exit /b 1
)

echo [4/4] 啟動後端服務...
echo.
echo 後端服務將在 http://localhost:8000 啟動
echo API 文件可在 http://localhost:8000/docs 查看
echo.
uvicorn main:app --reload



