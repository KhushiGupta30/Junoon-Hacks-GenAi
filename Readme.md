# KalaGhar - Artisan Marketplace Platform

> Empowering artisans worldwide through AI-powered tools and global marketplace access
## 🌟 Overview

KalaGhar is a comprehensive e-commerce platform connecting artisans with buyers, investors, and ambassadors. Built with React, Node.js, Firebase, and Google Gemini AI.

## ✨ Key Features

- 🤖 **AI-Powered Tools** - Trend analysis, description generation, price suggestions, voice assistant
- 🎨 **Artisan Dashboard** - Product management, order tracking, funding opportunities
- 🛍️ **Buyer Marketplace** - Browse handcrafted products, vote on new ideas
- 💰 **Investor Matching** - AI-driven funding recommendations
- 🤝 **Community Hub** - Connect with local artisans and ambassadors

## 🛠 Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, Firebase Auth  
**Backend:** Node.js, Express, Firebase Firestore, Google Gemini AI  

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/KhushiGupta30/Junoon-Hacks-GenAi.git
cd kalaghar
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=3000
NODE_ENV=development
FIREBASE_CREDS={"type":"service_account",...}
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGIN=https://localhost:5173
```

Start backend:
```bash
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Start frontend:
```bash
npm run dev
```

Visit `https://localhost:5173`

## 📁 Project Structure
```
kalaghar/
├── backend/
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── middleware/      # Auth & validation
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── context/     # State management
    │   └── api/         # API configuration
    └── public/
```

Website: [junoon-hacks-gen-ai.vercel.app](https://junoon-hacks-gen-ai.vercel.app/)

---