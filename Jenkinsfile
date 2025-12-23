pipeline {
    agent any

    environment {
        // כאן מגדירים את ה-Key כדי שהטסטים לא ייכשלו
        GEMINI_API_KEY = credentials('GEMINI_API_KEY')
    }

    stages {
        stage('Initial Cleanup') {
            steps {
                // ניקוי שאריות מהרצות קודמות
                sh 'docker-compose down'
            }
        }

        stage('Install Dependencies') {
            steps {
                // עקיפת נטפרי בזמן התקנת הספריות בעזרת trusted-host
                sh 'pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt'
            }
        }

        stage('Run Tests') {
            steps {
                // הרצת הבדיקות שחברה שלך כתבה
                sh 'pytest app/tests/test_routes.py'
            }
        }

        stage('Docker Build & Up') {
            steps {
                // בנייה והרצה של הדוקר כדי לוודא שהכל עולה תקין
                sh 'docker-compose up --build -d'
            }
        }
    }

    post {
        always {
            // תמיד להוריד את הקונטיינרים בסוף כדי לא להעמיס על המחשב
            sh 'docker-compose down'
        }
    }
}