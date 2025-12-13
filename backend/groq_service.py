from groq import Groq
from config import settings
import json
import re

class GroqService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        # 使用 Groq 支援的模型
        self.model = "openai/gpt-oss-120b"
    
    def _fix_latex_brackets(self, text: str) -> str:
        """
        自動修正 LaTeX 公式格式：將 [ ] 替換為 $ $
        同時處理 \[ \] 格式
        """
        # 替換 [ ... ] 為 $ ... $
        # 使用非貪婪匹配，只匹配數學公式（包含反斜線或特殊符號）
        text = re.sub(r'\[\s*([^\[\]]*?(?:\\[a-zA-Z]+|\\frac|\\text|\\times|\\div)[^\[\]]*?)\s*\]', r'$\1$', text)
        
        # 替換 \[ ... \] 為 $$ ... $$
        text = re.sub(r'\\\[\s*(.+?)\s*\\\]', r'$$\1$$', text, flags=re.DOTALL)
        
        # 替換 \( ... \) 為 $ ... $
        text = re.sub(r'\\\(\s*(.+?)\s*\\\)', r'$\1$', text)
        
        return text

    def generate_outline(self, subject: str, grade: str, unit: str) -> str:
        """
        階段一：生成教學大綱（JSON格式）
        返回結構化的章節資訊，用於後續分章節生成內容
        """
        prompt = f"""
你是一位專業的教育內容規劃師。請為以下教學需求生成一個結構化的教學大綱。

科目：{subject}
年級：{grade}
單元：{unit}

請以標準的 JSON 格式輸出大綱，只輸出JSON，不要包含任何其他文字或markdown標記。

格式如下（請嚴格遵守此格式）：
{{
  "title": "單元標題",
  "objectives": [
    "學習目標1",
    "學習目標2",
    "學習目標3"
  ],
  "chapters": [
    {{
      "chapter_number": 1,
      "title": "章節標題",
      "topics": [
        "主題1",
        "主題2",
        "主題3"
      ],
      "description": "本章節的簡短描述"
    }},
    {{
      "chapter_number": 2,
      "title": "章節標題",
      "topics": [
        "主題1",
        "主題2"
      ],
      "description": "本章節的簡短描述"
    }}
  ]
}}

要求：
1. 大綱應該循序漸進，從基礎到進階
2. 考慮該年級學生的認知能力
3. 確保邏輯連貫性
4. 包含 3-5 個主要章節
5. 每個章節包含 2-4 個主題
6. 只輸出有效的 JSON，不要有額外的文字說明
"""
        
        chat_completion = self.client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=self.model,
            temperature=0.7,
            max_tokens=4096,
        )
        
        return chat_completion.choices[0].message.content

    def generate_chapter_content(self, subject: str, grade: str, unit: str, 
                                chapter_number: int, chapter_title: str, 
                                topics: list, full_outline: str) -> dict:
        """
        為單個章節生成詳細內容和練習題
        返回包含內容和練習題的字典
        """
        topics_text = "\n".join([f"- {topic}" for topic in topics])
        
        # 生成章節內容
        content_prompt = f"""
你是一位經驗豐富的{subject}老師。請為{grade}學生編寫以下章節的詳細教材內容。

單元：{unit}
章節：第{chapter_number}章 - {chapter_title}

本章節主題：
{topics_text}

完整大綱參考：
{full_outline}

要求：
1. 使用淺顯易懂的語言，適合{grade}學生的理解程度
2. 提供生活化的例子和情境
3. 對於數學/理化科目，請清楚說明公式和計算步驟
4. **【重要】數學公式格式規範**：
   - ✅ 正確：行內公式用單個 $ 符號，例如 $v = \\frac{{d}}{{t}}$
   - ✅ 正確：塊級公式用雙 $$ 符號，例如 $$E = mc^2$$
   - ❌ 錯誤：絕對不要使用方括號 [ ] 包裹公式
   - ❌ 錯誤：不要寫成 [ v = \\frac{{d}}{{t}} ]
   - 範例：計算速率時寫 $v = \\frac{{30\\text{{ km}}}}{{2\\text{{ h}}}} = 15\\text{{ km/h}}$
5. **表格請使用標準 Markdown 表格格式**，例如：
   | 項目 | 說明 |
   |------|------|
   | 內容1 | 說明1 |
6. 適當使用圖表說明（用文字描述圖表內容）
7. 每個概念後面提供簡單的範例
8. 使用 Markdown 格式輸出，包含適當的標題層級（##, ###）
9. 本章節內容應該完整且詳細，約500-800字

請生成完整的章節內容：
"""
        
        content_completion = self.client.chat.completions.create(
            messages=[{"role": "user", "content": content_prompt}],
            model=self.model,
            temperature=0.7,
            max_tokens=2048,
        )
        
        chapter_content = content_completion.choices[0].message.content
        
        # 自動修正 LaTeX 公式格式
        chapter_content = self._fix_latex_brackets(chapter_content)
        
        # 生成該章節的練習題
        questions_prompt = f"""
你是一位專業的題目設計師。請根據以下章節內容，為{grade}學生設計練習題。

科目：{subject}
單元：{unit}
章節：第{chapter_number}章 - {chapter_title}

章節內容：
{chapter_content}

請以清晰的 Markdown 格式輸出 3-5 題練習題，**嚴格遵守以下格式**：

## 第1題（選擇題）
題目內容描述

A) 選項A的內容
B) 選項B的內容
C) 選項C的內容
D) 選項D的內容

**正確答案：** B

**詳細解析：**
詳細的解題步驟和說明

---

## 第2題（計算題）
如果是計算題也要提供選項：

A) 答案選項1
B) 答案選項2
C) 答案選項3
D) 答案選項4

**正確答案：** A

**詳細解析：**
計算過程和步驟

---

**重要格式要求：**
1. 每題必須以 ## 第X題（題型） 開始
2. 題型必須用中文全形括號：（選擇題）、（計算題）、（填充題）
3. 選項必須用 A) B) C) D) 格式，後面加空格
4. 每個選項獨立一行
5. 正確答案必須寫 **正確答案：** 然後空格加答案（只寫選項字母，如 A 或 B）
6. 詳細解析必須寫 **詳細解析：** 然後換行寫內容
7. 每題結束必須用 --- 分隔

要求：
1. 設計 3-5 題針對本章節的練習題
2. 題目難度應符合{grade}程度
3. 涵蓋本章節的主要概念
4. 對於數學題目，確保數值準確且合理
5. **【重要】數學公式格式規範**：
   - ✅ 正確：行內公式用 $公式$，例如 $x^2 + 1 = 0$
   - ✅ 正確：塊級公式用 $$公式$$
   - ❌ 錯誤：絕對不要使用方括號 [ ] 包裹公式
   - 範例：題目中寫 $5\\text{{ m/s}} = ?\\text{{ km/h}}$
6. **表格請使用標準 Markdown 表格格式**
7. 提供詳細的解題步驟和說明
8. 題型多樣化（選擇、填充、計算、問答等）
9. 使用清晰的 Markdown 格式，每題之間用分隔線（---）區分
"""
        
        questions_completion = self.client.chat.completions.create(
            messages=[{"role": "user", "content": questions_prompt}],
            model=self.model,
            temperature=0.7,
            max_tokens=2048,
        )
        
        chapter_questions = questions_completion.choices[0].message.content
        
        # 自動修正 LaTeX 公式格式
        chapter_questions = self._fix_latex_brackets(chapter_questions)
        
        return {
            "content": chapter_content,
            "questions": chapter_questions
        }

    def generate_content(self, subject: str, grade: str, unit: str, outline: str, progress_callback=None) -> str:
        """
        階段二：根據大綱逐章節生成詳細教材
        返回包含所有章節內容和練習題的JSON字符串
        """
        try:
            # 解析 JSON 大綱
            import json
            outline_data = json.loads(outline)
            
            # 準備結果結構
            result = {
                "title": outline_data['title'],
                "objectives": outline_data['objectives'],
                "chapters": []
            }
            
            # 逐章節生成內容
            chapters = outline_data['chapters']
            total_chapters = len(chapters)
            
            for index, chapter in enumerate(chapters, 1):
                chapter_num = chapter['chapter_number']
                chapter_title = chapter['title']
                topics = chapter['topics']
                description = chapter.get('description', '')
                
                print(f"正在生成第 {chapter_num} 章：{chapter_title}... ({index}/{total_chapters})")
                
                # 更新進度
                if progress_callback:
                    progress_callback(index, total_chapters)
                
                # 調用 AI 生成本章節內容和練習題
                chapter_data = self.generate_chapter_content(
                    subject, grade, unit,
                    chapter_num, chapter_title, topics,
                    outline
                )
                
                # 添加到結果中
                result["chapters"].append({
                    "chapter_number": chapter_num,
                    "title": chapter_title,
                    "topics": topics,
                    "description": description,
                    "content": chapter_data["content"],
                    "questions": chapter_data["questions"]
                })
            
            print(f"所有章節生成完成！")
            
            # 返回JSON字符串
            return json.dumps(result, ensure_ascii=False, indent=2)
            
        except json.JSONDecodeError as e:
            # 如果 JSON 解析失敗，回退到原來的方法
            print(f"JSON 解析失敗: {e}，使用備用方法")
            return self._generate_content_fallback(subject, grade, unit, outline)
    
    def _generate_content_fallback(self, subject: str, grade: str, unit: str, outline: str) -> str:
        """
        備用方法：如果 JSON 解析失敗，使用原來的一次性生成方法
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
6. 使用清晰的段落和標題組織內容
7. 用 Markdown 格式輸出，包含適當的標題層級（#, ##, ###）和條列

請生成完整且結構清晰的教材內容，確保學生能夠理解並應用所學知識。
"""
        
        chat_completion = self.client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=self.model,
            temperature=0.7,
            max_tokens=4096,
        )
        
        return chat_completion.choices[0].message.content

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

請以清晰的文字格式輸出題目，格式範例：

# 練習題

## 第1題（選擇題）
題目內容

A) 選項A
B) 選項B  
C) 選項C
D) 選項D

**正確答案：** B

**詳細解析：**
解題步驟和說明...

---

## 第2題（計算題）
題目內容

**正確答案：** 答案內容

**詳細解析：**
解題步驟和說明...

---

要求：
1. 設計 5-8 題練習題
2. 題目難度應符合{grade}程度
3. 涵蓋教材中的主要概念
4. 對於數學題目，確保數值準確且合理
5. 提供詳細的解題步驟和說明
6. 題型多樣化（選擇、填充、計算、問答等）
7. 使用清晰的 Markdown 格式，每題之間用分隔線（---）區分
"""
        
        chat_completion = self.client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=self.model,
            temperature=0.7,
            max_tokens=4096,
        )
        
        return chat_completion.choices[0].message.content

