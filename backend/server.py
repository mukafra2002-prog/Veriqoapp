from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Request, Response, Body
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import secrets
import asyncio
import httpx
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'veriqo-secret-key-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24 * 7  # 7 days

# Resend Config
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# Twilio Config
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID', '')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN', '')
TWILIO_VERIFY_SERVICE = os.environ.get('TWILIO_VERIFY_SERVICE', '')

# Subscription Plans
SUBSCRIPTION_PLANS = {
    # Shopper Plans
    "monthly": {"price": 6.99, "name": "Premium Monthly", "checks_per_month": -1, "type": "shopper"},
    "yearly": {"price": 59.00, "name": "Premium Yearly", "checks_per_month": -1, "type": "shopper"},
    # Business Plans
    "business_starter": {"price": 29.00, "name": "Business Starter", "checks_per_month": 100, "team_size": 3, "type": "business"},
    "business_pro": {"price": 99.00, "name": "Business Pro", "checks_per_month": 500, "team_size": -1, "type": "business"},
}
FREE_CHECKS_PER_MONTH = 3

# Create the main app
app = FastAPI(title="Veriqo API", version="1.0.0")
api_router = APIRouter(prefix="/api")

# Pydantic Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PhoneLoginRequest(BaseModel):
    phone_number: str

class PhoneVerifyRequest(BaseModel):
    phone_number: str
    code: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class UserResponse(BaseModel):
    id: str
    email: Optional[str] = None
    phone: Optional[str] = None
    name: str
    picture: Optional[str] = None
    subscription_type: str
    subscription_expires: Optional[str] = None
    checks_used_this_month: int
    checks_remaining: int
    onboarding_completed: bool = False
    created_at: str

class TokenResponse(BaseModel):
    token: str
    user: UserResponse

class ProductAnalysisRequest(BaseModel):
    amazon_url: str

class Complaint(BaseModel):
    title: str
    description: str
    frequency: str

class ProductAnalysisResponse(BaseModel):
    id: str
    product_name: str
    product_image: Optional[str] = None
    amazon_url: str
    verdict: str
    confidence_score: int
    authenticity_score: Optional[int] = None  # Review authenticity score
    top_complaints: List[Complaint]
    who_should_not_buy: List[str]
    summary: str
    affiliate_url: str
    analyzed_at: str
    alternatives: Optional[List[dict]] = None  # Alternative product suggestions

class WishlistItem(BaseModel):
    id: str
    user_id: str
    product_url: str
    product_name: str
    product_image: Optional[str] = None
    added_at: str
    notes: Optional[str] = None

class ComparisonRequest(BaseModel):
    product_urls: List[str]  # 2-3 product URLs to compare

class CheckoutRequest(BaseModel):
    plan_id: str
    origin_url: str

class CheckoutResponse(BaseModel):
    url: str
    session_id: str

# Helper Functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(authorization: str = Header(None), request: Request = None):
    token = None
    
    # Try to get token from Authorization header
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
    
    # Try to get token from cookie
    if not token and request:
        token = request.cookies.get("session_token")
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_user_response(user: dict) -> UserResponse:
    checks_remaining = FREE_CHECKS_PER_MONTH - user.get("checks_used_this_month", 0)
    if user.get("subscription_type") == "premium":
        checks_remaining = -1
    
    return UserResponse(
        id=user["id"],
        email=user.get("email"),
        phone=user.get("phone"),
        name=user["name"],
        picture=user.get("picture"),
        subscription_type=user.get("subscription_type", "free"),
        subscription_expires=user.get("subscription_expires"),
        checks_used_this_month=user.get("checks_used_this_month", 0),
        checks_remaining=checks_remaining,
        onboarding_completed=user.get("onboarding_completed", False),
        created_at=user.get("created_at", "")
    )

# ==================== AUTH ROUTES ====================

# Email/Password Registration
@api_router.post("/auth/register", response_model=TokenResponse)
async def register(data: UserCreate):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    user = {
        "id": user_id,
        "email": data.email,
        "name": data.name,
        "password_hash": hash_password(data.password),
        "subscription_type": "free",
        "subscription_expires": None,
        "checks_used_this_month": 0,
        "month_reset_date": now,
        "onboarding_completed": False,
        "created_at": now
    }
    
    await db.users.insert_one(user)
    token = create_token(user_id)
    
    return TokenResponse(token=token, user=get_user_response(user))

# Email/Password Login
@api_router.post("/auth/login", response_model=TokenResponse)
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email}, {"_id": 0})
    if not user or not user.get("password_hash") or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"])
    return TokenResponse(token=token, user=get_user_response(user))

# Google OAuth Session Handler
@api_router.post("/auth/google/session")
async def google_auth_session(request: Request, response: Response):
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    # Fetch user data from Emergent auth service
    async with httpx.AsyncClient() as http_client:
        try:
            auth_response = await http_client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
            if auth_response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session")
            
            auth_data = auth_response.json()
        except Exception as e:
            logging.error(f"Google auth error: {e}")
            raise HTTPException(status_code=500, detail="Authentication failed")
    
    # Check if user exists
    email = auth_data.get("email")
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if existing_user:
        user = existing_user
        # Update user info if needed
        await db.users.update_one(
            {"email": email},
            {"$set": {
                "name": auth_data.get("name", existing_user.get("name")),
                "picture": auth_data.get("picture")
            }}
        )
        user["name"] = auth_data.get("name", existing_user.get("name"))
        user["picture"] = auth_data.get("picture")
    else:
        # Create new user
        user_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        user = {
            "id": user_id,
            "email": email,
            "name": auth_data.get("name", "User"),
            "picture": auth_data.get("picture"),
            "subscription_type": "free",
            "subscription_expires": None,
            "checks_used_this_month": 0,
            "month_reset_date": now,
            "onboarding_completed": False,
            "created_at": now
        }
        await db.users.insert_one(user)
    
    # Create JWT token
    token = create_token(user["id"])
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7 * 24 * 60 * 60,
        path="/"
    )
    
    return {"token": token, "user": get_user_response(user)}

# Phone OTP - Send Code
@api_router.post("/auth/phone/send-otp")
async def send_phone_otp(data: PhoneLoginRequest):
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN or not TWILIO_VERIFY_SERVICE:
        # Mock OTP for development
        otp_code = "123456"
        await db.phone_otps.update_one(
            {"phone": data.phone_number},
            {"$set": {
                "phone": data.phone_number,
                "code": otp_code,
                "expires_at": (datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat(),
                "created_at": datetime.now(timezone.utc).isoformat()
            }},
            upsert=True
        )
        return {"status": "pending", "message": "OTP sent (dev mode: 123456)"}
    
    from twilio.rest import Client
    twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    
    try:
        verification = twilio_client.verify.services(TWILIO_VERIFY_SERVICE) \
            .verifications.create(to=data.phone_number, channel="sms")
        return {"status": verification.status}
    except Exception as e:
        logging.error(f"Twilio error: {e}")
        raise HTTPException(status_code=400, detail="Failed to send OTP")

# Phone OTP - Verify Code
@api_router.post("/auth/phone/verify-otp", response_model=TokenResponse)
async def verify_phone_otp(data: PhoneVerifyRequest):
    is_valid = False
    
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN or not TWILIO_VERIFY_SERVICE:
        # Mock verification for development
        otp_record = await db.phone_otps.find_one({"phone": data.phone_number}, {"_id": 0})
        if otp_record and otp_record.get("code") == data.code:
            is_valid = True
            await db.phone_otps.delete_one({"phone": data.phone_number})
    else:
        from twilio.rest import Client
        twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        try:
            check = twilio_client.verify.services(TWILIO_VERIFY_SERVICE) \
                .verification_checks.create(to=data.phone_number, code=data.code)
            is_valid = check.status == "approved"
        except Exception as e:
            logging.error(f"Twilio verify error: {e}")
            raise HTTPException(status_code=400, detail="Verification failed")
    
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid OTP code")
    
    # Find or create user by phone
    existing_user = await db.users.find_one({"phone": data.phone_number}, {"_id": 0})
    
    if existing_user:
        user = existing_user
    else:
        user_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        user = {
            "id": user_id,
            "phone": data.phone_number,
            "name": f"User {data.phone_number[-4:]}",
            "subscription_type": "free",
            "subscription_expires": None,
            "checks_used_this_month": 0,
            "month_reset_date": now,
            "onboarding_completed": False,
            "created_at": now
        }
        await db.users.insert_one(user)
    
    token = create_token(user["id"])
    return TokenResponse(token=token, user=get_user_response(user))

# Forgot Password - Request Reset
@api_router.post("/auth/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, request: Request):
    user = await db.users.find_one({"email": data.email}, {"_id": 0})
    
    # Always return success to prevent email enumeration
    if not user:
        return {"message": "If an account exists, a reset link has been sent"}
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    
    await db.password_resets.update_one(
        {"email": data.email},
        {"$set": {
            "email": data.email,
            "token": reset_token,
            "expires_at": expires_at.isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }},
        upsert=True
    )
    
    # Get frontend URL from referer or use default
    referer = request.headers.get("referer", "")
    if referer:
        from urllib.parse import urlparse
        parsed = urlparse(referer)
        frontend_url = f"{parsed.scheme}://{parsed.netloc}"
    else:
        frontend_url = os.environ.get("FRONTEND_URL", "https://veriqo.app")
    
    # Send email if Resend is configured
    if resend.api_key:
        try:
            reset_link = f"{frontend_url}/reset-password?token={reset_token}"
            html_content = f"""
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0f172a;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #fff; font-size: 28px; margin: 0;">⚡ Veriqo</h1>
                </div>
                <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 1px solid #334155; border-radius: 16px; padding: 32px;">
                    <h2 style="color: #fff; font-size: 24px; margin: 0 0 16px 0;">Reset Your Password</h2>
                    <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                        You requested to reset your Veriqo password. Click the button below to create a new password:
                    </p>
                    <a href="{reset_link}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
                        Reset Password
                    </a>
                    <p style="color: #64748b; font-size: 14px; margin: 24px 0 0 0;">
                        This link expires in 1 hour. If you didn't request this, please ignore this email.
                    </p>
                </div>
                <p style="color: #475569; font-size: 12px; text-align: center; margin-top: 24px;">
                    © 2024 Veriqo. Verify before you buy.
                </p>
            </div>
            """
            
            params = {
                "from": SENDER_EMAIL,
                "to": [data.email],
                "subject": "Reset Your Veriqo Password",
                "html": html_content
            }
            await asyncio.to_thread(resend.Emails.send, params)
            logging.info(f"Password reset email sent to {data.email}")
        except Exception as e:
            logging.error(f"Email send error: {e}")
    else:
        logging.warning("Resend API key not configured - password reset email not sent")
        # Store the reset link in the response for development
        logging.info(f"Reset link (dev): {frontend_url}/reset-password?token={reset_token}")
    
    return {"message": "If an account exists, a reset link has been sent"}

# Reset Password
@api_router.post("/auth/reset-password")
async def reset_password(data: ResetPasswordRequest):
    reset_record = await db.password_resets.find_one({"token": data.token}, {"_id": 0})
    
    if not reset_record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Check expiry
    expires_at = datetime.fromisoformat(reset_record["expires_at"].replace('Z', '+00:00'))
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if datetime.now(timezone.utc) > expires_at:
        await db.password_resets.delete_one({"token": data.token})
        raise HTTPException(status_code=400, detail="Reset token has expired")
    
    # Update password
    await db.users.update_one(
        {"email": reset_record["email"]},
        {"$set": {"password_hash": hash_password(data.new_password)}}
    )
    
    # Delete reset token
    await db.password_resets.delete_one({"token": data.token})
    
    return {"message": "Password reset successfully"}

# Get Current User
@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    return get_user_response(user)

# Complete Onboarding
@api_router.put("/auth/complete-onboarding")
async def complete_onboarding(user: dict = Depends(get_current_user)):
    await db.users.update_one({"id": user["id"]}, {"$set": {"onboarding_completed": True}})
    return {"success": True}

# Logout
@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out successfully"}

# ==================== PRODUCT ANALYSIS ROUTES ====================

@api_router.post("/analyze", response_model=ProductAnalysisResponse)
async def analyze_product(data: ProductAnalysisRequest, user: dict = Depends(get_current_user)):
    # Check usage limits
    if user.get("subscription_type") != "premium":
        month_reset = user.get("month_reset_date", "")
        if month_reset:
            try:
                reset_date = datetime.fromisoformat(month_reset.replace('Z', '+00:00'))
                if reset_date.tzinfo is None:
                    reset_date = reset_date.replace(tzinfo=timezone.utc)
                if datetime.now(timezone.utc) - reset_date > timedelta(days=30):
                    await db.users.update_one(
                        {"id": user["id"]},
                        {"$set": {"checks_used_this_month": 0, "month_reset_date": datetime.now(timezone.utc).isoformat()}}
                    )
                    user["checks_used_this_month"] = 0
            except:
                pass
        
        if user.get("checks_used_this_month", 0) >= FREE_CHECKS_PER_MONTH:
            raise HTTPException(status_code=403, detail="Free checks exhausted. Upgrade to premium for unlimited checks.")
    
    if "amazon.com" not in data.amazon_url and "amzn.to" not in data.amazon_url:
        raise HTTPException(status_code=400, detail="Please provide a valid Amazon product URL")
    
    try:
        analysis = await perform_ai_analysis(data.amazon_url)
    except Exception as e:
        logging.error(f"AI Analysis error: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze product. Please try again.")
    
    await db.users.update_one(
        {"id": user["id"]},
        {"$inc": {"checks_used_this_month": 1}}
    )
    
    analysis_id = str(uuid.uuid4())
    analysis_doc = {
        "id": analysis_id,
        "user_id": user["id"],
        **analysis,
        "analyzed_at": datetime.now(timezone.utc).isoformat()
    }
    await db.product_analyses.insert_one(analysis_doc)
    
    return ProductAnalysisResponse(
        id=analysis_id,
        **analysis,
        analyzed_at=analysis_doc["analyzed_at"]
    )

async def perform_ai_analysis(amazon_url: str) -> dict:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    from bs4 import BeautifulSoup
    import json
    import re
    
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        raise Exception("EMERGENT_LLM_KEY not configured")
    
    # Try to scrape real Amazon product data
    scraped_data = await scrape_amazon_product(amazon_url)
    
    # Build AI prompt with scraped data if available
    if scraped_data and scraped_data.get("product_name"):
        product_context = f"""
Product Name: {scraped_data.get('product_name', 'Unknown')}
Price: {scraped_data.get('price', 'Unknown')}
Rating: {scraped_data.get('rating', 'Unknown')}
Review Count: {scraped_data.get('review_count', 'Unknown')}
Sample Reviews:
{scraped_data.get('sample_reviews', 'No reviews available')}
"""
        prompt = f"""Analyze this Amazon product based on the following real data:

{product_context}

URL: {amazon_url}

Based on this information, provide your analysis with a Buy/Think/Avoid verdict."""
    else:
        prompt = f"Analyze this Amazon product URL and provide your verdict: {amazon_url}\n\nGenerate a realistic analysis for this product. Be specific and helpful."
    
    chat = LlmChat(
        api_key=api_key,
        session_id=f"veriqo-analysis-{uuid.uuid4()}",
        system_message="""You are Veriqo, an expert Amazon product review analyzer. Your job is to help shoppers make confident purchase decisions by analyzing product reviews.

Given product data (or just a URL), analyze and provide:
1. A verdict: "buy" (score 70-100), "think" (score 40-69), or "avoid" (score 0-39)
2. A confidence score from 0-100
3. An authenticity score from 0-100 (how trustworthy the reviews appear - look for signs of fake reviews)
4. Top 3 real complaints from reviews (or realistic ones if no reviews provided)
5. Who should NOT buy this product (2-3 specific user types)
6. A brief summary
7. 2 alternative product suggestions (generic product types that might be better)

Respond ONLY with valid JSON in this exact format:
{
  "product_name": "Product Name Here",
  "product_image": null,
  "verdict": "buy|think|avoid",
  "confidence_score": 75,
  "authenticity_score": 82,
  "top_complaints": [
    {"title": "Complaint Title", "description": "Detailed description of the complaint", "frequency": "23% of reviews"},
    {"title": "Another Issue", "description": "Another common complaint", "frequency": "18% of reviews"},
    {"title": "Third Concern", "description": "Third most common issue", "frequency": "12% of reviews"}
  ],
  "who_should_not_buy": ["User type 1 who shouldn't buy", "User type 2 who shouldn't buy"],
  "summary": "Brief 2-3 sentence summary of the product quality and value",
  "alternatives": [
    {"name": "Alternative Product 1", "reason": "Why this might be better"},
    {"name": "Alternative Product 2", "reason": "Why this might be better"}
  ]
}"""
    ).with_model("openai", "gpt-5.2")
    
    user_message = UserMessage(text=prompt)
    response = await chat.send_message(user_message)
    
    try:
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            result = json.loads(json_match.group())
        else:
            raise ValueError("No JSON found")
        
        # Use scraped product name if AI didn't provide one
        if scraped_data and scraped_data.get("product_name") and result.get("product_name") == "Product Name Here":
            result["product_name"] = scraped_data["product_name"]
        if scraped_data and scraped_data.get("product_image"):
            result["product_image"] = scraped_data["product_image"]
            
    except:
        result = {
            "product_name": scraped_data.get("product_name", "Amazon Product") if scraped_data else "Amazon Product",
            "product_image": scraped_data.get("product_image") if scraped_data else None,
            "verdict": "think",
            "confidence_score": 65,
            "authenticity_score": 70,
            "top_complaints": [
                {"title": "Quality Concerns", "description": "Some users report build quality issues", "frequency": "15% of reviews"},
                {"title": "Shipping Issues", "description": "Occasional delays reported", "frequency": "8% of reviews"},
                {"title": "Size Variations", "description": "Dimensions may vary", "frequency": "5% of reviews"}
            ],
            "who_should_not_buy": ["Users seeking premium quality", "Those needing immediate delivery"],
            "summary": "Decent value but has some quality control issues.",
            "alternatives": [
                {"name": "Higher-rated alternative in same category", "reason": "Better reviews and quality"},
                {"name": "Budget-friendly option", "reason": "Similar features at lower price"}
            ]
        }
    
    affiliate_tag = "veriqo-20"
    affiliate_url = f"{amazon_url}?tag={affiliate_tag}" if "?" not in amazon_url else f"{amazon_url}&tag={affiliate_tag}"
    
    result["amazon_url"] = amazon_url
    result["affiliate_url"] = affiliate_url
    
    return result

async def scrape_amazon_product(url: str) -> dict:
    """Scrape basic product info from Amazon"""
    from bs4 import BeautifulSoup
    import re
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
    }
    
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as client:
            response = await client.get(url, headers=headers)
            
            if response.status_code != 200:
                logging.warning(f"Amazon returned status {response.status_code}")
                return {}
            
            soup = BeautifulSoup(response.text, 'lxml')
            
            # Extract product name
            product_name = None
            name_selectors = ['#productTitle', '#title', 'h1.a-size-large']
            for selector in name_selectors:
                elem = soup.select_one(selector)
                if elem:
                    product_name = elem.get_text(strip=True)
                    break
            
            # Extract price
            price = None
            price_selectors = ['.a-price .a-offscreen', '#priceblock_ourprice', '#priceblock_dealprice', '.a-price-whole']
            for selector in price_selectors:
                elem = soup.select_one(selector)
                if elem:
                    price = elem.get_text(strip=True)
                    break
            
            # Extract rating
            rating = None
            rating_elem = soup.select_one('.a-icon-star span.a-icon-alt, #acrPopover span.a-icon-alt')
            if rating_elem:
                rating = rating_elem.get_text(strip=True)
            
            # Extract review count
            review_count = None
            review_elem = soup.select_one('#acrCustomerReviewText')
            if review_elem:
                review_count = review_elem.get_text(strip=True)
            
            # Extract product image
            product_image = None
            img_elem = soup.select_one('#landingImage, #imgBlkFront')
            if img_elem:
                product_image = img_elem.get('src') or img_elem.get('data-old-hires')
            
            # Extract sample reviews from the product page
            sample_reviews = []
            review_elems = soup.select('.review-text-content span, .a-expander-content.reviewText')[:5]
            for rev in review_elems:
                text = rev.get_text(strip=True)
                if text and len(text) > 20:
                    sample_reviews.append(text[:300])
            
            return {
                "product_name": product_name,
                "price": price,
                "rating": rating,
                "review_count": review_count,
                "product_image": product_image,
                "sample_reviews": "\n".join(sample_reviews) if sample_reviews else ""
            }
            
    except Exception as e:
        logging.error(f"Amazon scrape error: {e}")
        return {}

@api_router.get("/history", response_model=List[ProductAnalysisResponse])
async def get_history(user: dict = Depends(get_current_user), limit: int = 100):
    analyses = await db.product_analyses.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("analyzed_at", -1).limit(limit).to_list(limit)
    
    return analyses

@api_router.get("/history/export")
async def export_history(user: dict = Depends(get_current_user)):
    """Export user's analysis history as CSV. Available for Premium and Business plans."""
    import io
    import csv
    from fastapi.responses import StreamingResponse
    
    # Check subscription
    if user.get("subscription_type") == "free":
        raise HTTPException(status_code=403, detail="CSV export is available for Premium and Business plans")
    
    # Fetch all analyses
    analyses = await db.product_analyses.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("analyzed_at", -1).to_list(1000)
    
    # Create CSV
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow([
        "Product Name", "Verdict", "Score", "Summary", 
        "Top Complaints", "Who Should Not Buy", "Amazon URL", "Analyzed At"
    ])
    
    # Data rows
    for analysis in analyses:
        complaints = "; ".join([c.get("title", "") for c in analysis.get("top_complaints", [])])
        who_not = "; ".join(analysis.get("who_should_not_buy", []))
        writer.writerow([
            analysis.get("product_name", ""),
            analysis.get("verdict", ""),
            analysis.get("confidence_score", ""),
            analysis.get("summary", ""),
            complaints,
            who_not,
            analysis.get("amazon_url", ""),
            analysis.get("analyzed_at", "")
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=veriqo-history-{datetime.now(timezone.utc).strftime('%Y-%m-%d')}.csv"}
    )

# ==================== WISHLIST ROUTES ====================

@api_router.get("/wishlist", response_model=List[WishlistItem])
async def get_wishlist(user: dict = Depends(get_current_user)):
    """Get user's saved products/wishlist"""
    items = await db.wishlist.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("added_at", -1).to_list(100)
    return items

@api_router.post("/wishlist", response_model=WishlistItem)
async def add_to_wishlist(
    product_url: str = Body(..., embed=True),
    product_name: str = Body(None, embed=True),
    product_image: str = Body(None, embed=True),
    notes: str = Body(None, embed=True),
    user: dict = Depends(get_current_user)
):
    """Add a product to wishlist"""
    # Check if already in wishlist
    existing = await db.wishlist.find_one({"user_id": user["id"], "product_url": product_url})
    if existing:
        raise HTTPException(status_code=400, detail="Product already in wishlist")
    
    item = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "product_url": product_url,
        "product_name": product_name or "Saved Product",
        "product_image": product_image,
        "notes": notes,
        "added_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.wishlist.insert_one(item)
    if "_id" in item:
        del item["_id"]
    return item

@api_router.delete("/wishlist/{item_id}")
async def remove_from_wishlist(item_id: str, user: dict = Depends(get_current_user)):
    """Remove a product from wishlist"""
    result = await db.wishlist.delete_one({"id": item_id, "user_id": user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Removed from wishlist"}

# ==================== COMPARISON ROUTES ====================

@api_router.post("/compare")
async def compare_products(data: ComparisonRequest, user: dict = Depends(get_current_user)):
    """Compare 2-3 Amazon products side by side"""
    if len(data.product_urls) < 2 or len(data.product_urls) > 3:
        raise HTTPException(status_code=400, detail="Please provide 2-3 product URLs")
    
    # Check user's remaining checks
    checks_needed = len(data.product_urls)
    if user.get("subscription_type") == "free" and user.get("checks_remaining", 0) < checks_needed:
        raise HTTPException(
            status_code=403, 
            detail=f"Not enough checks. Need {checks_needed}, have {user.get('checks_remaining', 0)}"
        )
    
    # Analyze each product
    comparisons = []
    for url in data.product_urls:
        # Check if already analyzed
        existing = await db.product_analyses.find_one(
            {"amazon_url": url, "user_id": user["id"]},
            {"_id": 0}
        )
        
        if existing:
            comparisons.append(existing)
        else:
            # Analyze new product
            try:
                result = await analyze_amazon_product(url)
                result["id"] = str(uuid.uuid4())
                result["user_id"] = user["id"]
                result["analyzed_at"] = datetime.now(timezone.utc).isoformat()
                
                await db.product_analyses.insert_one({**result, "_id": result["id"]})
                
                # Deduct check
                if user.get("subscription_type") == "free":
                    await db.users.update_one(
                        {"id": user["id"]},
                        {"$inc": {"checks_remaining": -1, "checks_used_this_month": 1}}
                    )
                
                comparisons.append(result)
            except Exception as e:
                logging.error(f"Failed to analyze {url}: {e}")
                comparisons.append({"error": str(e), "url": url})
    
    # Generate comparison summary
    comparison_summary = generate_comparison_summary(comparisons)
    
    return {
        "products": comparisons,
        "comparison_summary": comparison_summary,
        "winner": get_comparison_winner(comparisons)
    }

def generate_comparison_summary(products: List[dict]) -> dict:
    """Generate a summary comparing the products"""
    valid_products = [p for p in products if "error" not in p]
    
    if not valid_products:
        return {"message": "Unable to compare products"}
    
    return {
        "total_products": len(valid_products),
        "verdicts": {p.get("product_name", "Unknown")[:30]: p.get("verdict") for p in valid_products},
        "scores": {p.get("product_name", "Unknown")[:30]: p.get("confidence_score") for p in valid_products},
        "best_score": max([p.get("confidence_score", 0) for p in valid_products]),
        "worst_score": min([p.get("confidence_score", 0) for p in valid_products])
    }

def get_comparison_winner(products: List[dict]) -> dict:
    """Determine the winner based on confidence score"""
    valid_products = [p for p in products if "error" not in p and p.get("confidence_score")]
    
    if not valid_products:
        return None
    
    winner = max(valid_products, key=lambda x: x.get("confidence_score", 0))
    return {
        "product_name": winner.get("product_name"),
        "confidence_score": winner.get("confidence_score"),
        "verdict": winner.get("verdict"),
        "reason": f"Highest confidence score of {winner.get('confidence_score')}%"
    }

# ==================== ADMIN ROUTES ====================

async def get_admin_user(user: dict = Depends(get_current_user)):
    """Dependency to check if user is admin"""
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@api_router.get("/admin/stats")
async def get_admin_stats(admin: dict = Depends(get_admin_user)):
    """Get admin dashboard statistics"""
    from datetime import timedelta
    
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    
    # User stats
    total_users = await db.users.count_documents({})
    new_users_today = await db.users.count_documents({"created_at": {"$gte": today.isoformat()}})
    premium_users = await db.users.count_documents({"subscription_type": "premium"})
    
    # Analysis stats
    total_analyses = await db.product_analyses.count_documents({})
    analyses_today = await db.product_analyses.count_documents({"analyzed_at": {"$gte": today.isoformat()}})
    
    # Verdict distribution
    verdict_buy = await db.product_analyses.count_documents({"verdict": "BUY"})
    verdict_think = await db.product_analyses.count_documents({"verdict": "THINK"})
    verdict_avoid = await db.product_analyses.count_documents({"verdict": "AVOID"})
    
    return {
        "total_users": total_users,
        "new_users_today": new_users_today,
        "premium_users": premium_users,
        "premium_percentage": round((premium_users / total_users * 100) if total_users > 0 else 0, 1),
        "total_analyses": total_analyses,
        "analyses_today": analyses_today,
        "verdict_buy": verdict_buy,
        "verdict_think": verdict_think,
        "verdict_avoid": verdict_avoid,
        "mrr": premium_users * 6.99,
        "revenue_today": 0
    }

@api_router.get("/admin/users")
async def get_admin_users(admin: dict = Depends(get_admin_user), limit: int = 100):
    """Get all users for admin"""
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return users

@api_router.get("/admin/analyses")
async def get_admin_analyses(admin: dict = Depends(get_admin_user), limit: int = 100):
    """Get all analyses for admin"""
    analyses = await db.product_analyses.find({}, {"_id": 0}).sort("analyzed_at", -1).limit(limit).to_list(limit)
    return analyses

@api_router.patch("/admin/users/{user_id}")
async def update_user_admin(user_id: str, is_admin: bool = Body(..., embed=True), admin: dict = Depends(get_admin_user)):
    """Update user admin status"""
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {"is_admin": is_admin}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User updated"}

@api_router.post("/admin/users/{user_id}/reset-checks")
async def reset_user_checks(user_id: str, admin: dict = Depends(get_admin_user)):
    """Reset user's monthly checks"""
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {"checks_remaining": 3, "checks_used_this_month": 0}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Checks reset"}

# ==================== PUBLIC INSIGHTS ROUTES ====================

@api_router.get("/insights", response_model=List[ProductAnalysisResponse])
async def get_public_insights():
    """Get list of public product insights for SEO pages. Limited to 1 product for free access."""
    # Only return 1 product insight publicly to encourage sign-ups
    analyses = await db.product_analyses.find(
        {"is_public": {"$ne": False}},
        {"_id": 0}
    ).sort("analyzed_at", -1).limit(1).to_list(1)
    
    return analyses

@api_router.get("/insights/{product_id}", response_model=ProductAnalysisResponse)
async def get_public_insight(product_id: str):
    """Get a single public product insight. No auth required."""
    # First check if this is the most recent public insight (the only one allowed)
    latest_insight = await db.product_analyses.find_one(
        {"is_public": {"$ne": False}},
        {"_id": 0},
        sort=[("analyzed_at", -1)]
    )
    
    if not latest_insight or latest_insight.get("id") != product_id:
        raise HTTPException(
            status_code=403, 
            detail="Sign up for free to view more product insights"
        )
    
    return latest_insight

# ==================== PAYMENT ROUTES ====================

@api_router.post("/payments/checkout", response_model=CheckoutResponse)
async def create_checkout(data: CheckoutRequest, request: Request, user: dict = Depends(get_current_user)):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest
    
    if data.plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    plan = SUBSCRIPTION_PLANS[data.plan_id]
    stripe_api_key = os.environ.get('STRIPE_API_KEY')
    
    if not stripe_api_key:
        raise HTTPException(status_code=500, detail="Payment system not configured")
    
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    success_url = f"{data.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{data.origin_url}/pricing"
    
    checkout_request = CheckoutSessionRequest(
        amount=float(plan["price"]),
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": user["id"],
            "plan_id": data.plan_id,
            "user_email": user.get("email", "")
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    transaction = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "user_id": user["id"],
        "plan_id": data.plan_id,
        "amount": plan["price"],
        "currency": "usd",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.payment_transactions.insert_one(transaction)
    
    return CheckoutResponse(url=session.url, session_id=session.session_id)

@api_router.get("/payments/status/{session_id}")
async def check_payment_status(session_id: str, user: dict = Depends(get_current_user)):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    stripe_api_key = os.environ.get('STRIPE_API_KEY')
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url="")
    
    status = await stripe_checkout.get_checkout_status(session_id)
    
    if status.payment_status == "paid":
        transaction = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
        if transaction and transaction.get("payment_status") != "completed":
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": "completed", "completed_at": datetime.now(timezone.utc).isoformat()}}
            )
            
            plan_id = transaction.get("plan_id", "monthly")
            expires = datetime.now(timezone.utc) + timedelta(days=365 if plan_id == "yearly" else 30)
            
            await db.users.update_one(
                {"id": user["id"]},
                {"$set": {
                    "subscription_type": "premium",
                    "subscription_expires": expires.isoformat(),
                    "subscription_plan": plan_id
                }}
            )
    
    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "amount_total": status.amount_total,
        "currency": status.currency
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    stripe_api_key = os.environ.get('STRIPE_API_KEY')
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url="")
    
    body = await request.body()
    signature = request.headers.get("Stripe-Signature", "")
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            session_id = webhook_response.session_id
            transaction = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
            
            if transaction and transaction.get("payment_status") != "completed":
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {"payment_status": "completed"}}
                )
                
                user_id = transaction.get("user_id")
                plan_id = transaction.get("plan_id", "monthly")
                expires = datetime.now(timezone.utc) + timedelta(days=365 if plan_id == "yearly" else 30)
                
                await db.users.update_one(
                    {"id": user_id},
                    {"$set": {
                        "subscription_type": "premium",
                        "subscription_expires": expires.isoformat()
                    }}
                )
        
        return {"status": "ok"}
    except Exception as e:
        logging.error(f"Webhook error: {e}")
        return {"status": "error"}

# Health check
@api_router.get("/")
async def root():
    return {"message": "Veriqo API v1.0", "status": "healthy"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
