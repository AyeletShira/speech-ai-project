
from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str  # "user" (הקלינאית) או "model" (ה-AI)
    content: str

class TherapySession(BaseModel):
    date: str
    exercises_done: List[str]
    notes: Optional[str]

class ReportInput(BaseModel):
    patient_name: str
    sessions: List[TherapySession]

# מודל חדש לבקשת תיקון דוח (Revision)
class RevisionInput(BaseModel):
    patient_name: str
    history: List[ChatMessage] # כל השיחה שהייתה עד כה
    new_instructions: str      # מה המשתמש רוצה לתקן (למשל: "תשנה ללשון נקבה")

class ReportOutput(BaseModel):
    report_text: str