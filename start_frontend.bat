@echo off
chcp 65001 >nul
echo ========================================
echo 智慧教材生成平台 - 前端啟動腳本
echo ========================================
echo.

cd frontend

if not exist node_modules (
    echo [1/2] 安裝依賴套件...
    npm install
    if errorlevel 1 (
        echo [錯誤] 安裝依賴失敗，請確認已安裝 Node.js
        pause
        exit /b 1
    )
) else (
    echo [1/2] 依賴套件已安裝
)

echo [2/2] 啟動前端服務...
echo.
echo 前端服務將在 http://localhost:5173 啟動
echo.
npm run dev



