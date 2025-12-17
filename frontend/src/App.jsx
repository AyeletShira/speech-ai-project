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

  // פונקציית עיבוד הטקסט להסרת Markdown והדגשת כותרות
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
    setIsCopied(false);

    try {
      const response = await axios.post('http://localhost:8000/reports/generate', {
        patient_name: patientName,
        sessions: [{
          date: new Date().toLocaleDateString("he-IL"),
          notes: notes,
          exercises_done: []
        }]
      });
      setReport(response.data.report_text);
    } catch (err) {
      setError("שגיאה בחיבור לשרת. וודא שה-Backend פעיל.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const cleanText = report.replace(/[*#]/g, '');
    navigator.clipboard.writeText(cleanText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="container">
      {/* פס התקדמות עליון */}
      {loading && <div className="progress-bar-container"><div className="progress-bar-fill"></div></div>}
      
      <header className="main-header-area">
        <span className="gemini-sparkle">✨</span>
        <h1 className="header">Speech AI</h1>
      </header>

      {/* תיבת הוראות למטפל */}
      <div className="instructions-box">
        <h4>💡 איך לקבל דוח מושלם?</h4>
        <ul>
          <li>התחילו בפרטים הטכניים: <strong>"זאבי, בן 4, גן חובה, 8/21 טיפולים"</strong>.</li>
          <li>ציינו רקע שפתי (דו-לשוניות) והיסטוריה רפואית בקצרה.</li>
          <li>כתבו דוגמאות לטעויות (לדוגמה: <strong>"אומר בת במקום אחות"</strong>).</li>
          <li>ציינו את מספר הטיפולים המבוקש להמשך (למשל: "מבקש 12 מפגשים").</li>
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
            rows="10" 
            placeholder="לדוגמה: הילד משתף פעולה, יש קושי בתחביר, אומר 'זכר' במקום 'נקבה'..." 
            disabled={loading} 
          />
        </div>
        <button 
          className={`generate-btn ${loading ? 'btn-loading' : ''}`} 
          onClick={handleGenerate} 
          disabled={loading}
        >
          {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
              <span>בונה את הדוח...</span>
            </div>
          ) : (
            "צור דוח מקצועי ✨"
          )}
        </button>
        {error && <div className="error-message">{error}</div>}
      </main>

      {report && (
        <section className="result-card glass-effect">
          <div className="result-header">
            <h3>🪄 הדוח מוכן</h3>
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
            contentEditable="true" 
            suppressContentEditableWarning={true} 
            className="report-paper" 
            dangerouslySetInnerHTML={{ __html: formatReport(report) }} 
          />
        </section>
      )}
    </div>
  );
}

export default App;