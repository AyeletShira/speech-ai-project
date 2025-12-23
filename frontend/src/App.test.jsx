import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import React from 'react';
import App from './App';
import axios from 'axios';

vi.mock('axios');
vi.mock('html2pdf.js', () => ({
    __esModule: true,
    default: () => ({ from: () => ({ save: () => {} }) })
}));

describe('Frontend Full Suite - 7 Tests', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('1. Renders main title correctly', () => {
        render(<App />);
        expect(screen.getByText(/SpeechAI/i)).toBeInTheDocument();
    });

    it('2. Shows clinical instructions box', () => {
        render(<App />);
        expect(screen.getByText(/הנחיות לכתיבת הערות קליניות/i)).toBeInTheDocument();
    });

    it('3. Updates patient name on input', () => {
        render(<App />);
        const input = screen.getByPlaceholderText(/שם מלא/i);
        fireEvent.change(input, { target: { value: 'ישראל ישראלי' } });
        expect(input.value).toBe('ישראל ישראלי');
    });

    it('4. Handles API Error state', async () => {
        axios.post.mockRejectedValue(new Error('Server Error'));
        render(<App />);
        
        // מילוי שדות חובה כדי למנוע ולידציה מקומית
        fireEvent.change(screen.getByPlaceholderText(/שם מלא/i), { target: { value: 'בדיקה' } });
        fireEvent.change(screen.getByPlaceholderText(/הזיני כאן מידע/i), { target: { value: 'הערות בדיקה' } });
        
        fireEvent.click(screen.getByRole('button', { name: /צור דוח מקצועי/i }));
        
        await waitFor(() => {
            // מחפש הודעת שגיאה כלשהי שמופיעה ב-UI שלך
            expect(screen.queryByText(/שגיאה/i) || screen.queryByText(/error/i) || screen.queryByRole('alert')).toBeTruthy();
        });
    });

    it('5. Generates report successfully', async () => {
        axios.post.mockResolvedValue({ data: { report_text: 'דוח קליני מוצלח' } });
        render(<App />);
        
        fireEvent.change(screen.getByPlaceholderText(/שם מלא/i), { target: { value: 'בדיקה' } });
        fireEvent.change(screen.getByPlaceholderText(/הזיני כאן מידע/i), { target: { value: 'הערות בדיקה' } });
        
        fireEvent.click(screen.getByRole('button', { name: /צור דוח מקצועי/i }));
        
        // מחכה לטקסט שחוזר מה-Mock
        await waitFor(() => expect(screen.getByText(/דוח קליני מוצלח/i)).toBeInTheDocument());
    });

    it('6. Copies report to clipboard', async () => {
        axios.post.mockResolvedValue({ data: { report_text: 'Text to copy' } });
        const mockClipboard = { writeText: vi.fn() };
        global.navigator.clipboard = mockClipboard;
        
        render(<App />);
        fireEvent.change(screen.getByPlaceholderText(/שם מלא/i), { target: { value: 'בדיקה' } });
        fireEvent.change(screen.getByPlaceholderText(/הזיני כאן מידע/i), { target: { value: 'הערות בדיקה' } });
        
        fireEvent.click(screen.getByRole('button', { name: /צור דוח מקצועי/i }));
        
        // מחכה שהכפתור יופיע
        const copyBtn = await screen.findByText(/העתק/i);
        fireEvent.click(copyBtn);
        
        expect(mockClipboard.writeText).toHaveBeenCalledWith('Text to copy');
    });

    it('7. Checks if textarea updates correctly', () => {
        render(<App />);
        const textarea = screen.getByPlaceholderText(/הזיני כאן מידע/i);
        fireEvent.change(textarea, { target: { value: 'הערות חדשות' } });
        expect(textarea.value).toBe('הערות חדשות');
    });
});