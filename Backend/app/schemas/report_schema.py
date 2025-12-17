from pydantic import BaseModel
from typing import List, Optional

class TherapySession(BaseModel):
    date: str
    exercises_done: List[str]
    notes: Optional[str]

class ReportInput(BaseModel):
    patient_name: str
    sessions: List[TherapySession]

class ReportOutput(BaseModel):
    report_text: str
