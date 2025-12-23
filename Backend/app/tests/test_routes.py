import sys
import os
from fastapi.testclient import TestClient
from unittest.mock import patch

# Ensure tests recognize the main directory (main.py)
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from main import app

client = TestClient(app)

### --- Basic Functionality (Unit Tests) ---

def test_read_root():
    """1. Test server availability and welcome message"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Speech Therapy AI API"}

def test_route_not_found():
    """2. Verify 404 error handling for non-existent routes"""
    response = client.get("/this-route-does-not-exist")
    assert response.status_code == 404


### --- Data Validation & Security (422 Errors) ---

def test_generate_report_empty_body():
    """3. Test that sending an empty object triggers a validation error"""
    response = client.post("/reports/generate", json={})
    assert response.status_code == 422

def test_generate_invalid_data_types():
    """4. Test that invalid data types (string instead of list) are blocked"""
    payload = {
        "patient_name": "Test User",
        "sessions": "Invalid Data Type" 
    }
    response = client.post("/reports/generate", json=payload)
    assert response.status_code == 422

def test_generate_report_missing_required_fields():
    """5. Test missing fields inside the session object (e.g., missing notes)"""
    payload = {
        "patient_name": "Johnny",
        "sessions": [{"date": "2025-01-01"}] # Missing 'exercises_done' and 'notes'
    }
    response = client.post("/reports/generate", json=payload)
    assert response.status_code == 422


### --- Integration & Business Logic ---

def test_large_input_validation():
    """6. Test handling of a very long patient name (Stress testing validation)"""
    payload = {
        "patient_name": "A" * 500, # Extremely long name
        "sessions": [{"date": "2025-01-01", "exercises_done": ["Test"], "notes": "Test"}]
    }
    response = client.post("/reports/generate", json=payload)
    # If your Pydantic model has no max_length, it should return 200 or 422 based on constraints
    assert response.status_code in [200, 422]

@patch("app.services.report_service.generate_with_gemini") 
def test_generate_report_end_to_end(mock_gemini):
    """
    7. Full Flow Integration Test: Data -> Logic -> AI Mock -> Response.
    """
    # Define a mock response
    mock_gemini.return_value = "Test Report: The patient is progressing well."

    payload = {
        "patient_name": "Johnny Test",
        "sessions": [
            {
                "date": "01/01/2025",
                "exercises_done": ["Articulation practice"],
                "notes": "System integration test"
            }
        ]
    }

    response = client.post("/reports/generate", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert "report_text" in data
    assert "progressing well" in data["report_text"]
    assert mock_gemini.called