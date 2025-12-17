# import google.generativeai as genai
# import os
# from dotenv import load_dotenv

# load_dotenv()

# # ניסיון לשלוף מפתח, אבל בלי להפיל את התוכנה אם אין (בשביל הטסטים בגיטהאב)
# api_key = os.getenv("GOOGLE_API_KEY")

# if api_key:
#     genai.configure(api_key=api_key)

# def generate_with_gemini(prompt_text):
#     # אם אין מפתח, נחזיר שגיאה רק כשמנסים להשתמש בפונקציה
#     if not api_key:
#         return "Error: GOOGLE_API_KEY is missing. Cannot generate report."
        
#     try:
#         model = genai.GenerativeModel('gemini-pro')
#         response = model.generate_content(prompt_text)
#         return response.text
#     except Exception as e:
#         return f"Error connecting to AI: {str(e)}"

import requests
import os
from dotenv import load_dotenv
import urllib3

# עוקף את חסימת נטפרי/רימון
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY", "").strip()

def generate_with_gemini(prompt_text):
    if not api_key:
        return "Error: GOOGLE_API_KEY is missing."

 # --- התיקון: שימוש בשם הכללי והיציב ביותר ---
    model_name = "gemini-flash-latest"
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
    
    headers = {'Content-Type': 'application/json'}
    payload = {
        "contents": [{
            "parts": [{"text": prompt_text}]
        }]
    }

    try:
        # שליחה עם verify=False כדי לעבור את הסינון
        response = requests.post(url, json=payload, headers=headers, verify=False)
        
        if response.status_code == 200:
            data = response.json()
            # חילוץ הטקסט מהתשובה
            return data['candidates'][0]['content']['parts'][0]['text']
        else:
            return f"Error ({response.status_code}): {response.text}"

    except Exception as e:
        return f"Connection Error: {str(e)}"