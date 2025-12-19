# 智慧教材生成平台 - 後端啟動腳本 (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "智慧教材生成平台 - 後端啟動腳本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location backend

# 檢查 Python 是否安裝
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python 版本: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[錯誤] 找不到 Python，請先安裝 Python 3.8 或以上版本" -ForegroundColor Red
    Read-Host "按 Enter 鍵退出"
    exit 1
}

# 建立或檢查虛擬環境
if (-Not (Test-Path "venv")) {
    Write-Host "[1/4] 建立虛擬環境..." -ForegroundColor Yellow
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[錯誤] 建立虛擬環境失敗" -ForegroundColor Red
        Read-Host "按 Enter 鍵退出"
        exit 1
    }
} else {
    Write-Host "[1/4] 虛擬環境已存在" -ForegroundColor Green
}

# 啟動虛擬環境
Write-Host "[2/4] 啟動虛擬環境..." -ForegroundColor Yellow

if (Test-Path "venv\Scripts\Activate.ps1") {
    & ".\venv\Scripts\Activate.ps1"
} else {
    Write-Host "[錯誤] 找不到虛擬環境啟動檔案" -ForegroundColor Red
    Write-Host "正在刪除損壞的虛擬環境並重新建立..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force venv
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[錯誤] 重新建立虛擬環境失敗" -ForegroundColor Red
        Read-Host "按 Enter 鍵退出"
        exit 1
    }
    & ".\venv\Scripts\Activate.ps1"
}

# 安裝依賴套件
Write-Host "[3/4] 安裝/更新依賴套件..." -ForegroundColor Yellow
python -m pip install --upgrade pip --quiet
pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "[錯誤] 安裝依賴失敗" -ForegroundColor Red
    Read-Host "按 Enter 鍵退出"
    exit 1
}

# 檢查 .env 檔案
if (-Not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "[警告] 找不到 .env 檔案！" -ForegroundColor Red
    Write-Host "請從 env.template 複製並設定你的 Groq API Key" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "步驟：" -ForegroundColor Yellow
    Write-Host "1. 複製 env.template 為 .env" -ForegroundColor White
    Write-Host "2. 在 https://console.groq.com/keys 取得 API Key" -ForegroundColor White
    Write-Host "3. 在 .env 檔案中填入 GROQ_API_KEY=你的key" -ForegroundColor White
    Write-Host ""
    Read-Host "按 Enter 鍵退出"
    exit 1
}

# 啟動服務
Write-Host "[4/4] 啟動後端服務..." -ForegroundColor Yellow
Write-Host ""
Write-Host "後端服務將在 http://localhost:8000 啟動" -ForegroundColor Green
Write-Host "API 文件可在 http://localhost:8000/docs 查看" -ForegroundColor Green
Write-Host ""
Write-Host "按 Ctrl+C 停止服務" -ForegroundColor Gray
Write-Host ""

uvicorn main:app --reload
