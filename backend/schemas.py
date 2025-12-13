from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict

class GenerateOutlineRequest(BaseModel):
    subject: str
    grade: str
    unit: str

class GenerateContentRequest(BaseModel):
    generation_id: int
    outline: str

class GenerateQuestionsRequest(BaseModel):
    generation_id: int
    content: str

class OutlineResponse(BaseModel):
    generation_id: int
    outline: str

class ContentResponse(BaseModel):
    generation_id: int
    content: str

class QuestionsResponse(BaseModel):
    generation_id: int
    questions: str

class GenerationHistoryItem(BaseModel):
    id: int
    subject: str
    grade: str
    unit: str
    outline: Optional[str]
    content: Optional[str]
    questions: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True



