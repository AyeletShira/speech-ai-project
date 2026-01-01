📋 Speech AI: Clinical Report Automation System
Final Project: Artificial Intelligence for Speech-Language Pathologists

Developed by: Ayelet Sorovski & Yael Bloch | December 2025

📖 Overview
Speech AI is a Full-Stack AI-based system designed to fully automate the generation of "Request for Continued Treatment" documents. The system solves a critical administrative pain point for clinicians, reducing report writing time from 30 minutes to just 30 seconds, while strictly maintaining clinical accuracy and linguistic fluency.

🛠 Technical Stack
Backend
FastAPI (Python 3.9): Selected for its high-performance asynchronous capabilities, allowing efficient management of AI requests without blocking the Event Loop.

Pydantic: Used for strict data validation and schema enforcement.

Frontend
React 18 + Vite: Utilizes advanced State Management to handle dynamic data flow from user input to AI result generation.

UI/UX: Focus on intuitive design for non-technical users.

Infrastructure & DevOps
Docker & Docker Compose: Manages isolated environments for Frontend and Backend, ensuring a smooth "It works on my machine" experience and consistent container orchestration.

AI Integration
Google Gemini SDK (gemini-1.5-flash): Integration with Large Language Models (LLM) via a secure API interface.

🧠 Prompt Engineering Strategy
The core of the system relies on advanced prompt engineering techniques to ensure precise clinical results:

Role Assignment: The model is instructed to function as a Speech-Language Pathologist with extensive clinical experience.

Inference Logic: The system is capable of deducing medical conclusions from raw data (e.g., correlating ENT findings with language progress).

Few-Shot & Domain Expertise: Implementation of complex multilingual case analysis examples (such as converting foreign language syntax into proper Hebrew).

Constraint Satisfaction: Strict enforcement of a uniform report structure (Header/BS"D, Background, Diagnostic Summary including Standard Deviations, Goals, and Recommendations).

🔄 Detailed Data Flow
Client-Side: Collection of raw clinical data and DOM manipulation for PDF preview and live editing.

Network Layer: Secure RESTful communication under strict CORS configurations.

Server-Side Validation: Utilization of Pydantic Schemas to verify data structure integrity and prevent HTTP 422 errors.

AI Processing: Dynamic prompt construction, Cloud processing, and generation of a structured JSON response.

🧪 Technical Challenges Solved
During the development lifecycle, we tackled and resolved several complex engineering challenges:

Container-to-Container Synchronization: Configured internal network communication within Docker Compose to establish a stable connection between the Frontend and the API.

RTL PDF Export: Overcame "Right-to-Left" text rendering issues (Hebrew Support) in PDF generation using html2pdf.js.

Editable UI: Created a WYSIWYG interface allowing real-time synchronization between the AI-generated text and manual corrections made by the clinician.

CORS Management: Configured complex Middleware in FastAPI to authorize browser requests in a distributed development environment.

🚀 Quick Start
To run the system locally, follow these steps:

1. Clone the Repository
Bash

git clone https://github.com/your-username/speech-ai-project.git
cd speech-ai-project
2. Run with Docker
Ensure Docker Desktop is running, then execute:

Bash

docker-compose up --build
The application will be available at: http://localhost:5173 (or your configured port).

© All rights reserved to Ayelet Sorovsky & Yael Bloch 2025
