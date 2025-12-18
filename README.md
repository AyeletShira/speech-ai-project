📋 Speech AI: Clinical Report Automation System
פרויקט גמר: בינה מלאכותית בשירות קלינאיות התקשורת
מערכת Full-Stack מבוססת AI המייצרת אוטומציה מלאה לכתיבת מסמכי "בקשה להמשך טיפול". המערכת מקצרת זמן כתיבת דוח מ-30 דקות ל-30 שניות בלבד, תוך שמירה על דיוק קליני ורהיטות שפתית.

🛠 הארכיטקטורה הטכנולוגית (Technical Stack)
Backend: FastAPI (Python 3.9) - בחירה בשרת אסינכרוני מהיר המאפשר ניהול בקשות AI ללא חסימת ה-Event Loop.

Frontend: React 18 + Vite - שימוש ב-State Management לניהול זרימת נתונים דינמית מהמשתמש ועד לקבלת התוצאה מה-AI.

Containerization: Docker & Docker Compose - ניהול סביבות עבודה מבודדות ל-Frontend ו-Backend, מה שמבטיח הרצה חלקה ("It works on my machine").

AI Integration: Google Gemini SDK (gemini-1.5-flash) - התממשקות למודלי שפה גדולים (LLM) דרך API מאובטח.

🧠 אסטרטגיית ה-Prompt Engineering
הפרויקט מתמקד בטכניקות מתקדמות של הנדסת פרומפטים:

Role Assignment: המודל הונחה לתפקד כקלינאית תקשורת בעלת ניסיון קליני עשיר.

Inference Logic: המערכת יודעת להסיק מסקנות רפואיות ממידע גולמי (למשל: הקשר בין ממצא א.א.ג לבין התקדמות שפתית).

Few-Shot & Domain Expertise: הטמעת דוגמאות לניתוח מקרים רב-לשוניים מורכבים (כמו המרה של שפה רביעית לעברית).

Constraint Satisfaction: אכיפה של מבנה דוח אחיד (בס"ד, רקע, סיכום אבחון כולל סטיות תקן, מטרות והמלצות).

🔄 זרימת נתונים (Detailed Data Flow)
Client-Side: איסוף נתונים גולמיים ומניפולציה של ה-DOM לצורך הצגת PDF ועריכה חיה.

Network Layer: תקשורת RESTful מאובטחת תחת הגדרות CORS קפדניות.

Server-Side Validation: שימוש ב-Pydantic Schemas לאימות מבנה הנתונים ומניעת שגיאות 422.

AI Processing: בניית פרומפט דינמי, עיבוד הנתונים ב-Cloud והחזרת תשובה מובנית (JSON).

🧪 אתגרים טכניים שפתרתי בפרויקט
סנכרון Container-to-Container: הגדרת תקשורת רשת פנימית בתוך Docker Compose לחיבור ה-Frontend ל-API.

RTL PDF Export: פתרון אתגרי ייצוא טקסט מימין לשמאל (Hebrew Support) בפורמט PDF בעזרת html2pdf.js.

Editable UI: יצירת ממשק עריכה אינטואיטיבי (WYSIWYG) המאפשר סנכרון בין טקסט ה-AI לבין התיקונים הידניים של הקלינאית.

CORS Management: הגדרת Middleware מורכב ב-FastAPI לאישור בקשות מדפדפנים בסביבת פיתוח מבוזרת.

🚀 הוראות הרצה מהירות
שכפול המאגר (git clone).


הרצה בטרמינל: docker-compose up --build.

פותח כפרויקט גמר על ידי איילת סורובסקי ויעל בלוך | דצמבר 2025