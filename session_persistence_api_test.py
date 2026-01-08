#!/usr/bin/env python3
"""
Session Persistence Test for Veriqo - Backend API Focus
Tests the backend behavior that supports session persistence
"""

import requests
import json
import sys
import time

class SessionPersistenceAPITest:
    def __init__(self):
        self.api_url = "https://veriqo-check.preview.emergentagent.com/api"
        self.token = None
        self.user_data = None
        
    def login_and_get_token(self):
        """Login and get authentication token"""
        try:
            print("🔑 Logging in to get authentication token...")
            response = requests.post(f"{self.api_url}/auth/login", 
                json={"email": "testuser@example.com", "password": "password123"},
                timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('token')
                self.user_data = data.get('user')
                print(f"   ✅ Login successful")
                print(f"   Token: {self.token[:20]}...")
                print(f"   User: {self.user_data.get('name')} ({self.user_data.get('email')})")
                return True
            else:
                print(f"   ❌ Login failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"   ❌ Login error: {e}")
            return False
    
    def test_token_persistence(self):
        """Test that token remains valid for subsequent requests"""
        if not self.token:
            print("❌ No token available for persistence test")
            return False
            
        print(f"\n🔍 Testing Token Persistence...")
        
        # Test 1: Immediate token validation
        try:
            response = requests.get(f"{self.api_url}/auth/me", 
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=30)
            
            if response.status_code == 200:
                user_data = response.json()
                print(f"   ✅ Token valid immediately after login")
                print(f"   User ID: {user_data.get('id')}")
            else:
                print(f"   ❌ Token invalid immediately after login: {response.status_code}")
                return False
        except Exception as e:
            print(f"   ❌ Token validation error: {e}")
            return False
        
        # Test 2: Token validation after delay (simulating page refresh)
        print(f"   ⏳ Waiting 3 seconds (simulating page refresh)...")
        time.sleep(3)
        
        try:
            response = requests.get(f"{self.api_url}/auth/me", 
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=30)
            
            if response.status_code == 200:
                user_data = response.json()
                print(f"   ✅ Token still valid after delay")
                print(f"   User ID: {user_data.get('id')}")
                return True
            else:
                print(f"   ❌ Token invalid after delay: {response.status_code}")
                return False
        except Exception as e:
            print(f"   ❌ Token validation after delay error: {e}")
            return False
    
    def test_protected_endpoints_access(self):
        """Test access to protected endpoints that /home and /history would use"""
        if not self.token:
            print("❌ No token available for protected endpoints test")
            return False
            
        print(f"\n🔍 Testing Protected Endpoints Access...")
        
        endpoints_to_test = [
            ("User Profile (/auth/me)", "/auth/me", "GET"),
            ("Analysis History (/history)", "/history", "GET"),
        ]
        
        all_passed = True
        
        for endpoint_name, endpoint_path, method in endpoints_to_test:
            try:
                print(f"   📡 Testing {endpoint_name}...")
                
                if method == "GET":
                    response = requests.get(f"{self.api_url}{endpoint_path}", 
                        headers={"Authorization": f"Bearer {self.token}"},
                        timeout=30)
                
                if response.status_code == 200:
                    print(f"      ✅ {endpoint_name} accessible")
                    
                    # Additional validation for specific endpoints
                    if endpoint_path == "/history":
                        data = response.json()
                        if isinstance(data, list):
                            print(f"      ✅ History endpoint returns valid list ({len(data)} items)")
                        else:
                            print(f"      ⚠️  History endpoint returns non-list data")
                            
                elif response.status_code == 401:
                    print(f"      ❌ {endpoint_name} returned 401 Unauthorized")
                    all_passed = False
                else:
                    print(f"      ⚠️  {endpoint_name} returned {response.status_code}")
                    
            except Exception as e:
                print(f"      ❌ {endpoint_name} error: {e}")
                all_passed = False
        
        return all_passed
    
    def test_session_without_token(self):
        """Test that endpoints properly reject requests without token"""
        print(f"\n🔍 Testing Unauthorized Access (No Token)...")
        
        endpoints_to_test = [
            ("User Profile", "/auth/me"),
            ("Analysis History", "/history"),
        ]
        
        all_passed = True
        
        for endpoint_name, endpoint_path in endpoints_to_test:
            try:
                print(f"   📡 Testing {endpoint_name} without token...")
                
                response = requests.get(f"{self.api_url}{endpoint_path}", timeout=30)
                
                if response.status_code == 401:
                    print(f"      ✅ {endpoint_name} properly rejects unauthorized access")
                else:
                    print(f"      ❌ {endpoint_name} should return 401 but returned {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                print(f"      ❌ {endpoint_name} error: {e}")
                all_passed = False
        
        return all_passed
    
    def test_history_page_data_structure(self):
        """Test that history endpoint returns data in the format expected by HistoryPage"""
        if not self.token:
            print("❌ No token available for history data structure test")
            return False
            
        print(f"\n🔍 Testing History Page Data Structure...")
        
        try:
            response = requests.get(f"{self.api_url}/history", 
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ History endpoint accessible")
                print(f"   📊 History items: {len(data)}")
                
                if isinstance(data, list):
                    print(f"   ✅ Returns list as expected by HistoryPage")
                    
                    # Check structure of items if any exist
                    if len(data) > 0:
                        sample_item = data[0]
                        required_fields = ['id', 'product_name', 'verdict', 'confidence_score', 'analyzed_at']
                        missing_fields = [field for field in required_fields if field not in sample_item]
                        
                        if not missing_fields:
                            print(f"   ✅ History items have all required fields")
                        else:
                            print(f"   ⚠️  Missing fields in history items: {missing_fields}")
                            
                        # Check verdict values
                        verdicts = [item.get('verdict', '').upper() for item in data]
                        valid_verdicts = ['BUY', 'THINK', 'AVOID']
                        invalid_verdicts = [v for v in verdicts if v not in valid_verdicts and v != '']
                        
                        if not invalid_verdicts:
                            print(f"   ✅ All verdicts are valid")
                        else:
                            print(f"   ⚠️  Invalid verdicts found: {set(invalid_verdicts)}")
                    else:
                        print(f"   ℹ️  No history items to validate structure")
                    
                    return True
                else:
                    print(f"   ❌ History endpoint should return list but returned {type(data)}")
                    return False
            else:
                print(f"   ❌ History endpoint returned {response.status_code}")
                return False
                
        except Exception as e:
            print(f"   ❌ History data structure test error: {e}")
            return False
    
    def test_csv_export_permissions(self):
        """Test CSV export endpoint permissions"""
        if not self.token:
            print("❌ No token available for CSV export test")
            return False
            
        print(f"\n🔍 Testing CSV Export Permissions...")
        
        try:
            response = requests.get(f"{self.api_url}/history/export", 
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=30)
            
            if response.status_code == 403:
                error_data = response.json()
                if "Premium" in error_data.get('detail', ''):
                    print(f"   ✅ CSV export properly restricted for free users")
                    print(f"   📝 Error message: {error_data.get('detail')}")
                    return True
                else:
                    print(f"   ⚠️  CSV export returned 403 but with unexpected message: {error_data}")
                    return True
            elif response.status_code == 200:
                print(f"   ⚠️  CSV export allowed for free user (unexpected)")
                return False
            else:
                print(f"   ❌ CSV export returned unexpected status: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"   ❌ CSV export test error: {e}")
            return False
    
    def run_all_tests(self):
        """Run all session persistence related tests"""
        print("🚀 Starting Session Persistence API Tests")
        print("=" * 60)
        
        # Login first
        if not self.login_and_get_token():
            return False
        
        # Run tests
        tests = [
            ("Token Persistence", self.test_token_persistence),
            ("Protected Endpoints Access", self.test_protected_endpoints_access),
            ("Unauthorized Access Rejection", self.test_session_without_token),
            ("History Page Data Structure", self.test_history_page_data_structure),
            ("CSV Export Permissions", self.test_csv_export_permissions),
        ]
        
        passed_tests = 0
        total_tests = len(tests)
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed_tests += 1
                    print(f"✅ {test_name} - PASSED")
                else:
                    print(f"❌ {test_name} - FAILED")
            except Exception as e:
                print(f"💥 {test_name} - CRASHED: {e}")
        
        # Results
        print(f"\n" + "=" * 60)
        print(f"📊 Session Persistence API Test Results: {passed_tests}/{total_tests} passed")
        
        if passed_tests == total_tests:
            print("🎉 All session persistence API tests passed!")
            print("✅ Backend properly supports session persistence")
            return True
        else:
            print(f"⚠️  {total_tests - passed_tests} session persistence API tests failed")
            return False

def main():
    tester = SessionPersistenceAPITest()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())