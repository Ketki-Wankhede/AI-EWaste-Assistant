from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func

from backend.database.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    image_name = Column(String(255))
    predicted_category = Column(String(100))
    confidence = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    user_feedback = Column(Text, nullable=True)

class DisposalRule(Base):
    __tablename__ = "disposal_rules"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), unique=True, nullable=False)
    action = Column(Text, nullable=False)
    safety_warning = Column(Text, nullable=False)
    handling_instruction = Column(Text, nullable=False)