 Mindcare — AI Mental Health Companion
An AI-powered mental health web application that assesses users' mental health through guided questionnaires using a locally hosted Ollama LLM, then provides personalised insights, daily wellness activities, and an AI counsellor chatbot.
---
 Tech Stack
Layer	Technology
Frontend	React + React Router
Backend	FastAPI (Python)
AI Model	Ollama (Local LLM)
Auth	Firebase (Google & Facebook OAuth) + bcryptjs
---
 Features
 Mental Health Assessment — Answer condition-specific questions; the Ollama LLM predicts your mental health condition
 User Dashboard — View your prediction, symptoms, precautions, and nearby mental health clinics
 AI Counsellor Chatbot — Chat with an empathetic AI counsellor for real-time emotional support
 Daily Activities — Condition-tailored wellness tasks (breathing, journaling, mindfulness)
 Nearby Clinics — Find local mental health clinics and resources
 Authentication — Email/password signup or OAuth via Google & Facebook
 Private by Design — All LLM inference runs locally; your data never leaves your machine
---
 Getting Started
Prerequisites
Node.js v18+
Python 3.11+
Ollama installed and a model pulled:
```bash
  ollama pull llama3
  ```
Installation
1. Clone the repo
```bash
git clone https://github.com/your-username/serenity.git
cd serenity
```
2. Frontend
```bash
cd frontend
npm install
```
3. Backend
```bash
cd ../backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
---
▶ Running the App
Open three terminals:
```bash
# Terminal 1 — Ollama
ollama serve

# Terminal 2 — FastAPI backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 3 — React frontend
cd frontend
npm run dev
```
App runs at http://localhost:5173
---
 Environment Variables
Create a `.env` file inside `frontend/`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```
---
 Project Structure
```
Mindcare/
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── CreateAccount.jsx
│       ├── SignIn.jsx
│       ├── Assessment.jsx
│       ├── UserHome.jsx
│       ├── Chatbot.jsx
│       ├── DailyActivities.jsx
│       ├── MentalHealthGames.jsx
│       ├── ContactUs.jsx
│       └── firebase.js
└── backend/
    ├── main.py
    ├── model.py
    └── requirements.txt
```
---
 Disclaimer
Mindcare is an educational project and is not a substitute for professional medical advice, diagnosis, or treatment. If you or someone you know is in crisis, please contact a qualified healthcare professional or your local emergency services.

<p align="center">Made with  and care</p>