from fastapi.testclient import TestClient
from unittest.mock import patch
import sys
import os

# טריק קטן כדי שנוכל לייבא את main שנמצא תיקייה אחת למעלה
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from main import app

client = TestClient(app)

def test_read_root():
    """
    בדיקה שהשרת עולה
    """
    response = client.get("/")
    assert response.status_code == 200
    # מוודאים שהתשובה היא מה שכתוב ב-main.py
    assert response.json() == {"message": "Welcome to Speech Therapy AI API"}

@patch("app.services.report_service.generate_with_gemini") 
def test_generate_report_end_to_end(mock_gemini):
    """
    בדיקת מערכת מלאה (Integration Test):
    אנחנו שולחים בקשה לראוטר -> הוא פונה לסרוויס -> הסרוויס פונה ל-AI.
    אנחנו עוצרים את השרשרת רגע לפני גוגל (Mock ל-Gemini) כדי לא לבזבז משאבים.
    """
    
    # 1. התשובה המזויפת שה-AI "יחזיר" לנו
    mock_gemini.return_value = """
    דוח בדיקה:
    המטופל מתקדם יפה.
    מטרות להמשך: תרגול נוסף.
    """

    # 2. הנתונים שנשלח
    payload = {
        "patient_name": "יוסי בדיקה",
        "sessions": [
            {
                "date": "01/01/2025",
                "exercises_done": ["תרגול ש"],
                "notes": "בדיקת אינטגרציה מלאה"
            }
        ]
    }

    # 3. שליחת הבקשה
    response = client.post("/reports/generate", json=payload)

    # 4. בדיקה שהכל עבר בשלום (200 OK)
    assert response.status_code == 200
    
    # 5. בדיקה שהתשובה מכילה את הטקסט המזויף שלנו
    data = response.json()
    assert "המטופל מתקדם יפה" in data["report_text"]
    
    # 6. וידוא שהפונקציה של ה-AI באמת נקראה
    assert mock_gemini.called