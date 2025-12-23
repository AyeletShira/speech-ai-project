import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React, { useState } from 'react';

// --- החלק הזה מדמה את הקומפוננטה שלך ---
// (בפרויקט האמיתי שלך: תמחקי את החלק הזה ותעשי import לקומפוננטה האמיתית שלך)
// import App from './App'; 

const MockApp = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSend = () => {
    if (!input.trim()) return; // מניעת שליחה של ריק
    setLoading(true);
    setTimeout(() => { // דימוי של תשובה מ-AI
        setResponse("AI Response: " + input);
        setLoading(false);
    }, 100);
  };

  return (
    <div>
      <input 
        placeholder="Ask Gemini..." 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
      />
      <button onClick={handleSend} disabled={loading || !input}>
        {loading ? 'Thinking...' : 'Send'}
      </button>
      {response && <div data-testid="ai-response">{response}</div>}
    </div>
  );
};
// ----------------------------------------

describe('AI Chat Tests', () => {
    
    // מנקה את המסך אחרי כל בדיקה כדי שלא יתערבבו
    afterEach(() => {
        cleanup();
    });

    it('1. Input field should allow typing', () => {
        render(<MockApp />); // בפרויקט שלך: <App />
        
        // מוצאים את תיבת הטקסט (לפי ה-Placeholder שלה)
        const input = screen.getByPlaceholderText(/Ask Gemini/i);
        
        // מדמים הקלדה של משתמש
        fireEvent.change(input, { target: { value: 'Hello AI' } });
        
        // בודקים שהערך באמת השתנה
        expect(input.value).toBe('Hello AI');
    });

    it('2. Validation: Button should be DISABLED when input is empty', () => {
        render(<MockApp />);
        
        const button = screen.getByRole('button');
        const input = screen.getByPlaceholderText(/Ask Gemini/i);

        // שלב א: הטקסט ריק -> הכפתור צריך להיות נעול
        fireEvent.change(input, { target: { value: '' } });
        expect(button).toBeDisabled();

        // שלב ב: כותבים משהו -> הכפתור צריך להשתחרר
        fireEvent.change(input, { target: { value: 'Is this working?' } });
        expect(button).not.toBeDisabled();
    });

    it('3. Loading State: Button should verify "Thinking..." status', async () => {
        render(<MockApp />);
        const input = screen.getByPlaceholderText(/Ask Gemini/i);
        const button = screen.getByRole('button');

        // מקלידים ולוחצים
        fireEvent.change(input, { target: { value: 'Tell me a joke' } });
        fireEvent.click(button);

        // בודקים שמיד אחרי הלחיצה, הכפתור משנה טקסט וננעל
        // שימי לב: זה תלוי איך מימשת את זה אצלך, תתאימי את הטקסט 'Thinking' למה שיש אצלך
        expect(button).toHaveTextContent(/Thinking/i);
        expect(button).toBeDisabled();
    });
});