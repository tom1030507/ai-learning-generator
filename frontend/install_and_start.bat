@echo off
chcp 65001 >nul
echo ====================================
echo 安裝前端依賴並啟動開發伺服器
echo ====================================
echo.

cd /d "%~dp0"

echo [1/2] 安裝依賴套件...
call npm install

echo.
echo [2/2] 啟動開發伺服器...
echo.
call npm run dev

pause

