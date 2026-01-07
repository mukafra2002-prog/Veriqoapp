# Veriqo - Smart Amazon Shopping Assistant

## Problem Statement
Build Veriqo - a smart Amazon shopping assistant with stunning landing page, Google & email authentication, forgot password, real Amazon product scraping, and AI-powered review analysis.

**Updated: January 2025** - Implemented "Safe Core" refactoring to make app language more neutral and reduce legal risk.

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

## What's Been Implemented
- [x] Stunning dark-themed landing page with animations (Dec 29, 2024)
- [x] Google OAuth via Emergent Auth (Dec 29, 2024)
- [x] Email/Password authentication with JWT (Dec 29, 2024)
- [x] Forgot password with email reset (Resend-ready) (Dec 29, 2024)
- [x] Amazon product scraping with BeautifulSoup (Dec 29, 2024)
- [x] AI-powered analysis using OpenAI GPT-4o-mini (Dec 29, 2024)
- [x] Results page with score gauge, feedback insights, verdict (Dec 29, 2024)
- [x] Pricing page with Stripe integration (Dec 29, 2024)
- [x] Account page with subscription status (Dec 29, 2024)
- [x] Usage limits and subscription enforcement (Dec 29, 2024)
- [x] Multi-tier pricing UI (Shoppers + Business plans) (Dec 29, 2024)
- [x] History Page with stats, search, filters (Dec 29, 2024)
- [x] CSV Export API for Premium/Business users (Dec 29, 2024)
- [x] Session persistence fix (Dec 29, 2024)
- [x] Wishlist feature (Jan 2025)
- [x] Product Comparison tool (Jan 2025)
- [x] Public Insight Pages with SEO (Jan 2025)
- [x] Admin Dashboard with AI controls (Jan 2025)
- [x] **Safe Core Refactoring** (Jan 7, 2025):
  - Verdicts: BUY → Great Match, THINK → Good Match, AVOID → Consider Options
  - "Top Complaints" → "Things to Know"
  - "Who Should NOT Buy" → "Best Suited For"
  - Removed Authenticity Score feature
  - Updated AI prompt for neutral language
  - Added required disclaimers

## Tech Stack
- **Frontend**: React + Tailwind CSS + Shadcn/UI (Dark Theme)
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **AI**: OpenAI GPT-4o-mini via emergentintegrations
- **Payments**: Stripe via emergentintegrations
- **Auth**: JWT + Emergent Google OAuth
- **Scraping**: BeautifulSoup + httpx
- **Email**: Resend (ready for production)

## Required API Keys
- `EMERGENT_LLM_KEY` - For GPT analysis ✅ Configured
- `STRIPE_API_KEY` - For payments ✅ Configured  
- `RESEND_API_KEY` - For password reset emails (needs user key)

## Test Results (Jan 7, 2025)
- Backend: 100% passing (10/10 tests)
- Frontend: 100% passing
- Safe Core Implementation: ✅ Complete
- All verdict terminology updated
- Backward compatibility maintained for old data

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

### P1 (Important - Next)
- [ ] Add Resend API key for production emails
- [ ] Implement Price Drop Alerts
- [ ] Populate Privacy Policy page content
- [ ] Populate Terms of Service page content
- [ ] Implement Stripe Price IDs for business plans
- [ ] Chrome Browser Extension (backend prep)

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
- `/app/frontend/src/pages/LandingPage.js` - Safe Core marketing copy
- `/app/frontend/src/components/ScoreGauge.js` - Verdict badge rendering

## Key API Endpoints
- `GET /api/history` - Get user's analysis history (up to 100 items)
- `GET /api/history/export` - Export history as CSV (Premium+ only)
- `POST /api/analyze` - Analyze Amazon product
- `GET /api/wishlist` - Get saved products
- `POST /api/compare` - Compare 2-3 products
- `GET /api/admin/stats` - Admin dashboard stats (Safe Core naming)
- `GET /api/admin/ai-config` - AI safety controls
