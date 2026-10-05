ECHO GUARD
AI Personal Fitness & Wellness Platform
Smart India Hackathon 2026 • Problem Statement SIH26196
Team ID: 143840 • Team: Echo Guard
Personalized • Adaptive • Safe • AI-Powered
1. About Echo Guard
Echo Guard is an AI-powered personal fitness and wellness platform designed to make fitness more personalized, adaptive, accessible, safe, and engaging. It combines AI assistance, personalized workout planning, progress tracking, gamification, and safety-focused exercise recommendations to help users build consistent and sustainable fitness habits.
2. Smart India Hackathon 2026
Problem Statement ID	SIH26196
Problem Statement	Student Innovation – Ideas that can boost fitness activities and assist in keeping fit
Category	Software
Team ID	143840
Team Name	Echo Guard
Project	Echo Guard
3. Key Features
AI Personal Trainer
•	Personalized plans based on fitness goals, level, available time, frequency, equipment, and preferences.
AI Fitness Assistant — Fitz
•	Conversational fitness guidance using user context and a verified exercise library.
•	Examples include short-workout requests and low-impact workout guidance.
Safety-First AI
•	Rule-based safety checks, grounded exercise recommendations, avoidance of medical diagnosis or medication advice, and professional referral when appropriate.
Verified Exercise Library
•	Exercise names, categories, difficulty, impact classification, target muscles, instructions, and form cues.
Fitness Journey Tracking
•	Daily, weekly and monthly progress, streaks, personal records, and a Fitness Progress Score.
Adaptive Workout Engine
•	Designed to increase or decrease intensity according to performance and support recovery and beginner modes.
Gamification
•	Streaks, badges, points, challenges, weekly activity goals, and personal records.
Fitness Progress Score
•	A 0–100 application metric intended to help users understand consistency and progress; it is not a medical score.
4. Technology Stack
Area	Technology
Frontend	React, TypeScript, Vite, Tailwind CSS, Lucide React, Motion, Recharts
Backend	Node.js, Express, TypeScript, TSX
AI	Google Gemini API, @google/genai, Gemini 2.5 Flash, rule-based fallback
Database / Services	Firebase, Firestore, Firebase Authentication
Development	npm / Bun, Vite, TypeScript
5. Architecture
The proposed architecture connects the web/mobile frontend with backend services for user profiles, workout planning, recommendations, gamification, alerts, analytics, and safety. The AI/ML layer includes workout generation, progress analysis, an adaptive workout engine, an LLM fitness assistant, RAG over a verified exercise database, and pose detection.
Conceptual flow: User → Fitness Dashboard / Workout / AI Chat → Safety & Grounding → AI Assistant / Workout Engine → Verified Exercise Library and User Progress Data.
6. Project Structure
SIH26196-PROTOTYPE/
├── public/
├── src/
│   ├── data/
│   │   └── exercises
│   ├── services/
│   │   └── safetyService
│   └── ...
├── .env.example
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firestore.rules
├── index.html
├── metadata.json
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
7. Getting Started
7.1 Clone the Repository
git clone https://github.com/khushi142006k/SIH26196-PROTOTYPE.git
cd SIH26196-PROTOTYPE
7.2 Install Dependencies
npm install

or

bun install
7.3 Environment Configuration
Create a .env file from .env.example and configure the required application variables, including GEMINI_API_KEY and APP_URL. Never commit real API keys or secrets to GitHub.
7.4 Run the Development Server
npm run dev
The repository configuration starts the TypeScript server through tsx server.ts.
8. API Endpoints
•	GET /api/health — server health status.
•	GET /api/exercises — verified exercise library.
•	POST /api/chat — AI fitness assistant. The endpoint performs safety checks, uses verified exercise context, communicates with Gemini when configured, and provides a fallback response when required.
9. Safety & Privacy
•	Rule-based safety pre-checks and grounded AI responses.
•	No medical diagnosis or medication advice.
•	Professional referral when appropriate.
•	Consent, encrypted data, and minimal data collection as proposed.
•	Avoid unnecessary storage of raw video.
•	User data deletion capability as part of the proposed privacy approach.
10. Target Users
•	Individual users — personalized plans and fitness tracking.
•	Beginners and low-impact users — simple, accessible workouts.
•	Colleges — campus fitness challenges and wellness programs.
•	Gyms and trainers — engagement and progress tracking.
•	Corporate wellness programs — employee activity and challenges.
11. Expected Impact
•	More physical activity
•	Better consistency
•	Better fitness habits
•	Personalized guidance
•	Better progress insights
•	Long-term engagement
12. Future Roadmap
•	Computer-vision exercise coaching
•	Automatic repetition counting
•	Real-time posture and form feedback
•	Wearable integrations
•	Voice-based AI trainer
•	Multilingual AI fitness assistant
•	Personalized nutrition assistance
•	Gym, trainer, college, and corporate partnerships
13. Prototype Status
Echo Guard is an SIH 2026 prototype. The current repository demonstrates the software prototype and AI fitness-assistant workflow. Some capabilities described in the broader SIH architecture, including advanced computer vision, wearable integrations, and expanded adaptive engines, represent planned or future development and should not be interpreted as fully implemented unless present in the current repository.
14. Research & References
•	Google MediaPipe — Pose Landmarker / body pose estimation: https://developers.google.com/mediapipe
•	TensorFlow — MoveNet pose detection: https://www.tensorflow.org
•	FastAPI — Framework documentation: https://fastapi.tiangolo.com
•	scikit-learn — Machine Learning in Python: https://scikit-learn.org
15. Repository
https://github.com/khushi142006k/SIH26196-PROTOTYPE

Made with ❤️ by Team Echo Guard
Smart India Hackathon 2026
