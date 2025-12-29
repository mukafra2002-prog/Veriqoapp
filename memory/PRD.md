# Veriqo - Smart Amazon Shopping Assistant

## Problem Statement
Build Veriqo - a smart Amazon shopping assistant with stunning landing page, Google & email authentication, forgot password, real Amazon product scraping, and AI-powered review analysis.

## User Personas
1. **Casual Shopper** - Wants quick insights before purchasing
2. **Power Shopper** - Buys frequently, needs unlimited checks
3. **Research-Oriented Buyer** - Values detailed complaint analysis

## Core Requirements (Static)
- Authentication: Google OAuth, Email/Password
- Forgot password with email reset
- Amazon product scraping for real product data
- AI-powered analysis with Buy/Think/Avoid verdict
- Display top 3 complaints from reviews
- Show "Who should NOT buy" recommendations
- Freemium: 3 free checks/month
- Premium: $6.99/month or $59/year

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
- `RESEND_API_KEY` - For password reset emails (optional)

## Test Results
- Backend: 95% passing
- Frontend: 98% passing
- Amazon scraping successfully retrieves real product names
- AI analysis generates meaningful verdicts and scores

## Prioritized Backlog

### P0 (Critical - Done)
- [x] Core analysis flow with real product data
- [x] Multiple auth options (Google, Email)
- [x] Forgot password
- [x] Amazon scraping integration

### P1 (Important - Next)
- [ ] Add Resend API key for production emails
- [ ] Improve Amazon scraping success rate
- [ ] Email verification

### P2 (Nice to Have)
- [ ] Browser extension
- [ ] Product comparison
- [ ] Saved products for premium users

## Next Tasks
1. Add Resend API key for production password reset emails
2. Consider using Amazon Product API for reliable data
3. Add email verification
