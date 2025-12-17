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

  const handleGenerate = async () => {
    if (!patientName || !notes) {
      setError("נא למלא שם מטופל והערות");
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);
    setIsCopied(false);

    const payload = {
      patient_name: patientName,
      sessions: [{
        date: new Date().toLocaleDateString("he-IL"),
        exercises_done: ["תרגול"],
        notes: notes
      }]
    };

    try {
      const response = await axios.post('http://localhost:8000/reports/generate', payload);
      setReport(response.data.report_text);
    } catch (err) {
      setError("שגיאה בחיבור לשרת. וודא שה-Backend פעיל.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(report);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadPDF = () => {
    const element = document.getElementById('report-content');
    const opt = {
      margin: 10,
      filename: `דוח_${patientName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="container">
      <header className="main-header-area">
        <span className="gemini-sparkle">✨</span>
        <h1 className="header">Speech AI</h1>
      </header>

      <main className="form-card">
        <div className="form-group">
          <label>שם המטופל/ת</label>
          <input 
            type="text" 
            value={patientName} 
            onChange={(e) => setPatientName(e.target.value)} 
            placeholder="שם מלא..." 
          />
        </div>

        <div className="form-group">
          <label>הערות קליניות</label>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            rows="5" 
            placeholder="מה קרה בטיפול?" 
          />
        </div>

        <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
          {loading ? "מייצר דוח..." : "צור דוח ✨"}
        </button>

        {error && <div className="error-message">{error}</div>}
      </main>

      {report && (
        <section className="result-card glass-effect">
          <div className="result-header">
            <h3>🪄 הדוח מוכן</h3>
            <div className="action-buttons">
              <button onClick={downloadPDF} className="btn-pdf">PDF 📥</button>
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
          >
            {report}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;