📋 Speech AI: Clinical Report Automation System
AI-Powered Full-Stack Project | Speech Therapy Automation
An AI-driven system designed to automate professional "Request for Continued Treatment" reports. The platform reduces report writing time from 30 minutes to 30 seconds, ensuring clinical precision and linguistic fluency.

🛠 Technical Stack
Backend: FastAPI (Python 3.9) – High-performance asynchronous server for non-blocking AI request management.

Frontend: React 18 + Vite – Dynamic state management for real-time user input and AI output handling.

Containerization: Docker & Docker Compose – Isolated environments ensuring seamless deployment.

AI Integration: Google Gemini SDK (gemini-1.5-flash) – Secure LLM integration for clinical text generation.

🧠 Prompt Engineering Strategy
Role Assignment: Expert Speech-Language Pathologist (SLP) persona implementation.

Inference Logic: Automated medical deduction from raw therapy notes (e.g., ENT findings vs. linguistic progress).

Constraint Satisfaction: Enforced professional structure (Clinical background, diagnostic summary, standardized deviations, and goals).

🔄 Data Flow & Validation
Server-Side Validation: Rigorous data integrity using Pydantic Schemas to ensure structure and prevent 422 errors.

Network Layer: Secure RESTful communication with strict CORS middleware management.

Client-Side: DOM manipulation for live editing and Hebrew-compatible PDF generation.

🧪 Quality Assurance & Testing (CI/CD)
Backend Testing (Pytest): Achieved 84% Code Coverage with 7/7 passing tests, covering validation, error handling, and end-to-end logic.

Frontend Testing (Vitest): Achieved 70% Component Coverage with 7/7 passing tests, including UI rendering, API error states, and Clipboard API integration.

Automated Pipeline: Integrated GitHub Actions for continuous testing on every code push, ensuring a production-ready system.

🚀 Key Technical Challenges Solved
RTL PDF Export: Resolved Right-to-Left (Hebrew) formatting issues in PDF generation using html2pdf.js.

Container Synchronization: Configured internal network communication between frontend and API services.

Editable WYSIWYG UI: Implemented a seamless synchronization bridge between AI-generated text and manual clinician edits.

Developed by: Ayelet Surovsky & Yael Bloch | December 2025
