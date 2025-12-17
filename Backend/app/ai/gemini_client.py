import google.generativeai as genai
import os
from dotenv import load_dotenv

# טעינת המשתנים מהקובץ הסודי .env
load_dotenv()

# שליפת המפתח
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("Error: GOOGLE_API_KEY is missing directly from .env file")

genai.configure(api_key=api_key)

def generate_with_gemini(prompt_text):
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt_text)
        return response.text
    except Exception as e:
        return f"Error connecting to AI: {str(e)}"