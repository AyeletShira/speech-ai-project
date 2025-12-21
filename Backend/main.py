# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.api import report_routes as report
# import urllib3

# # ביטול אזהרות נטפרי (חשוב!)
# urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# app = FastAPI(title="Speech Therapist Report Generator")

# # --- התיקון הקריטי: הגדרת CORS שמרשה הכל ---
# # חייב להיות מוגדר *לפני* שהראוטר נטען
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],     # מאפשר כניסה מכל כתובת (כולל localhost:5173)
#     allow_credentials=True,
#     allow_methods=["*"],     # מאפשר את כל הפעולות (כולל OPTIONS ו-POST)
#     allow_headers=["*"],     # מאפשר את כל הכותרות
# )

# # חיבור הנתיבים (Routes)
# app.include_router(report.router, prefix="/reports", tags=["Reports"])

# @app.get("/")
# async def root():
#     return {"message": "Server is running correctly with CORS enabled!"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import report_routes as report

app = FastAPI(title="Speech Therapy AI API")

# הגדרות CORS - זה התיקון הקריטי!
app.add_middleware(
    CORSMiddleware,
   allow_origins=[
        "https://speech-ai-project-1.onrender.com", 
        "http://localhost:5173" # חשוב מאוד לבדיקות מקומיות!
    ],
    allow_credentials=True,
    allow_methods=["*"],  # מאפשר את כל סוגי הבקשות (POST, GET וכו')
    allow_headers=["*"],
)

# חיבור הנתיבים
app.include_router(report.router, prefix="/reports", tags=["reports"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Speech Therapy AI API"}