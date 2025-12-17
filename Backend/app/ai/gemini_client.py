import requests
import json
import os
import urllib3

# ביטול אזהרות אבטחה של נטפרי
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# כאן שימי את המפתח שלך (או תטעני אותו מ-env, אבל כרגע נשים ישירות לבדיקה)
API_KEY = "AIzaSyBp6M7vzYQvEx2MN0DRSU8W_4yPAK35al0" 
# שינוי שם המודל למשהו שקיים בוודאות ברשימה שלך
MODEL_NAME = "models/gemini-flash-latest"

def generate_with_gemini(prompt_text: str) -> str:
    """
    שולח בקשה לגוגל ג'מיני תוך עקיפת חסימת SSL של נטפרי
    """
    url = f"https://generativelanguage.googleapis.com/v1beta/{MODEL_NAME}:generateContent?key={API_KEY}"
    
    payload = {
        "contents": [{
            "parts": [{"text": prompt_text}]
        }]
    }
    
    headers = {'Content-Type': 'application/json'}
    
    try:
        # verify=False הוא הקסם שעוקף את נטפרי
        response = requests.post(url, headers=headers, json=payload, verify=False)
        
        if response.status_code == 200:
            data = response.json()
            return data['candidates'][0]['content']['parts'][0]['text']
        else:
            return f"Error from Google: {response.status_code} - {response.text}"
            
    except Exception as e:
        return f"System Error: {str(e)}"