import sys
import os
from fastapi.testclient import TestClient
from unittest.mock import patch

# Ensure tests recognize the main directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from main import app

client = TestClient(app)

### --- Existing Tests (Keep these) ---

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Speech Therapy AI API"}

def test_route_not_found():
    response = client.get("/this-route-does-not-exist")
    assert response.status_code == 404

def test_generate_report_empty_body():
    response = client.post("/reports/generate", json={})
    assert response.status_code == 422

### --- NEW: Tests to boost coverage to 90% ---

@patch("app.services.report_service.revise_report_with_gemini")
def test_revise_report_success(mock_revise):
    """
    Test 8: Testing the 'revise' endpoint.
    This covers the logic in report_routes and report_service for updating reports.
    """
    mock_revise.return_value = "Updated Report: Fixed gender pronouns."
    
    payload = {
        "patient_name": "Johnny",
        "history": [{"role": "user", "content": "Original report data"}],
        "new_instructions": "Change to female pronouns"
    }
    
    response = client.post("/reports/revise", json=payload)
    assert response.status_code == 200
    assert "Fixed gender pronouns" in response.json()["report_text"]
    assert mock_revise.called

@patch("app.services.report_service.generate_with_gemini")
def test_generate_report_server_error(mock_gemini):
    """
    Test 9: Testing Error Handling.
    What happens if the AI service fails? This covers the 'try-except' blocks.
    """
    # Force the mock to raise an exception
    mock_gemini.side_effect = Exception("AI Service Unavailable")
    
    payload = {
        "patient_name": "Test",
        "sessions": [{"date": "2025-01-01", "exercises_done": [], "notes": "Some notes"}]
    }
    
    response = client.post("/reports/generate", json=payload)
    # This should trigger your error handling logic and return 500 or a specific error
    assert response.status_code == 500
    assert "detail" in response.json()

@patch("app.services.report_service.generate_with_gemini")
def test_generate_report_end_to_end(mock_gemini):
    """
    Test 10: Full integration (Updated)
    """
    mock_gemini.return_value = "Test Report: Patient is progressing well."
    payload = {
        "patient_name": "Johnny Test",
        "sessions": [{"date": "01/01/2025", "exercises_done": ["ABC"], "notes": "Test"}]
    }
    response = client.post("/reports/generate", json=payload)
    assert response.status_code == 200
    assert "progressing well" in response.json()["report_text"]