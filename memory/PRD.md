# Veriqo - Smart Amazon Shopping Assistant

## Problem Statement
Build Veriqo - a smart Amazon shopping assistant with stunning landing page, multiple authentication options (Google, Phone OTP, Email/Password), forgot password, and AI-powered product review analysis.

## User Personas
1. **Casual Shopper** - Wants quick insights before purchasing
2. **Power Shopper** - Buys frequently, needs unlimited checks
3. **Mobile User** - Prefers phone login over email

## Core Requirements (Static)
- Multiple authentication: Google OAuth, Phone OTP, Email/Password
- Forgot password with email reset
- Paste Amazon product URL and analyze
- Generate Buy/Think/Avoid verdict with confidence score (0-100)
- Display top 3 complaints from verified reviews
- Show "Who should NOT buy" recommendations
- Freemium: 3 free checks/month
- Premium: $6.99/month or $59/year (unlimited)

## What's Been Implemented
- [x] Stunning dark-themed landing page with animations (Dec 29, 2024)
- [x] Google OAuth via Emergent Auth (Dec 29, 2024)
- [x] Phone OTP login (Twilio-ready, dev mock: 123456) (Dec 29, 2024)
- [x] Email/Password authentication with JWT (Dec 29, 2024)
- [x] Forgot password with email reset (Resend-ready) (Dec 29, 2024)
- [x] Password reset page (Dec 29, 2024)
- [x] Home page with dark theme and usage counter (Dec 29, 2024)
- [x] AI-powered product analysis using OpenAI GPT-5.2 (Dec 29, 2024)
- [x] Results page with Bento grid, score gauge, complaints (Dec 29, 2024)
- [x] Pricing page with Stripe integration (Dec 29, 2024)
- [x] Account page with subscription status (Dec 29, 2024)
- [x] Onboarding tutorial for new users (Dec 29, 2024)

## Tech Stack
- **Frontend**: React + Tailwind CSS + Shadcn/UI (Dark Theme)
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **AI**: OpenAI GPT-5.2 via emergentintegrations
- **Payments**: Stripe via emergentintegrations
- **Auth**: JWT + Emergent Google OAuth + Twilio SMS

## Required API Keys
- `EMERGENT_LLM_KEY` - For GPT-5.2 analysis (configured)
- `STRIPE_API_KEY` - For payments (configured)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SERVICE` - For real SMS OTP (optional, uses mock in dev)
- `RESEND_API_KEY` - For password reset emails (optional)

## Prioritized Backlog

### P0 (Critical - Done)
- [x] Core analysis flow
- [x] Multiple auth options (Google, Phone, Email)
- [x] Forgot password
- [x] Stunning landing page

### P1 (Important - Next)
- [ ] Real Amazon review scraping
- [ ] Configure Twilio for production SMS
- [ ] Configure Resend for production emails
- [ ] Email verification

### P2 (Nice to Have)
- [ ] Browser extension
- [ ] Mobile app
- [ ] Product comparison
- [ ] Fake review detection
- [ ] Multi-region support

## Next Tasks
1. Configure Twilio credentials for production SMS OTP
2. Configure Resend for production password reset emails
3. Integrate real Amazon product data scraping
4. Add email verification
5. Build browser extension
