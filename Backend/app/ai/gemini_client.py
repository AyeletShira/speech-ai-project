import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# ניסיון לשלוף מפתח, אבל בלי להפיל את התוכנה אם אין (בשביל הטסטים בגיטהאב)
api_key = os.getenv("GOOGLE_API_KEY")

if api_key:
    genai.configure(api_key=api_key)

def generate_with_gemini(prompt_text):
    # אם אין מפתח, נחזיר שגיאה רק כשמנסים להשתמש בפונקציה
    if not api_key:
        return "Error: GOOGLE_API_KEY is missing. Cannot generate report."
        
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt_text)
        return response.text
    except Exception as e:
        return f"Error connecting to AI: {str(e)}"