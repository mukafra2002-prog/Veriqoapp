# Veriqo - Smart Amazon Shopping Assistant

AI-powered Amazon product analysis tool that helps shoppers make confident purchase decisions.

## 🏗️ Architecture

```
├── frontend/          # React 19 + Tailwind CSS + Shadcn/UI
├── backend/           # FastAPI + MongoDB + OpenAI
├── chrome-extension/  # Browser extension for Amazon
└── memory/            # Documentation
```

## 🚀 Deployment Options

### Option A: Deploy Frontend to Vercel + Backend to Railway/Render

#### Frontend (Vercel)
1. Push this repo to GitHub
2. Connect to Vercel
3. Set root directory: `frontend`
4. Add environment variable:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-url.com
   ```
5. Deploy!

#### Backend (Railway/Render/Heroku)
1. Create a new project
2. Set root directory: `backend`
3. Add environment variables (see `backend/.env.example`)
4. Set start command: `uvicorn server:app --host 0.0.0.0 --port 8001`
5. Deploy!

### Option B: Docker Deployment

```bash
# Backend
cd backend
docker build -t veriqo-backend .
docker run -p 8001:8001 --env-file .env veriqo-backend

# Frontend
cd frontend
docker build -t veriqo-frontend .
docker run -p 3000:3000 veriqo-frontend
```

## 🔧 Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB (local or Atlas)
- OpenAI API Key

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### Frontend Setup
```bash
cd frontend
yarn install
cp .env.example .env
# Edit .env with your backend URL
yarn start
```

## 🔑 Required Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URL` | MongoDB connection string | ✅ |
| `DB_NAME` | Database name | ✅ |
| `JWT_SECRET` | Secret for JWT tokens | ✅ |
| `EMERGENT_LLM_KEY` | OpenAI API key | ✅ |
| `STRIPE_API_KEY` | Stripe secret key | ✅ |
| `RESEND_API_KEY` | Resend email API key | Optional |
| `CORS_ORIGINS` | Allowed origins | ✅ |

### Frontend (`frontend/.env`)
| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_BACKEND_URL` | Backend API URL | ✅ |

## 📁 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Google OAuth

### Product Analysis
- `POST /api/analyze` - Analyze Amazon product
- `POST /api/extension/analyze` - Chrome extension analysis

### History & Wishlist
- `GET /api/history` - Get analysis history
- `GET /api/history/export` - Export as CSV
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/users` - User management
- `GET /api/admin/analyses` - Analysis management

## 🔒 Features

- ✅ AI-powered product analysis
- ✅ JWT + Google OAuth authentication
- ✅ Analysis history with CSV export
- ✅ Product wishlist
- ✅ Side-by-side comparison
- ✅ Admin dashboard
- ✅ Chrome browser extension
- ✅ Stripe payment integration
- ✅ SEO-optimized public pages

## 📄 License

Proprietary - All rights reserved.
