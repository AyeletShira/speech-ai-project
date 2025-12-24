from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome" in response.json()["message"]

def test_generate_report_empty_body():
    response = client.post("/reports/generate", json={})
    assert response.status_code == 422


def test_generate_report_missing_sessions():
    payload = {
        "patient_name": "Yael Test"
        
    }
    response = client.post("/reports/generate", json=payload)
    assert response.status_code == 422


def test_route_not_found():
    response = client.post("/reports/this-does-not-exist")
    assert response.status_code == 404


def test_generate_invalid_data_types():
    payload = {
        "patient_name": "Test User",
        "sessions": "This should be a list, not a string" 
    }
    response = client.post("/reports/generate", json=payload)
    assert response.status_code == 422