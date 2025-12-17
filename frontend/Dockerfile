# שלב 1: בניית האתר
FROM node:22-alpine

WORKDIR /app

# התקנת התלויות
COPY package.json package-lock.json ./
RUN npm install

# העתקת הקוד ובנייה
COPY . .

# חשיפת הפורט
EXPOSE 5173

# הרצת האתר במצב פיתוח (כדי שיהיה קל לראות שינויים)
CMD ["npm", "run", "dev", "--", "--host"]