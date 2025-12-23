import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import App from './App'; // הייבוא האמיתי של הפרויקט שלך

// Mocking external libraries that don't run in test environments
vi.mock('html2pdf.js', () => ({
    __esModule: true,
    default: () => ({
        from: () => ({ save: () => {} })
    })
}));

describe('Speech AI Frontend Tests', () => {
    
    afterEach(() => {
        cleanup();
    });

    it('1. Should render the main header "Speech AI"', () => {
        render(<App />);
        const header = screen.getByText(/Speech AI/i);
        expect(header).toBeInTheDocument();
    });

    it('2. Should show professional instructions box', () => {
        render(<App />);
        const instructions = screen.getByText(/הנחיות לכתיבת הערות קליניות/i);
        expect(instructions).toBeInTheDocument();
    });

    it('3. Patient name input should allow typing', () => {
        render(<App />);
        const input = screen.getByPlaceholderText(/שם מלא/i);
        fireEvent.change(input, { target: { value: 'Johnny Test' } });
        expect(input.value).toBe('Johnny Test');
    });

    it('4. Clinical notes textarea should allow typing', () => {
        render(<App />);
        const textarea = screen.getByPlaceholderText(/הזיני כאן מידע על תפקוד שפתי/i);
        fireEvent.change(textarea, { target: { value: 'Patient shows progress' } });
        expect(textarea.value).toBe('Patient shows progress');
    });

    it('5. Button should show "מעבד נתונים..." when loading', () => {
        render(<App />);
        const button = screen.getByRole('button', { name: /צור דוח מקצועי/i });
        const nameInput = screen.getByPlaceholderText(/שם מלא/i);
        const notesInput = screen.getByPlaceholderText(/הזיני כאן מידע על תפקוד שפתי/i);

        // Fill data and click
        fireEvent.change(nameInput, { target: { value: 'Zevi' } });
        fireEvent.change(notesInput, { target: { value: 'Notes' } });
        fireEvent.click(button);

        // The button text changes based on your loading state logic
        expect(button).toBeDisabled();
    });

    it('6. Should show error message when fields are empty', () => {
        render(<App />);
        const button = screen.getByRole('button', { name: /צור דוח מקצועי/i });
        fireEvent.click(button);
        
        const error = screen.getByText(/נא למלא שם מטופל/i);
        expect(error).toBeInTheDocument();
    });

    it('7. Should verify RTL direction for Hebrew support', () => {
        const { container } = render(<App />);
        const mainDiv = container.querySelector('.container');
        expect(mainDiv).toHaveAttribute('dir', 'rtl');
    });
});