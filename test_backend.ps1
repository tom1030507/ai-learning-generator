# 測試後端服務
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "測試後端服務連接" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:8000"

try {
    Write-Host "正在測試 API..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri $baseUrl -Method Get -TimeoutSec 5
    
    Write-Host "✓ 後端服務運行正常！" -ForegroundColor Green
    Write-Host "  訊息: $($response.message)" -ForegroundColor White
    Write-Host "  狀態: $($response.status)`n" -ForegroundColor White
    
    Write-Host "可用的端點：" -ForegroundColor Cyan
    Write-Host "  ✓ 首頁: $baseUrl" -ForegroundColor Green
    Write-Host "  ✓ API 文件 (Swagger): $baseUrl/docs" -ForegroundColor Green
    Write-Host "  ✓ 生成大綱: $baseUrl/api/generate-outline" -ForegroundColor Green
    Write-Host "  ✓ 生成教材: $baseUrl/api/generate-content" -ForegroundColor Green
    Write-Host "  ✓ 生成題目: $baseUrl/api/generate-questions" -ForegroundColor Green
    Write-Host "  ✓ 歷史記錄: $baseUrl/api/history`n" -ForegroundColor Green
    
    Write-Host "下一步：" -ForegroundColor Yellow
    Write-Host "  1. 在瀏覽器中打開: $baseUrl/docs" -ForegroundColor White
    Write-Host "  2. 執行 .\start_frontend.ps1 啟動前端" -ForegroundColor White
    Write-Host "  3. 訪問 http://localhost:5173 使用完整應用`n" -ForegroundColor White
    
} catch {
    Write-Host "✗ 無法連接到後端服務" -ForegroundColor Red
    Write-Host "  錯誤: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n請確認：" -ForegroundColor Yellow
    Write-Host "  1. 後端服務是否正在運行" -ForegroundColor White
    Write-Host "  2. 端口 8000 是否被佔用" -ForegroundColor White
    Write-Host "  3. 防火牆是否阻止了連接`n" -ForegroundColor White
}
