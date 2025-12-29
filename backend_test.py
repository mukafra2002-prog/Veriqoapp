import requests
import sys
import json
from datetime import datetime
import time

class VeriqoAPITester:
    def __init__(self, base_url="https://smart-shopper-157.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None
        self.analysis_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "",
            200
        )
        return success

    def test_register(self, name="Test User", email="test@example.com", password="test123"):
        """Test user registration"""
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={"name": name, "email": email, "password": password}
        )
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_login(self, email="test@example.com", password="test123"):
        """Test user login"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_get_me(self):
        """Test get current user endpoint"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_complete_onboarding(self):
        """Test complete onboarding endpoint"""
        success, response = self.run_test(
            "Complete Onboarding",
            "PUT",
            "auth/complete-onboarding",
            200
        )
        return success

    def test_analyze_product(self, amazon_url="https://www.amazon.com/dp/B08N5WRWNW"):
        """Test product analysis endpoint"""
        success, response = self.run_test(
            "Product Analysis",
            "POST",
            "analyze",
            200,
            data={"amazon_url": amazon_url}
        )
        if success:
            print(f"   Analysis ID: {response.get('id', 'N/A')}")
            print(f"   Product: {response.get('product_name', 'N/A')}")
            print(f"   Verdict: {response.get('verdict', 'N/A')}")
            print(f"   Score: {response.get('confidence_score', 'N/A')}")
            return True, response.get('id')
        return False, None

    def test_get_history(self):
        """Test get analysis history endpoint"""
        success, response = self.run_test(
            "Get Analysis History",
            "GET",
            "history",
            200
        )
        if success:
            print(f"   History items: {len(response)}")
        return success

    def test_invalid_amazon_url(self):
        """Test analysis with invalid URL"""
        success, response = self.run_test(
            "Invalid Amazon URL",
            "POST",
            "analyze",
            400,
            data={"amazon_url": "https://www.google.com"}
        )
        return success

    def test_unauthorized_access(self):
        """Test unauthorized access"""
        original_token = self.token
        self.token = None
        success, response = self.run_test(
            "Unauthorized Access",
            "GET",
            "auth/me",
            401
        )
        self.token = original_token
        return success

    def test_forgot_password(self, email="test@example.com"):
        """Test forgot password endpoint"""
        success, response = self.run_test(
            "Forgot Password",
            "POST",
            "auth/forgot-password",
            200,
            data={"email": email}
        )
        return success

    def test_phone_send_otp(self, phone="+15551234567"):
        """Test phone OTP send endpoint"""
        success, response = self.run_test(
            "Phone Send OTP",
            "POST",
            "auth/phone/send-otp",
            200,
            data={"phone_number": phone}
        )
        if success:
            print(f"   OTP Status: {response.get('status', 'N/A')}")
            print(f"   Message: {response.get('message', 'N/A')}")
        return success

    def test_phone_verify_otp(self, phone="+15551234567", code="123456"):
        """Test phone OTP verify endpoint"""
        success, response = self.run_test(
            "Phone Verify OTP",
            "POST",
            "auth/phone/verify-otp",
            200,
            data={"phone_number": phone, "code": code}
        )
        if success and 'token' in response:
            print(f"   Phone login successful")
            print(f"   User: {response['user']['name']}")
            return True, response['token']
        return False, None

    def test_google_session_invalid(self):
        """Test Google OAuth session with invalid session ID"""
        success, response = self.run_test(
            "Google OAuth Invalid Session",
            "POST",
            "auth/google/session",
            400,
            data={"session_id": "invalid_session_id"}
        )
        return success

def main():
    print("🚀 Starting Veriqo API Tests")
    print("=" * 50)
    
    # Setup
    tester = VeriqoAPITester()
    
    # Test sequence
    tests = [
        ("Health Check", tester.test_health_check),
        ("User Registration", lambda: tester.test_register()),
        ("Get Current User", tester.test_get_me),
        ("Complete Onboarding", tester.test_complete_onboarding),
        ("Product Analysis", tester.test_analyze_product),
        ("Get Analysis History", tester.test_get_history),
        ("Invalid Amazon URL", tester.test_invalid_amazon_url),
        ("Unauthorized Access", tester.test_unauthorized_access),
        ("Forgot Password", tester.test_forgot_password),
        ("Phone Send OTP", tester.test_phone_send_otp),
        ("Phone Verify OTP", lambda: tester.test_phone_verify_otp()[0]),
        ("Google OAuth Invalid", tester.test_google_session_invalid),
    ]
    
    # Run tests
    for test_name, test_func in tests:
        try:
            result = test_func()
            if isinstance(result, tuple):
                success = result[0]
            else:
                success = result
                
            if not success:
                print(f"⚠️  Test '{test_name}' failed but continuing...")
        except Exception as e:
            print(f"💥 Test '{test_name}' crashed: {str(e)}")
    
    # Test login with existing user
    print(f"\n🔄 Testing login with existing user...")
    if tester.test_login():
        print("✅ Login with existing user successful")
        tester.test_get_me()
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())