
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import report_routes as report

app = FastAPI(title="Speech Therapy AI API")


app.add_middleware(
    CORSMiddleware,
   allow_origins=[
        "https://speech-ai-project-1.onrender.com", 
        "http://localhost:5173" 
    ],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)


app.include_router(report.router, prefix="/reports", tags=["reports"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Speech Therapy AI API"}