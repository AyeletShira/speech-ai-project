import requests
import os
from dotenv import load_dotenv
import urllib3

# עוקף את חסימת נטפרי/רימון
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def generate_with_gemini(prompt_text):
    # טעינה ושליפה בתוך הפונקציה מבטיחה שנקבל את הערך המעודכן ביותר
    load_dotenv() 
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    if not api_key:
        return "Error: GEMINI_API_KEY is missing. Please check Render Environment variables."

    model_name = "gemini-flash-latest" # עדכון קטן לשם המודל העדכני
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
    
    headers = {'Content-Type': 'application/json'}
    payload = {
        "contents": [{
            "parts": [{"text": prompt_text}]
        }]
    }

    try:
        # שימוש ב-verify=False חשוב בגלל תעודות האבטחה של הסינון
        response = requests.post(url, json=payload, headers=headers, verify=False)
        
        if response.status_code == 200:
            data = response.json()
            return data['candidates'][0]['content']['parts'][0]['text']
        else:
            return f"Error ({response.status_code}): {response.text}"
    except Exception as e:
        return f"Connection Error: {str(e)}"