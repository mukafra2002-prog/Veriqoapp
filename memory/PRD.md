# Veriqo - Smart Amazon Shopping Assistant

## Problem Statement
Build Veriqo - a smart Amazon shopping assistant with stunning landing page, Google & email authentication, forgot password, real Amazon product scraping, and AI-powered review analysis.

## User Personas
1. **Casual Shopper** - Wants quick insights before purchasing
2. **Power Shopper** - Buys frequently, needs unlimited checks
3. **Research-Oriented Buyer** - Values detailed complaint analysis
4. **Business User** - Needs team features and analytics

## Core Requirements (Static)
- Authentication: Google OAuth, Email/Password
- Forgot password with email reset
- Amazon product scraping for real product data
- AI-powered analysis with Buy/Think/Avoid verdict
- Display top 3 complaints from reviews
- Show "Who should NOT buy" recommendations
- Freemium: 3 free checks/month
- Premium: $6.99/month or $59/year
- Business Plans: Starter ($29), Pro ($99), Enterprise (Custom)

## What's Been Implemented
- [x] Stunning dark-themed landing page with animations (Dec 29, 2024)
- [x] Google OAuth via Emergent Auth (Dec 29, 2024)
- [x] Email/Password authentication with JWT (Dec 29, 2024)
- [x] Forgot password with email reset (Resend-ready) (Dec 29, 2024)
- [x] Amazon product scraping with BeautifulSoup (Dec 29, 2024)
- [x] AI-powered analysis using OpenAI GPT-5.2 (Dec 29, 2024)
- [x] Results page with score gauge, complaints, verdict (Dec 29, 2024)
- [x] Pricing page with Stripe integration (Dec 29, 2024)
- [x] Account page with subscription status (Dec 29, 2024)
- [x] Usage limits and subscription enforcement (Dec 29, 2024)
- [x] Multi-tier pricing UI (Shoppers + Business plans) (Dec 29, 2024)
- [x] History Page with stats, search, filters (Dec 29, 2024)
- [x] CSV Export API for Premium/Business users (Dec 29, 2024)
- [x] Session persistence fix (Dec 29, 2024)

## Tech Stack
- **Frontend**: React + Tailwind CSS + Shadcn/UI (Dark Theme)
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **AI**: OpenAI GPT-5.2 via emergentintegrations
- **Payments**: Stripe via emergentintegrations
- **Auth**: JWT + Emergent Google OAuth
- **Scraping**: BeautifulSoup + httpx
- **Email**: Resend (ready for production)

## Required API Keys
- `EMERGENT_LLM_KEY` - For GPT-5.2 analysis ✅ Configured
- `STRIPE_API_KEY` - For payments ✅ Configured  
- `RESEND_API_KEY` - For password reset emails (needs user key)

## Test Results
- Backend: 95% passing
- Frontend: 98% passing
- Session Persistence: ✅ Fixed and tested
- History Page: ✅ Working with all features
- CSV Export: ✅ Working (restricted to premium users)

## Prioritized Backlog

### P0 (Critical - Done)
- [x] Core analysis flow with real product data
- [x] Multiple auth options (Google, Email)
- [x] Forgot password
- [x] Amazon scraping integration
- [x] Multi-tier pricing display
- [x] History Page
- [x] CSV Export

### P1 (Important - Next)
- [ ] Add Resend API key for production emails
- [ ] Implement Stripe Price IDs for business plans
- [ ] Team management for business plans
- [ ] Email verification

### P2 (Nice to Have)
- [ ] Enterprise Campaign Dashboard
- [ ] Analytics View
- [ ] Browser extension
- [ ] Product comparison

## New Files Created (Dec 29, 2024)
- `/app/frontend/src/pages/HistoryPage.js` - Full history page with stats, search, filters, CSV export

## Key API Endpoints
- `GET /api/history` - Get user's analysis history (up to 100 items)
- `GET /api/history/export` - Export history as CSV (Premium+ only)
