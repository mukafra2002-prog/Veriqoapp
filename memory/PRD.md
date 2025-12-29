# Veriqo - Smart Amazon Shopping Assistant

## Problem Statement
Build Veriqo - a smart Amazon shopping assistant designed to help users make confident purchase decisions. Users paste an Amazon product link, and Veriqo generates a Buy/Think/Avoid score, highlights top 3 real complaints from verified reviews, and indicates who should NOT buy the product. Includes freemium model with 3 free checks per month and premium subscription.

## User Personas
1. **Casual Shopper** - Wants quick insights before purchasing
2. **Power Shopper** - Buys frequently, needs unlimited checks
3. **Research-Oriented Buyer** - Values detailed complaint analysis

## Core Requirements (Static)
- Paste Amazon product URL and analyze
- Generate Buy/Think/Avoid verdict with confidence score (0-100)
- Display top 3 complaints from verified reviews
- Show "Who should NOT buy" recommendations
- Include "Buy on Amazon" affiliate button
- Freemium: 3 free checks/month
- Premium: $6.99/month or $59/year (unlimited)

## What's Been Implemented
- [x] Landing page with hero section, features, CTA (Dec 29, 2024)
- [x] User authentication (register/login) with JWT (Dec 29, 2024)
- [x] Home page with Amazon URL input and usage counter (Dec 29, 2024)
- [x] AI-powered product analysis using OpenAI GPT-5.2 (Dec 29, 2024)
- [x] Results page with Bento grid layout (Dec 29, 2024)
- [x] Score gauge component with animated circular progress (Dec 29, 2024)
- [x] Top 3 complaints display with frequency percentages (Dec 29, 2024)
- [x] "Who should NOT buy" section (Dec 29, 2024)
- [x] Pricing page with monthly/yearly plans (Dec 29, 2024)
- [x] Stripe payment integration for subscriptions (Dec 29, 2024)
- [x] Account/Settings page with usage history (Dec 29, 2024)
- [x] Onboarding tutorial for new users (Dec 29, 2024)
- [x] Analysis history tracking (Dec 29, 2024)

## Tech Stack
- **Frontend**: React + Tailwind CSS + Shadcn/UI
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **AI**: OpenAI GPT-5.2 via emergentintegrations
- **Payments**: Stripe via emergentintegrations

## Prioritized Backlog

### P0 (Critical - Done)
- [x] Core analysis flow
- [x] User authentication
- [x] Free tier usage limits

### P1 (Important - Next)
- [ ] Real Amazon review scraping (currently AI-generated mock analysis)
- [ ] Email verification
- [ ] Password reset flow
- [ ] Save/favorite products (premium feature)

### P2 (Nice to Have)
- [ ] Browser extension
- [ ] Mobile app
- [ ] Product comparison feature
- [ ] Fake review detection alerts
- [ ] Multi-region support (UK, DE, etc.)
- [ ] Category-specific analysis templates

## Next Tasks
1. Integrate real Amazon product data scraping
2. Add email verification flow
3. Implement password reset
4. Add product saving for premium users
5. Build browser extension for quick checks
