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
            # Verify response structure
            if isinstance(response, list):
                for item in response[:3]:  # Check first 3 items
                    required_fields = ['id', 'product_name', 'verdict', 'confidence_score', 'analyzed_at']
                    missing_fields = [field for field in required_fields if field not in item]
                    if missing_fields:
                        print(f"   ⚠️  Missing fields in history item: {missing_fields}")
                        return False
                print(f"   ✅ History response structure is valid")
            return True
        return False

    def test_csv_export_free_user(self):
        """Test CSV export endpoint for free user (should return 403)"""
        success, response = self.run_test(
            "CSV Export (Free User - Should Fail)",
            "GET",
            "history/export",
            403
        )
        return success

    def test_csv_export_premium_user(self):
        """Test CSV export endpoint for premium user"""
        # First upgrade user to premium for testing
        print(f"\n🔧 Temporarily upgrading user to premium for CSV export test...")
        
        # This is a test helper - in real scenario, user would pay
        # We'll simulate premium status by directly calling the endpoint
        success, response = self.run_test(
            "CSV Export (Premium User)",
            "GET", 
            "history/export",
            200  # Should work for premium users
        )
        return success

    def test_session_persistence_simulation(self):
        """Test session persistence by verifying token validation"""
        if not self.token:
            print("❌ No token available for session persistence test")
            return False
            
        print(f"\n🔍 Testing Session Persistence...")
        print(f"   Token: {self.token[:20]}...")
        
        # Test 1: Verify token works with /auth/me
        success, response = self.run_test(
            "Session Persistence - Token Validation",
            "GET",
            "auth/me", 
            200
        )
        
        if success:
            print(f"   ✅ Token is valid and returns user data")
            print(f"   User ID: {response.get('id', 'N/A')}")
            print(f"   Email: {response.get('email', 'N/A')}")
            return True
        else:
            print(f"   ❌ Token validation failed")
            return False

    def test_product_analysis_integration(self):
        """Test complete product analysis flow"""
        amazon_url = "https://www.amazon.com/dp/B09V3KXJPB"
        
        print(f"\n🔍 Testing Product Analysis Integration...")
        print(f"   URL: {amazon_url}")
        
        success, response = self.run_test(
            "Product Analysis Integration",
            "POST",
            "analyze",
            200,
            data={"amazon_url": amazon_url}
        )
        
        if success:
            self.analysis_id = response.get('id')
            print(f"   ✅ Analysis completed successfully")
            print(f"   Analysis ID: {self.analysis_id}")
            print(f"   Product: {response.get('product_name', 'N/A')}")
            print(f"   Verdict: {response.get('verdict', 'N/A')}")
            print(f"   Score: {response.get('confidence_score', 'N/A')}")
            
            # Wait a moment for the analysis to be saved
            time.sleep(2)
            
            # Now verify it appears in history
            print(f"\n🔍 Verifying analysis appears in history...")
            history_success, history_response = self.run_test(
                "Verify Analysis in History",
                "GET",
                "history",
                200
            )
            
            if history_success and isinstance(history_response, list):
                # Look for our analysis in the history
                found_analysis = None
                for item in history_response:
                    if item.get('id') == self.analysis_id:
                        found_analysis = item
                        break
                
                if found_analysis:
                    print(f"   ✅ Analysis found in history")
                    print(f"   Product in history: {found_analysis.get('product_name', 'N/A')}")
                    return True
                else:
                    print(f"   ❌ Analysis not found in history")
                    return False
            else:
                print(f"   ❌ Failed to fetch history for verification")
                return False
        
        return False

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

    # ==================== NEW WISHLIST TESTS ====================
    
    def test_get_empty_wishlist(self):
        """Test getting empty wishlist"""
        success, response = self.run_test(
            "Get Empty Wishlist",
            "GET",
            "wishlist",
            200
        )
        if success:
            print(f"   Wishlist items: {len(response)}")
            return True
        return False

    def test_add_to_wishlist(self):
        """Test adding product to wishlist"""
        success, response = self.run_test(
            "Add to Wishlist",
            "POST",
            "wishlist",
            200,
            data={
                "product_url": "https://www.amazon.com/dp/B08N5WRWNW",
                "product_name": "Apple AirTag",
                "product_image": "https://example.com/image.jpg",
                "notes": "Test wishlist item"
            }
        )
        if success:
            print(f"   Added item ID: {response.get('id', 'N/A')}")
            print(f"   Product: {response.get('product_name', 'N/A')}")
            return True, response.get('id')
        return False, None

    def test_get_wishlist_with_items(self):
        """Test getting wishlist with items"""
        success, response = self.run_test(
            "Get Wishlist with Items",
            "GET",
            "wishlist",
            200
        )
        if success:
            print(f"   Wishlist items: {len(response)}")
            if len(response) > 0:
                item = response[0]
                required_fields = ['id', 'user_id', 'product_url', 'product_name', 'added_at']
                missing_fields = [field for field in required_fields if field not in item]
                if missing_fields:
                    print(f"   ⚠️  Missing fields in wishlist item: {missing_fields}")
                    return False
                print(f"   ✅ Wishlist response structure is valid")
            return True
        return False

    def test_remove_from_wishlist(self, item_id):
        """Test removing product from wishlist"""
        if not item_id:
            print("   ⚠️  No item ID provided for removal test")
            return False
            
        success, response = self.run_test(
            "Remove from Wishlist",
            "DELETE",
            f"wishlist/{item_id}",
            200
        )
        if success:
            print(f"   Removed item: {item_id}")
            return True
        return False

    def test_add_duplicate_to_wishlist(self):
        """Test adding duplicate product to wishlist (should fail)"""
        success, response = self.run_test(
            "Add Duplicate to Wishlist",
            "POST",
            "wishlist",
            400,
            data={
                "product_url": "https://www.amazon.com/dp/B08N5WRWNW",
                "product_name": "Apple AirTag Duplicate",
                "notes": "This should fail"
            }
        )
        return success

    # ==================== NEW COMPARISON TESTS ====================
    
    def test_compare_products_valid(self):
        """Test comparing 2 valid Amazon products"""
        success, response = self.run_test(
            "Compare Products (Valid)",
            "POST",
            "compare",
            200,
            data={
                "product_urls": [
                    "https://www.amazon.com/dp/B08N5WRWNW",
                    "https://www.amazon.com/dp/B09V3KXJPB"
                ]
            }
        )
        if success:
            print(f"   Products compared: {len(response.get('products', []))}")
            print(f"   Winner: {response.get('winner', {}).get('product_name', 'N/A')}")
            
            # Verify response structure
            required_fields = ['products', 'comparison_summary', 'winner']
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                print(f"   ⚠️  Missing fields in comparison response: {missing_fields}")
                return False
            
            # Check products structure
            products = response.get('products', [])
            if len(products) >= 2:
                for i, product in enumerate(products[:2]):
                    if 'error' not in product:
                        product_fields = ['id', 'product_name', 'verdict', 'confidence_score']
                        missing_product_fields = [field for field in product_fields if field not in product]
                        if missing_product_fields:
                            print(f"   ⚠️  Missing fields in product {i+1}: {missing_product_fields}")
                            return False
                print(f"   ✅ Comparison response structure is valid")
            return True
        return False

    def test_compare_products_insufficient(self):
        """Test comparing with insufficient URLs (should fail)"""
        success, response = self.run_test(
            "Compare Products (Insufficient URLs)",
            "POST",
            "compare",
            400,
            data={
                "product_urls": ["https://www.amazon.com/dp/B08N5WRWNW"]
            }
        )
        return success

    def test_compare_products_too_many(self):
        """Test comparing with too many URLs (should fail)"""
        success, response = self.run_test(
            "Compare Products (Too Many URLs)",
            "POST",
            "compare",
            400,
            data={
                "product_urls": [
                    "https://www.amazon.com/dp/B08N5WRWNW",
                    "https://www.amazon.com/dp/B09V3KXJPB",
                    "https://www.amazon.com/dp/B08N5WRWNW",
                    "https://www.amazon.com/dp/B09V3KXJPB"
                ]
            }
        )
        return success

def main():
    print("🚀 Starting Veriqo API Tests - Focus on Session Persistence & History")
    print("=" * 70)
    
    # Setup
    tester = VeriqoAPITester()
    
    # Test with the specific credentials from review request
    test_email = "testuser@example.com"
    test_password = "password123"
    
    print(f"📧 Using test credentials: {test_email}")
    
    # Core test sequence focusing on review requirements
    tests = [
        ("Health Check", tester.test_health_check),
        ("Login with Test User", lambda: tester.test_login(test_email, test_password)),
        ("Session Persistence Test", tester.test_session_persistence_simulation),
        ("Get Current User", tester.test_get_me),
        ("Get Analysis History", tester.test_get_history),
        ("CSV Export (Free User)", tester.test_csv_export_free_user),
        ("Product Analysis Integration", tester.test_product_analysis_integration),
    ]
    
    # Run tests
    failed_tests = []
    for test_name, test_func in tests:
        try:
            print(f"\n{'='*50}")
            result = test_func()
            if isinstance(result, tuple):
                success = result[0]
            else:
                success = result
                
            if not success:
                failed_tests.append(test_name)
                print(f"⚠️  Test '{test_name}' failed")
            else:
                print(f"✅ Test '{test_name}' passed")
        except Exception as e:
            failed_tests.append(test_name)
            print(f"💥 Test '{test_name}' crashed: {str(e)}")
    
    # Additional tests for completeness
    print(f"\n{'='*50}")
    print("🔄 Running additional validation tests...")
    
    additional_tests = [
        ("Invalid Amazon URL", tester.test_invalid_amazon_url),
        ("Unauthorized Access", tester.test_unauthorized_access),
    ]
    
    for test_name, test_func in additional_tests:
        try:
            result = test_func()
            if isinstance(result, tuple):
                success = result[0]
            else:
                success = result
                
            if not success:
                failed_tests.append(test_name)
                print(f"⚠️  Additional test '{test_name}' failed")
        except Exception as e:
            failed_tests.append(test_name)
            print(f"💥 Additional test '{test_name}' crashed: {str(e)}")
    
    # Print results
    print("\n" + "=" * 70)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if failed_tests:
        print(f"\n❌ Failed Tests ({len(failed_tests)}):")
        for test in failed_tests:
            print(f"   • {test}")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())