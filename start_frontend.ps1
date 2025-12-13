# 智慧教材生成平台 - 前端啟動腳本 (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "智慧教材生成平台 - 前端啟動腳本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location frontend

# 檢查 Node.js 是否安裝
try {
    $nodeVersion = node --version 2>&1
    Write-Host "Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[錯誤] 找不到 Node.js，請先安裝 Node.js" -ForegroundColor Red
    Read-Host "按 Enter 鍵退出"
    exit 1
}

# 安裝依賴套件
if (-Not (Test-Path "node_modules")) {
    Write-Host "[1/2] 安裝依賴套件..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[錯誤] 安裝依賴失敗" -ForegroundColor Red
        Read-Host "按 Enter 鍵退出"
        exit 1
    }
} else {
    Write-Host "[1/2] 依賴套件已安裝" -ForegroundColor Green
}

# 啟動服務
Write-Host "[2/2] 啟動前端服務..." -ForegroundColor Yellow
Write-Host ""
Write-Host "前端服務將在 http://localhost:5173 啟動" -ForegroundColor Green
Write-Host ""
Write-Host "按 Ctrl+C 停止服務" -ForegroundColor Gray
Write-Host ""

npm run dev