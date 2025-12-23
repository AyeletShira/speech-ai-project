from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# 1. בדיקת שפיות (Sanity Check)
# בודקת שהשרת עולה ומחזיר 'Welcome' בדף הראשי
def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome" in response.json()["message"]

# 2. בדיקת ולידציה: שליחת JSON ריק לנתיב יצירת הדוח
# השרת אמור לזהות שחסרים שדות חובה (כמו patient_name) ולהחזיר שגיאה 422
def test_generate_report_empty_body():
    response = client.post("/reports/generate", json={})
    assert response.status_code == 422

# 3. בדיקת ולידציה: שליחת מידע חלקי
# נשלח שם מטופל אבל בלי רשימת סשנים - השרת אמור לסרב
def test_generate_report_missing_sessions():
    payload = {
        "patient_name": "Yael Test"
        # חסר כאן שדה sessions
    }
    response = client.post("/reports/generate", json=payload)
    assert response.status_code == 422

# 4. בדיקת נתיב שלא קיים (404)
# מוודא שהשרת לא קורס כשפונים לכתובת לא נכונה
def test_route_not_found():
    response = client.post("/reports/this-does-not-exist")
    assert response.status_code == 404

# 5. בדיקת מבנה נתונים לא חוקי
# ננסה לשלוח מחרוזת במקום רשימה בסשנים
def test_generate_invalid_data_types():
    payload = {
        "patient_name": "Test User",
        "sessions": "This should be a list, not a string" 
    }
    response = client.post("/reports/generate", json=payload)
    assert response.status_code == 422