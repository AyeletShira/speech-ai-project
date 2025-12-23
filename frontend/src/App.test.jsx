import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import React from 'react';
import App from './App';
import axios from 'axios';

// Mock axios to simulate server response
vi.mock('axios');

vi.mock('html2pdf.js', () => ({
    __esModule: true,
    default: () => ({
        from: () => ({ save: () => {} })
    })
}));

describe('Speech AI Advanced Coverage Tests', () => {
    
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    // בדיקות קיימות...
    it('1. Should render the main header', () => {
        render(<App />);
        expect(screen.getByText(/Speech AI/i)).toBeInTheDocument();
    });

    it('2. Should handle successful report generation', async () => {
        // מדמה תשובה מהשרת כדי להפעיל את פונקציות התצוגה
        axios.post.mockResolvedValue({ data: { report_text: 'This is a generated report content' } });

        render(<App />);
        
        // מילוי פרטים
        fireEvent.change(screen.getByPlaceholderText(/שם מלא/i), { target: { value: 'Test Patient' } });
        fireEvent.change(screen.getByPlaceholderText(/הזיני כאן מידע/i), { target: { value: 'Patient is doing well' } });
        
        // לחיצה על כפתור
        fireEvent.click(screen.getByRole('button', { name: /צור דוח מקצועי/i }));

        // מחכה שהדוח יופיע על המסך (זה יפעיל את formatReport)
        await waitFor(() => {
            expect(screen.getByText(/תוצאת הדוח/i)).toBeInTheDocument();
        });

        expect(screen.getByText(/This is a generated report content/i)).toBeInTheDocument();
    });

    it('3. Should handle copy to clipboard', async () => {
        axios.post.mockResolvedValue({ data: { report_text: 'Report to copy' } });
        
        // מדמה את ה-Clipboard API
        const mockClipboard = { writeText: vi.fn() };
        global.navigator.clipboard = mockClipboard;

        render(<App />);
        
        fireEvent.change(screen.getByPlaceholderText(/שם מלא/i), { target: { value: 'Test' } });
        fireEvent.change(screen.getByPlaceholderText(/הזיני כאן מידע/i), { target: { value: 'Notes' } });
        fireEvent.click(screen.getByRole('button', { name: /צור דוח מקצועי/i }));

        await waitFor(() => screen.getByText(/העתק/i));
        
        const copyBtn = screen.getByText(/העתק/i);
        fireEvent.click(copyBtn);

        expect(mockClipboard.writeText).toHaveBeenCalled();
        expect(screen.getByText(/הועתק!/i)).toBeInTheDocument();
    });
});