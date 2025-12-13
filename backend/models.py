from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from database import Base

class Generation(Base):
    __tablename__ = "generations"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(100), nullable=False)
    grade = Column(String(50), nullable=False)
    unit = Column(String(200), nullable=False)
    outline = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    questions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)



