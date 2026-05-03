

https://github.com/user-attachments/assets/68f74f2b-ac1a-4698-b457-ce2176193c2c


# Stick Note

A full-stack web application featuring a modern **Sticky Note Board** with Drag-and-Drop capabilities. Built with React + Vite on the frontend and Python FastAPI on the backend, fully secured and powered by Firebase.

## 🚀 Features

- **Interactive Sticky Notes**: Create, edit, group, and drag-and-drop notes on a dynamic board.
- **Task Management**: Create, update status, and delete tasks.
- **Authentication**: Secure Google Sign-in powered by Firebase Auth.
- **Modern UI/UX**: Built with Tailwind CSS v4, smooth animations, Lottie graphics, and customized typography.

## 💻 Tech Stack

### Frontend

- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Interactions**: `@dnd-kit/core` (Drag & Drop)
- **State/Fetching**: React Query, Axios
- **BaaS**: Firebase SDK

### Backend

- **Framework**: Python FastAPI
- **Authentication**: Firebase Admin SDK
- **Architecture**: Modular Layered Pattern (Routes, Schemas, Services, Dependencies)

---

## 📁 Project Structure

```text
├── backend/                  # FastAPI Server
│   ├── core/                 # App configurations
│   ├── dependencies/         # Auth & Injection dependencies
│   ├── routes/               # API Endpoints
│   ├── schemas/              # Pydantic models for validation
│   ├── services/             # Business logic
│   └── main.py               # Application entry point
│
├── frontend/                 # React Vite Client
│   ├── src/
│   │   ├── api/              # Axios & API service handlers
│   │   ├── components/       # Reusable React components (home, note, etc.)
│   │   ├── hooks/            # Custom React hooks (e.g., useAuth)
│   │   └── firebaseConfig.ts # Firebase client initialization
│   └── package.json          # Node dependencies
```

---

## 🛠 Getting Started

### 1. Prerequisites

- **Node.js** (v18+)
- **Python** (3.10+)
- A **Firebase Project** with Realtime Database/Firestore and Authentication (Google Auth) enabled.

### 2. Environment Setup

**Backend:**

1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv .venv`
3. Activate the virtual environment:
    - Windows: `.venv\Scripts\activate`
    - Mac/Linux: `source .venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Place your Firebase Admin SDK file as `backend/serviceAccountKey.json`.
6. Create a `.env` file in `backend/` and add:
    ```env
    FIREBASE_DATABASE_URL="your-database-url"
    ```

**Frontend:**

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file in `frontend/` based on your Firebase Config:
    ```env
    VITE_FIREBASE_API_KEY="your-api-key"
    VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
    VITE_FIREBASE_DATABASE_URL="your-database-url"
    VITE_FIREBASE_PROJECT_ID="your-project-id"
    VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
    VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
    VITE_FIREBASE_APP_ID="your-app-id"
    VITE_FIREBASE_MEASUREMENT_ID="your-measurement-id"
    ```

### 3. Running the Application

**Run Backend (FastAPI):**

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Server will start on http://127.0.0.1:8000
```

**Run Frontend (React):**

```bash
cd frontend
npm install
npm run dev
# App will start on http://localhost:5173
```
