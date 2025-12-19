# 後端 API 說明

## 快速開始

### 安裝依賴

```bash
pip install -r requirements.txt
```

### 設定環境變數

建立 `.env` 檔案：

```env
GROQ_API_KEY=你的_Groq_API_金鑰
DATABASE_URL=sqlite:///./learning_generator.db
```

### 啟動服務

```bash
uvicorn main:app --reload
```

服務會在 `http://localhost:8000` 啟動

## API Endpoints

### 1. 生成大綱

**Endpoint:** `POST /api/generate-outline`

**Request Body:**
```json
{
  "subject": "數學",
  "grade": "小六",
  "unit": "速率"
}
```

**Response:**
```json
{
  "generation_id": 1,
  "outline": "生成的大綱內容..."
}
```

### 2. 生成教材

**Endpoint:** `POST /api/generate-content`

**Request Body:**
```json
{
  "generation_id": 1,
  "outline": "大綱內容..."
}
```

**Response:**
```json
{
  "generation_id": 1,
  "content": "生成的教材內容..."
}
```

### 3. 生成題目

**Endpoint:** `POST /api/generate-questions`

**Request Body:**
```json
{
  "generation_id": 1,
  "content": "教材內容..."
}
```

**Response:**
```json
{
  "generation_id": 1,
  "questions": "生成的題目..."
}
```

### 4. 取得歷史記錄

**Endpoint:** `GET /api/history`

**Response:**
```json
[
  {
    "id": 1,
    "subject": "數學",
    "grade": "小六",
    "unit": "速率",
    "outline": "...",
    "content": "...",
    "questions": "...",
    "created_at": "2025-12-13T10:30:00"
  }
]
```

### 5. 取得特定記錄

**Endpoint:** `GET /api/history/{id}`

**Response:**
```json
{
  "id": 1,
  "subject": "數學",
  "grade": "小六",
  "unit": "速率",
  "outline": "...",
  "content": "...",
  "questions": "...",
  "created_at": "2025-12-13T10:30:00"
}
```

## 資料庫結構

### generations 表

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | Integer | 主鍵 |
| subject | String(100) | 科目 |
| grade | String(50) | 年級 |
| unit | String(200) | 單元 |
| outline | Text | 大綱（JSON） |
| content | Text | 教材內容 |
| questions | Text | 題目（JSON） |
| created_at | DateTime | 建立時間 |

## Groq API 整合

### 使用模型

本專案使用 Groq 平台的 `openai/gpt-oss-120b` 模型，這是一個高效能的開源大型語言模型。

### 提示工程設計

本專案使用 Chain of Thought 方法，確保 AI 生成的內容具有邏輯連貫性：

1. **大綱生成**：要求 AI 以 JSON 格式輸出結構化大綱
2. **教材生成**：基於大綱，強調適齡化與生活化，逐章節生成內容
3. **題目生成**：分析教材內容，產出精確對應的練習題

### API 配額管理

Groq API 提供快速的推理速度。免費版有使用限制，請參考官方文件：
- 官方網站：https://console.groq.com/
- API 文件：https://console.groq.com/docs

建議實作快取機制或排隊系統以避免超過限制。

## 錯誤處理

所有 API 都會返回標準的 HTTP 狀態碼：

- `200 OK`：請求成功
- `404 Not Found`：找不到資源
- `500 Internal Server Error`：伺服器錯誤

錯誤回應格式：
```json
{
  "detail": "錯誤訊息"
}
```
