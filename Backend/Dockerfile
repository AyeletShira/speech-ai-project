# שימוש בגרסת פייתון קלה ומהירה
FROM python:3.9-slim

# הגדרת תיקיית העבודה בתוך הקונטיינר
WORKDIR /app

# העתקת קובץ הדרישות והתקנת הספריות (עם תיקון לסינון אינטרנט)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org

# העתקת שאר הקוד
COPY . .

# פתיחת הפורט שהשרת מאזין לו
EXPOSE 8000

# הפקודה שתריץ את השרת
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]