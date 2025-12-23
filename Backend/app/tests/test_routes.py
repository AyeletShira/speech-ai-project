import sys
import os
from fastapi.testclient import TestClient
from unittest.mock import patch

# מוודא שהטסט מזהה את התיקייה הראשית של השרת
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from main import app

client = TestClient(app)

### --- בדיקות בסיסיות (Sanity) ---

def test_read_root():
    """בדיקה שהשרת באוויר"""
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome" in response.json()["message"]

def test_route_not_found():
    """בדיקה שכתובת לא קיימת מחזירה 404"""
    response = client.get("/this-route-does-not-exist")
    assert response.status_code == 404

### --- בדיקות ולידציה (שגיאות 422) ---

def test_generate_report_empty_body():
    """בדיקה ששליחת גוף ריק נכשלת"""
    response = client.post("/reports/generate", json={})
    assert response.status_code == 422

def test_generate_report_missing_fields():
    """בדיקה שחסר שם מטופל או סשנים"""
    payload = {"patient_name": "אילת"} # חסר sessions
    response = client.post("/reports/generate", json=payload)
    assert response.status_code == 422

### --- בדיקות לוגיקה והקפצת ה-Coverage ל-90% ---

# כאן אנחנו משתמשים בשם הפונקציה המדויק מהקוד שלך: revise_report_with_history
@patch("app.services.report_service.revise_report_with_history")
def test_revise_report_success(mock_revise):
    """בדיקת נתיב התיקון (Revise) - מעלה משמעותית את הכיסוי"""
    mock_revise.return_value = "דוח מעודכן: תוקנו פעלים בזמן עבר."
    
    payload = {
        "patient_name": "יוני",
        "history": [{"role": "user", "content": "נתונים מקוריים"}],
        "new_instructions": "תקן לשון זכר/נקבה"
    }
    
    response = client.post("/reports/revise", json=payload)
    assert response.status_code == 200
    assert "תוקנו פעלים" in response.json()["report_text"]
    assert mock_revise.called

# כאן אנחנו משתמשים בשם הפונקציה המדויק מהקוד שלך: create_report
@patch("app.services.report_service.create_report")
def test_generate_report_server_error(mock_create):
    """בדיקת טיפול בשגיאות כשה-AI נכשל"""
    mock_create.side_effect = Exception("Gemini API Error")
    
    payload = {
        "patient_name": "בדיקה",
        "sessions": [{"date": "2025-01-01", "notes": "הערות"}]
    }
    
    response = client.post("/reports/generate", json=payload)
    # במידה והגדרת ב-Route להחזיר 500 בשגיאה
    assert response.status_code == 500
    assert "detail" in response.json()

@patch("app.services.report_service.create_report")
def test_generate_report_end_to_end(mock_create):
    """בדיקת יצירת דוח מושלמת מקצה לקצה"""
    mock_create.return_value = "## בסד\n## בקשת המשך טיפול\nשם מטופל: יוני בדיקה"
    
    payload = {
        "patient_name": "יוני בדיקה",
        "sessions": [{"date": "01/01/2025", "notes": "הילד מראה התקדמות יפה"}]
    }
    
    response = client.post("/reports/generate", json=payload)
    assert response.status_code == 200
    assert "יוני בדיקה" in response.json()["report_text"]
    assert "בסד" in response.json()["report_text"]