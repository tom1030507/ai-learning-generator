import google.generativeai as genai
from config import settings
import json

class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')

    def generate_outline(self, subject: str, grade: str, unit: str) -> str:
        """
        階段一：生成教學大綱
        使用 Chain of Thought 確保結構化輸出
        """
        prompt = f"""
你是一位專業的教育內容規劃師。請為以下教學需求生成一個結構化的教學大綱。

科目：{subject}
年級：{grade}
單元：{unit}

請使用 Chain of Thought 方法，先思考該單元的核心概念，然後規劃教學順序。

請以 JSON 格式輸出大綱，格式如下：
{{
  "title": "單元標題",
  "objectives": ["學習目標1", "學習目標2"],
  "sections": [
    {{
      "order": 1,
      "title": "章節標題",
      "topics": ["主題1", "主題2"]
    }}
  ]
}}

要求：
1. 大綱應該循序漸進，從基礎到進階
2. 考慮該年級學生的認知能力
3. 確保邏輯連貫性
4. 包含 3-5 個主要章節
"""
        
        response = self.model.generate_content(prompt)
        return response.text

    def generate_content(self, subject: str, grade: str, unit: str, outline: str) -> str:
        """
        階段二：根據大綱生成詳細教材
        """
        prompt = f"""
你是一位經驗豐富的{subject}老師。請根據以下大綱，為{grade}學生編寫詳細的教材內容。

單元：{unit}

大綱：
{outline}

要求：
1. 使用淺顯易懂的語言，適合{grade}學生的理解程度
2. 提供生活化的例子和情境
3. 對於數學/理化科目，請清楚說明公式和計算步驟
4. 適當使用圖表說明（用文字描述圖表內容）
5. 每個概念後面提供簡單的範例

請以清晰的段落和標題組織內容，確保學生能夠理解並應用所學知識。
"""
        
        response = self.model.generate_content(prompt)
        return response.text

    def generate_questions(self, subject: str, grade: str, unit: str, content: str) -> str:
        """
        階段三：根據教材內容生成練習題
        """
        prompt = f"""
你是一位專業的題目設計師。請根據以下教材內容，為{grade}學生設計練習題。

科目：{subject}
單元：{unit}

教材內容：
{content}

請以 JSON 格式輸出題目，格式如下：
{{
  "questions": [
    {{
      "number": 1,
      "type": "選擇題/填充題/計算題/問答題",
      "question": "題目內容",
      "options": ["選項A", "選項B", "選項C", "選項D"],  // 僅選擇題需要
      "answer": "正確答案",
      "explanation": "詳細解析"
    }}
  ]
}}

要求：
1. 設計 5-8 題練習題
2. 題目難度應符合{grade}程度
3. 涵蓋教材中的主要概念
4. 對於數學題目，確保數值準確且合理
5. 提供詳細的解題步驟和說明
6. 題型多樣化（選擇、填充、計算等）
"""
        
        response = self.model.generate_content(prompt)
        return response.text



