
import { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import './App.css';

function App() {
  const [patientName, setPatientName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  
  // לוגיקת הזיכרון והצ'אט
  const [history, setHistory] = useState([]);
  const [revisionNote, setRevisionNote] = useState('');

  // לשימוש מקומי בדוקר. שנו לכתובת של Render לפני ה-Push הסופי.
  const API_URL = "https://speech-ai-project.onrender.com";
  // const API_URL = "http://localhost:8000"; 

  const formatReport = (text) => {
    if (!text) return "";
    return text.trim()
      .replace(/#{1,6}\s?(.*)/g, '<strong>$1</strong>')
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong>$1</strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*/g, '')
      .replace(/\n/g, '<br/>');
  };

  const handleGenerate = async () => {
    if (!patientName || !notes) {
      setError("נא למלא שם מטופל/ת והערות קליניות");
      return;
    }
    setLoading(true);
    setError(null);
    setReport(null);
    setHistory([]); 
    
    try {
      const response = await axios.post(`${API_URL}/reports/generate`, {
        patient_name: patientName,
        sessions: [{
          date: new Date().toLocaleDateString("he-IL"),
          notes: notes,
          exercises_done: []
        }]
      });
      
      const newReport = response.data.report_text;
      setReport(newReport);
      
      setHistory([
        { role: "user", content: `צור דוח עבור המטופל ${patientName} על בסיס ההערות: ${notes}` },
        { role: "model", content: newReport }
      ]);
    } catch (err) {
      setError("שגיאה בחיבור לשרת. וודאו שה-Backend רץ בדוקר.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevise = async () => {
    if (!revisionNote || !report) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/reports/revise`, {
        patient_name: patientName,
        history: history,
        new_instructions: revisionNote
      });
      
      const updatedReport = response.data.report_text;
      setReport(updatedReport);
      
      setHistory(prev => [
        ...prev, 
        { role: "user", content: revisionNote }, 
        { role: "model", content: updatedReport }
      ]);
      
      setRevisionNote('');
    } catch (err) {
      setError("חלה שגיאה בעדכון הדוח.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const reportElement = document.getElementById('report-content');
    const textToCopy = reportElement ? reportElement.innerText : "";
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="container" dir="rtl">
      <section className="main-section">
      {loading && <div className="progress-bar-container"><div className="progress-bar-fill"></div></div>}
      
      <header className="main-header-area">
        <span className="gemini-sparkle">✨</span>
        <h1 className="header">SpeechAI</h1>
      </header>

      {/* הטיפים המקצועיים המעודכנים לפי הגדרות הבקאנד */}
      
      <div className="instructions-box">
        <h4>💡 הנחיות לכתיבת הערות קליניות:</h4>
        <ul>
          <li>פרטי על רמת ה<strong>מורפולוגיה</strong> וה<strong>תחביר</strong> (למשל: הטיות פועל, משפטים מורכבים).</li>
          <li>צייני רמת <strong>מובנות דיבור</strong> וקשיים פונולוגיים ספציפיים.</li>
          <li>התייחסי ליכולת <strong>ארגון מסר</strong> ורצף סיפורי של המטופל/ת.</li>
          <li>תארי את מידת ה<strong>הכללה</strong> של המטרות הטיפוליות בחיי היומיום.</li>
        </ul>
      </div>

      <main className="form-card">
        <div className="form-group">
          <label>שם המטופל/ת</label>
          <input 
            type="text" 
            value={patientName} 
            onChange={(e) => setPatientName(e.target.value)} 
            placeholder="שם מלא..." 
            disabled={loading} 
          />
        </div>
        <div className="form-group">
          <label>הערות קליניות מהטיפול</label>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            rows="6" 
            placeholder="הזיני כאן מידע על תפקוד שפתי, היענות הילד ומטרות שהושגו..." 
            disabled={loading} 
          />
        </div>
        <button 
          className={`generate-btn ${loading ? 'btn-loading' : ''}`} 
          onClick={handleGenerate} 
          disabled={loading}
        >
          {loading ? "מעבד נתונים קליניים..." : "צור דוח מקצועי ✨"}
        </button>
        {error && <div className="error-message">{error}</div>}
      </main>
</section>
      {report && (
        <section className="result-card glass-effect">
          <div className="result-header">
            <h3>🪄 תוצאת הדוח (ניתן לעריכה ידנית)</h3>
            <div className="action-buttons">
              <button 
                onClick={() => html2pdf().from(document.getElementById('report-content')).save()} 
                className="btn-pdf"
              >
                PDF 📥
              </button>
              <button onClick={copyToClipboard} className="btn-copy">
                {isCopied ? 'הועתק! ✅' : 'העתק'}
              </button>
            </div>
          </div>
          
          <div 
            id="report-content" 
            className="report-paper" 
            contentEditable="true" 
            suppressContentEditableWarning={true}
            dangerouslySetInnerHTML={{ __html: formatReport(report) }} 
            style={{ outline: 'none' }}
          />

          <div className="revision-area" style={{marginTop: '25px', borderTop: '2px solid #f0f0f0', paddingTop: '20px'}}>
            <h4 style={{marginBottom: '10px'}}>💬 בקשות לתיקון מה-AI (זיכרון פעיל)</h4>
            <div style={{display: 'flex', gap: '10px'}}>
                <input 
                  type="text" 
                  value={revisionNote} 
                  onChange={(e) => setRevisionNote(e.target.value)} 
                  placeholder="למשל: 'תדגיש יותר את קשיי התחביר' או 'שנה ללשון נקבה'..."
                  style={{flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc'}}
                  onKeyPress={(e) => e.key === 'Enter' && handleRevise()}
                />
                <button 
                  className="generate-btn" 
                  onClick={handleRevise} 
                  disabled={loading} 
                  style={{width: 'auto', padding: '0 25px', margin: 0}}
                >
                  עדכן ✨
                </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;