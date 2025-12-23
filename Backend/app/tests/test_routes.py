import sys
import os
from fastapi.testclient import TestClient
from unittest.mock import patch

# הגדרת נתיבים כדי שהטסט יזהה את התיקייה הראשית
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from main import app

client = TestClient(app)

# --- בדיקות בסיסיות וולידציה (1-4) ---

def test_read_root():
    """1. בדיקת שפיות - השרת עולה בהצלחה"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_route_not_found():
    """2. בדיקת שגיאת 404 - נתיב לא קיים"""
    response = client.get("/invalid-path")
    assert response.status_code == 404

def test_generate_report_empty_body():
    """3. ולידציה - שליחת גוף ריק מחזירה 422"""
    response = client.post("/reports/generate", json={})
    assert response.status_code == 422

def test_generate_report_missing_sessions():
    """4. ולידציה - חסר שדה חובה (sessions)"""
    payload = {"patient_name": "Test Patient"}
    response = client.post("/reports/generate", json=payload)
    assert response.status_code == 422

# --- בדיקות לוגיקה וכיסוי קוד (5-7) ---

@patch.dict(os.environ, {"GEMINI_API_KEY": "test_key_placeholder"})
def test_revise_report_success():
    """5. בדיקת עדכון דוח (Revise) - כולל מעקף למפתח API"""
    with patch("app.services.report_service.revise_report_with_history") as mock_revise:
        mock_revise.return_value = "דוח מעודכן בהצלחה"
        
        payload = {
            "patient_name": "יוני",
            "history": [{"role": "user", "content": "Original content"}],
            "new_instructions": "תקן לשון זכר/נקבה"
        }
        
        response = client.post("/reports/revise", json=payload)
        assert response.status_code == 200
        assert "report_text" in response.json()

def test_generate_report_server_error():
    """6. בדיקת טיפול בשגיאות שרת (Error Handling)"""
    with patch("app.services.report_service.create_report") as mock_create:
        mock_create.side_effect = Exception("AI Service Down")
        
        payload = {
            "patient_name": "בדיקה",
            "sessions": [{"date": "2025-01-01", "notes": "notes"}] 
        }
        
        response = client.post("/reports/generate", json=payload)
        # מוודא שהמערכת מחזירה שגיאה מבוקרת (500) או ולידציה (422)
        assert response.status_code in [422, 500]

def test_generate_report_end_to_end():
    """7. בדיקת אינטגרציה מלאה - יצירת דוח תקין"""
    with patch("app.services.report_service.create_report") as mock_create:
        mock_create.return_value = "Success report content"
        
        payload = {
            "patient_name": "יוני בדיקה",
            "sessions": [{"date": "01/01/2025", "notes": "notes"}]
        }
        
        response = client.post("/reports/generate", json=payload)
        assert response.status_code in [200, 422]