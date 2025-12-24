import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React, { useState } from 'react';



const MockApp = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSend = () => {
    if (!input.trim()) return; 
    setLoading(true);
    setTimeout(() => { 
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


describe('AI Chat Tests', () => {
    
  
    afterEach(() => {
        cleanup();
    });

    it('1. Input field should allow typing', () => {
        render(<MockApp />);
        
        const input = screen.getByPlaceholderText(/Ask Gemini/i);
        
        fireEvent.change(input, { target: { value: 'Hello AI' } });
        
        expect(input.value).toBe('Hello AI');
    });

    it('2. Validation: Button should be DISABLED when input is empty', () => {
        render(<MockApp />);
        
        const button = screen.getByRole('button');
        const input = screen.getByPlaceholderText(/Ask Gemini/i);

        fireEvent.change(input, { target: { value: '' } });
        expect(button).toBeDisabled();

        fireEvent.change(input, { target: { value: 'Is this working?' } });
        expect(button).not.toBeDisabled();
    });

    it('3. Loading State: Button should verify "Thinking..." status', async () => {
        render(<MockApp />);
        const input = screen.getByPlaceholderText(/Ask Gemini/i);
        const button = screen.getByRole('button');

        fireEvent.change(input, { target: { value: 'Tell me a joke' } });
        fireEvent.click(button);

        expect(button).toHaveTextContent(/Thinking/i);
        expect(button).toBeDisabled();
    });
});