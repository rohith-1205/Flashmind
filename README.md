<div align="center">
  <img src="https://img.icons8.com/color/120/000000/brain.png" alt="FlashMind Logo"/>
  <h1>FlashMind AI</h1>
  <p><strong>Transform Your Notes into Knowledge with AI-Powered Adaptive Learning</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
    <img src="https://img.shields.io/badge/Google_Gemini_API-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
    <img src="https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=mui&logoColor=white" alt="Material UI" />
  </p>
</div>

## 🌟 About FlashMind
FlashMind is a cutting-edge web application designed to bridge the gap between passive reading and active recall. By harnessing the cognitive synthesis power of **Google Gemini Large Language Models (LLM)**, FlashMind instantly processes academic notes, complex topics, or historical events, and converts them into interactive 3D Flashcards and custom Multiple-Choice Quizzes.

Coupled with a **Firebase Cloud Firestore** tracking backend, FlashMind acts as a persistent educational dashboard, dynamically calculating your mastery and analyzing your study capabilities over time.

---

## ⚡ Core Features

- **🧠 AI Flashcard Studio:** Paste your raw study material into the generative engine to automatically extract core concepts into a series of interactive, flip-animated 3D flashcards. No more wasting time formatting index cards!
- **📝 Intelligent Quiz Synthesizer:** Type in a subject or historical event (e.g., *Quantum Mechanics* or *The French Revolution*) and the Gemini Model will generate a bespoke 5-question logic puzzle with multiple false-options to test your mastery.
- **📊 Real-Time Analytics Dashboard:** FlashMind integrates directly with a persistent NoSQL cloud database. The Dashboard mathematically aggregates your daily operations, providing live read-outs on the number of cards you generated and your all-time Quiz average scores.
- **🔐 Secure Authentication:** Complete credential processing using Firebase Authentication, keeping student telemetry sandboxed and entirely private.
- **🎨 Glassmorphic Premium Design:** Built purely on Material-UI and custom CSS-grid mathematics. The platform embraces an ultra-modern aesthetic, deep blue color theming, and fully responsive layouts.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 19 + Vite (for ultra-fast HMR and building)
- **Component Styling:** Material-UI (MUI) v9 + Custom CSS Modules
- **AI Integration:** Google Generative AI Web SDK (`gemini-2.5-flash` model endpoint)
- **Backend & Database:** Firebase Authentication + Cloud Firestore

---

## 🚀 Getting Started

To run FlashMind locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/rohith-1205/Flashmind.git
cd Flashmind
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
You must connect your own Firebase and Gemini project instances. Create a `.env` file in the absolute root of the project:
```env
VITE_GEMINI_API_KEY="your_google_ai_studio_key"
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_firebase_sender_id"
VITE_FIREBASE_APP_ID="your_firebase_app_id"
```

### 4. Run the Dev Server
```bash
npm run dev
```

---

## ☁️ Deployment
FlashMind is incredibly easy to deploy using **Vercel** because it acts as a natively hosted React Single Page Application (SPA).
1. Import this repository into Vercel.
2. In the Vercel Dashboard Settings, ensure you paste all 7 Environment variables from your local `.env`.
3. Hit Deploy! Vercel will automatically ingest the Vite schema and host FlashMind globally.

---
*Created intentionally to revolutionize educational assessments and data-driven learning.*
