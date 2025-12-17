import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [patientName, setPatientName] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)
  
  // משתנה חדש לניהול מצב הכפתור "העתק"
  const [isCopied, setIsCopied] = useState(false)

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setReport(null);
    setIsCopied(false); // איפוס כפתור ההעתקה

    const payload = {
      patient_name: patientName,
      sessions: [
        {
          date: new Date().toLocaleDateString("he-IL"),
          exercises_done: ["תרגול כללי"], 
          notes: notes
        }
      ]
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/reports/generate', payload);
      setReport(response.data.report_text);
    } catch (err) {
      console.error(err);
      setError("שגיאה: לא ניתן להתחבר לשרת. וודאי שהחלון השני פתוח.");
    } finally {
      setLoading(false);
    }
  };

  // פונקציה חדשה להעתקת הטקסט
  const handleCopy = () => {
    if (!report) return;
    
    navigator.clipboard.writeText(report);
    setIsCopied(true);
    
    // החזרת הכפתור למצב רגיל אחרי 2 שניות
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="container">
      <h1 className="header">📋 מחולל דוחות קלינאית תקשורת</h1>
      
      <div className="form-group">
        <label>שם המטופל/ת:</label>
        <input 
          type="text" 
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="לדוגמה: דני דניאל"
        />
      </div>

      <div className="form-group">
        <label>הערות גולמיות מהטיפול:</label>
        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="כתבי כאן מה קרה בטיפול..."
        />
      </div>

      <button onClick={handleGenerate} disabled={loading || !patientName || !notes}>
        {loading ? 'מייצר דוח... ⏳' : 'צור דוח מקצועי ✨'}
      </button>

      {error && <div className="error">{error}</div>}

      {report && (
        <div className="result-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>📄 הדוח המוכן:</h3>
            
            {/* כפתור ההעתקה החדש */}
            <button 
              onClick={handleCopy} 
              style={{ 
                width: 'auto', 
                padding: '8px 15px', 
                fontSize: '14px',
                backgroundColor: isCopied ? '#27ae60' : '#95a5a6' 
              }}
            >
              {isCopied ? 'הועתק! ✅' : 'העתק דוח 📋'}
            </button>
          </div>
          
          <div>{report}</div>
        </div>
      )}
    </div>
  )
}

export default App