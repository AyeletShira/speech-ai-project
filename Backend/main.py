from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import report_routes as report
import urllib3

# ביטול אזהרות נטפרי (חשוב!)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = FastAPI(title="Speech Therapist Report Generator")

# --- התיקון הקריטי: הגדרת CORS שמרשה הכל ---
# חייב להיות מוגדר *לפני* שהראוטר נטען
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     # מאפשר כניסה מכל כתובת (כולל localhost:5173)
    allow_credentials=True,
    allow_methods=["*"],     # מאפשר את כל הפעולות (כולל OPTIONS ו-POST)
    allow_headers=["*"],     # מאפשר את כל הכותרות
)

# חיבור הנתיבים (Routes)
app.include_router(report.router, prefix="/reports", tags=["Reports"])

@app.get("/")
async def root():
    return {"message": "Server is running correctly with CORS enabled!"}