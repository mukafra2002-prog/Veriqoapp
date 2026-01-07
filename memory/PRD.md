# Veriqo - Smart Amazon Shopping Assistant

## Problem Statement
Build Veriqo - a smart Amazon shopping assistant with stunning landing page, Google & email authentication, forgot password, real Amazon product scraping, and AI-powered review analysis.

**Updated: January 2025** - Implemented "Safe Core" refactoring and pre-launch checklist items.

## User Personas
1. **Casual Shopper** - Wants quick insights before purchasing
2. **Power Shopper** - Buys frequently, needs unlimited checks
3. **Research-Oriented Buyer** - Values detailed feedback analysis
4. **Business User** - Needs team features and analytics

## Core Requirements (Static)
- Authentication: Google OAuth, Email/Password
- Forgot password with email reset
- Amazon product scraping for real product data
- AI-powered analysis with **Safe Core verdicts**: Great Match / Good Match / Consider Options
- Display **Things to Know** from feedback patterns
- Show **Best Suited For** recommendations (positive framing)
- Freemium: 3 free checks/month
- Premium: $6.99/month or $59/year
- Business Plans: Starter ($29), Pro ($99), Enterprise (Custom)

## Safe Core Principles (Implemented Jan 2025)
- **Neutral, informational tone only** - no accusations or judgments
- **Expectation framing** - help users understand what to expect
- **No negative labels** - removed "AVOID" verdict
- **Positive framing** - "Best Suited For" instead of "Who Should NOT Buy"
- **No authenticity scoring** - removed fake review detection
- **Required disclaimers** - automatically added to all AI outputs

## Pre-Launch Checklist (Completed Jan 7, 2025)

### ✅ Legal & Trust Pages
- [x] Privacy Policy (/privacy)
- [x] Terms of Service (/terms)
- [x] Disclaimer (/disclaimer)
- [x] Trust & Transparency (/trust)

### ✅ Contact & Support
- [x] Contact page (/contact) with support@veriqo.com
- [x] FAQ page (/faq) with searchable questions

### ✅ Tech Setup
- [x] Google Analytics installed (G-518729566)
- [x] Sitemap.xml generated
- [x] Robots.txt configured
- [x] SSL active (via Emergent platform)

### ✅ Monetization Ready
- [x] Affiliate disclosure visible in footer
- [x] Amazon affiliate links working
- [x] Stripe subscription checkout
- [x] Free vs paid limits clear

## What's Been Implemented

### Phase 1: Core MVP (Dec 2024)
- [x] Stunning dark-themed landing page with animations
- [x] Google OAuth via Emergent Auth
- [x] Email/Password authentication with JWT
- [x] Forgot password with email reset (Resend-ready)
- [x] Amazon product scraping with BeautifulSoup
- [x] AI-powered analysis using OpenAI GPT-4o-mini
- [x] Results page with score gauge, feedback insights, verdict
- [x] Pricing page with Stripe integration
- [x] Account page with subscription status
- [x] Usage limits and subscription enforcement

### Phase 2: Features (Dec 2024 - Jan 2025)
- [x] Multi-tier pricing UI (Shoppers + Business plans)
- [x] History Page with stats, search, filters
- [x] CSV Export API for Premium/Business users
- [x] Session persistence fix
- [x] Wishlist feature
- [x] Product Comparison tool
- [x] Public Insight Pages with SEO

### Phase 3: Admin & Safety (Jan 2025)
- [x] Admin Dashboard with AI controls
- [x] Safe Core Refactoring (verdicts, terminology)
- [x] Pre-launch checklist completion

## Tech Stack
- **Frontend**: React + Tailwind CSS + Shadcn/UI (Dark Theme)
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **AI**: OpenAI GPT-4o-mini via emergentintegrations
- **Payments**: Stripe via emergentintegrations
- **Auth**: JWT + Emergent Google OAuth
- **Scraping**: BeautifulSoup + httpx
- **Email**: Resend (ready for production)
- **Analytics**: Google Analytics 4

## Required API Keys
- `EMERGENT_LLM_KEY` - For GPT analysis ✅ Configured
- `STRIPE_API_KEY` - For payments ✅ Configured  
- `RESEND_API_KEY` - For password reset emails (needs user key)

## Test Results (Jan 7, 2025)
- Backend: 100% passing
- Frontend: 100% passing
- Pre-launch checklist: ✅ Complete
- Safe Core Implementation: ✅ Complete

## Prioritized Backlog

### P0 (Critical - Done)
- [x] Core analysis flow with real product data
- [x] Multiple auth options (Google, Email)
- [x] Forgot password
- [x] Amazon scraping integration
- [x] Multi-tier pricing display
- [x] History Page
- [x] CSV Export
- [x] Safe Core Refactoring
- [x] Pre-launch checklist

### P1 (Important - Next)
- [ ] Add Resend API key for production emails
- [ ] Implement Price Drop Alerts
- [ ] Chrome Browser Extension (backend prep)
- [ ] Implement Stripe Price IDs for business plans

### P2 (Nice to Have)
- [ ] Team management for business plans
- [ ] Email verification
- [ ] Enterprise Campaign Dashboard
- [ ] Analytics View
- [ ] Product comparison improvements
- [ ] Social proof & user reviews

## Key Files
- `/app/backend/server.py` - Main FastAPI backend with Safe Core prompt
- `/app/frontend/src/pages/ResultsPage.js` - Shows Things to Know, Best Suited For
- `/app/frontend/src/pages/HistoryPage.js` - Safe Core verdict display
- `/app/frontend/src/pages/LandingPage.js` - Safe Core marketing copy + footer
- `/app/frontend/src/pages/PrivacyPage.js` - Privacy Policy
- `/app/frontend/src/pages/TermsPage.js` - Terms of Service
- `/app/frontend/src/pages/DisclaimerPage.js` - Disclaimer
- `/app/frontend/src/pages/TrustPage.js` - Trust & Transparency
- `/app/frontend/src/pages/ContactPage.js` - Contact (support@veriqo.com)
- `/app/frontend/src/pages/FAQPage.js` - FAQ with categories
- `/app/frontend/public/sitemap.xml` - SEO sitemap
- `/app/frontend/public/robots.txt` - Search engine directives
- `/app/frontend/public/index.html` - Google Analytics (G-518729566)

## Key API Endpoints
- `GET /api/history` - Get user's analysis history
- `GET /api/history/export` - Export history as CSV
- `POST /api/analyze` - Analyze Amazon product
- `GET /api/wishlist` - Get saved products
- `POST /api/compare` - Compare 2-3 products
- `GET /api/admin/stats` - Admin dashboard stats
- `GET /api/admin/ai-config` - AI safety controls
