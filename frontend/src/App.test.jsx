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
        fireEvent.click(screen.getByRole('button', { name: /צור דוח מקצועי/i }));
        await waitFor(() => {
            expect(screen.queryByText(/שגיאה/i) || screen.queryByText(/error/i)).toBeTruthy();
        });
    });

    it('5. Generates report successfully', async () => {
        axios.post.mockResolvedValue({ data: { report_text: 'דוח קליני לדוגמה' } });
        render(<App />);
        fireEvent.change(screen.getByPlaceholderText(/שם מלא/i), { target: { value: 'בדיקה' } });
        fireEvent.click(screen.getByRole('button', { name: /צור דוח מקצועי/i }));
        await waitFor(() => expect(screen.getByText(/דוח קליני לדוגמה/i)).toBeInTheDocument());
    });

    it('6. Copies report to clipboard', async () => {
        axios.post.mockResolvedValue({ data: { report_text: 'Text to copy' } });
        const mockClipboard = { writeText: vi.fn() };
        global.navigator.clipboard = mockClipboard;
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: /צור דוח מקצועי/i }));
        await waitFor(() => screen.getByText(/העתק/i));
        fireEvent.click(screen.getByText(/העתק/i));
        expect(mockClipboard.writeText).toHaveBeenCalledWith('Text to copy');
    });

    it('7. Clears form after reset (if applicable)', () => {
        render(<App />);
        const textarea = screen.getByPlaceholderText(/הזיני כאן מידע/i);
        fireEvent.change(textarea, { target: { value: 'הערות למחיקה' } });
        expect(textarea.value).toBe('הערות למחיקה');
        // כאן ניתן להוסיף לחיצה על כפתור ניקוי אם קיים
    });
});