import sys
import os
from fastapi.testclient import TestClient
from unittest.mock import patch

# מוודא שהבדיקות מזהות את התיקייה הראשית (main.py)
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from main import app

client = TestClient(app)

### --- בדיקות בסיסיות (Unit Tests) ---

def test_read_root():
    """בדיקה שהשרת עולה ומחזיר את הודעת הפתיחה הנכונה"""
    response = client.get("/")
    assert response.status_code == 200
    # שימי לב: הטקסט כאן חייב להיות זהה למה שמופיע ב-main.py שלך
    assert response.json() == {"message": "Welcome to Speech Therapy AI API"}

def test_route_not_found():
    """מוודא שהשרת מחזיר 404 בכתובת לא קיימת"""
    response = client.get("/this-route-does-not-exist")
    assert response.status_code == 404


### --- בדיקות אימות נתונים (Validation / 422 Errors) ---

def test_generate_report_empty_body():
    """בדיקה ששליחת אובייקט ריק מחזירה שגיאת ולידציה"""
    response = client.post("/reports/generate", json={})
    assert response.status_code == 422

def test_generate_invalid_data_types():
    """בדיקה ששליחת סוג נתונים לא תקין (מחרוזת במקום רשימה) נחסמת"""
    payload = {
        "patient_name": "Test User",
        "sessions": "This should be a list" 
    }
    response = client.post("/reports/generate", json=payload)
    assert response.status_code == 422


### --- בדיקת אינטגרציה (Integration Test) ---

@patch("app.services.report_service.generate_with_gemini") 
def test_generate_report_end_to_end(mock_gemini):
    """
    בדיקת זרימה מלאה: קבלת נתונים -> עיבוד -> החזרת דוח.
    משתמשים ב-Mock כדי לא לפנות באמת ל-API של גוגל בזמן הבדיקה.
    """
    # 1. הגדרת תשובה מזויפת מה-AI
    mock_gemini.return_value = "דוח בדיקה: המטופל מתקדם יפה."

    # 2. הנתונים המדויקים לפי ה-Schema שלך
    payload = {
        "patient_name": "זאבי בדיקה",
        "sessions": [
            {
                "date": "01/01/2025",
                "exercises_done": ["תרגול היגוי"],
                "notes": "בדיקת מערכת"
            }
        ]
    }

    # 3. ביצוע הבקשה
    response = client.post("/reports/generate", json=payload)

    # 4. וידוא הצלחה
    assert response.status_code == 200
    data = response.json()
    assert "report_text" in data
    assert "המטופל מתקדם יפה" in data["report_text"]
    
    # 5. וידוא שהלוגיקה הפנימית אכן קראה ל-AI
    assert mock_gemini.called