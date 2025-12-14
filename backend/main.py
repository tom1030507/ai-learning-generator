from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict
import json

from database import engine, get_db, Base
from models import Generation
from schemas import (
    GenerateOutlineRequest,
    GenerateContentRequest,
    GenerateQuestionsRequest,
    OutlineResponse,
    ContentResponse,
    QuestionsResponse,
    GenerationHistoryItem
)
from groq_service import GroqService
from config import settings

# 建立資料庫表
Base.metadata.create_all(bind=engine)

# 用於儲存生成進度的全域字典
generation_progress: Dict[int, Dict] = {}

app = FastAPI(title="智慧教材生成平台 API")

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化 Groq 服務
groq_service = GroqService()

@app.get("/")
def root():
    return {"message": "智慧教材生成平台 API", "status": "running"}

@app.post("/api/generate-outline", response_model=OutlineResponse)
def generate_outline(
    request: GenerateOutlineRequest,
    db: Session = Depends(get_db)
):
    """
    階段一：生成教學大綱
    """
    try:
        # 生成大綱
        outline = groq_service.generate_outline(
            request.subject,
            request.grade,
            request.unit
        )
        
        # 儲存到資料庫
        generation = Generation(
            subject=request.subject,
            grade=request.grade,
            unit=request.unit,
            outline=outline
        )
        db.add(generation)
        db.commit()
        db.refresh(generation)
        
        return OutlineResponse(
            generation_id=generation.id,
            outline=outline
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"生成大綱失敗: {str(e)}")

@app.post("/api/generate-content", response_model=ContentResponse)
def generate_content(
    request: GenerateContentRequest,
    db: Session = Depends(get_db)
):
    """
    階段二：根據大綱生成詳細教材（支持進度追蹤）
    """
    try:
        # 取得 generation 記錄
        generation = db.query(Generation).filter(
            Generation.id == request.generation_id
        ).first()
        
        if not generation:
            raise HTTPException(status_code=404, detail="找不到該記錄")
        
        # 初始化進度（從0開始）
        try:
            outline_data = json.loads(request.outline)
            total_chapters = len(outline_data.get('chapters', []))
            generation_progress[request.generation_id] = {
                "current": 0,
                "total": total_chapters,
                "status": "processing"
            }
        except:
            total_chapters = 0
        
        # 生成教材內容（帶進度回調）
        def progress_callback(current, total):
            generation_progress[request.generation_id] = {
                "current": current,
                "total": total,
                "status": "processing"
            }
        
        content = groq_service.generate_content(
            generation.subject,
            generation.grade,
            generation.unit,
            request.outline,
            progress_callback=progress_callback
        )
        
        # 更新資料庫
        generation.content = content
        db.commit()
        db.refresh(generation)
        
        # 完成進度
        if request.generation_id in generation_progress:
            generation_progress[request.generation_id]["status"] = "completed"
        
        return ContentResponse(
            generation_id=generation.id,
            content=content
        )
    except HTTPException:
        raise
    except Exception as e:
        # 錯誤時更新進度
        if request.generation_id in generation_progress:
            generation_progress[request.generation_id]["status"] = "error"
        raise HTTPException(status_code=500, detail=f"生成教材失敗: {str(e)}")

@app.get("/api/generation-progress/{generation_id}")
def get_generation_progress(generation_id: int):
    """
    查詢教材生成進度
    """
    if generation_id not in generation_progress:
        return {"current": 0, "total": 0, "status": "not_started"}
    
    return generation_progress[generation_id]

@app.post("/api/generate-questions", response_model=QuestionsResponse)
def generate_questions(
    request: GenerateQuestionsRequest,
    db: Session = Depends(get_db)
):
    """
    階段三：根據教材生成練習題
    """
    try:
        # 取得 generation 記錄
        generation = db.query(Generation).filter(
            Generation.id == request.generation_id
        ).first()
        
        if not generation:
            raise HTTPException(status_code=404, detail="找不到該記錄")
        
        # 生成練習題
        questions = groq_service.generate_questions(
            generation.subject,
            generation.grade,
            generation.unit,
            request.content
        )
        
        # 更新資料庫
        generation.questions = questions
        db.commit()
        db.refresh(generation)
        
        return QuestionsResponse(
            generation_id=generation.id,
            questions=questions
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"生成題目失敗: {str(e)}")

@app.get("/api/history", response_model=List[GenerationHistoryItem])
def get_history(db: Session = Depends(get_db)):
    """
    取得所有歷史記錄
    """
    generations = db.query(Generation).order_by(Generation.created_at.desc()).all()
    return generations

@app.get("/api/history/{generation_id}", response_model=GenerationHistoryItem)
def get_history_item(generation_id: int, db: Session = Depends(get_db)):
    """
    取得特定記錄的詳細內容
    """
    generation = db.query(Generation).filter(Generation.id == generation_id).first()
    if not generation:
        raise HTTPException(status_code=404, detail="找不到該記錄")
    return generation

@app.delete("/api/history/{generation_id}")
def delete_history_item(generation_id: int, db: Session = Depends(get_db)):
    """
    刪除特定歷史記錄
    """
    generation = db.query(Generation).filter(Generation.id == generation_id).first()
    if not generation:
        raise HTTPException(status_code=404, detail="找不到該記錄")
    
    db.delete(generation)
    db.commit()
    return {"status": "success", "message": "已刪除歷史記錄", "id": generation_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



