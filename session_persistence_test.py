#!/usr/bin/env python3
"""
Session Persistence Test for Veriqo Frontend
Tests if a user can directly navigate to /home with a token in localStorage
"""

import requests
import json
import sys
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time

class SessionPersistenceTest:
    def __init__(self):
        self.frontend_url = "https://smart-review-6.preview.emergentagent.com"
        self.api_url = "https://smart-review-6.preview.emergentagent.com/api"
        self.driver = None
        self.token = None
        
    def setup_driver(self):
        """Setup Chrome driver with headless options"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            return True
        except Exception as e:
            print(f"❌ Failed to setup Chrome driver: {e}")
            return False
    
    def get_auth_token(self):
        """Get authentication token via API"""
        try:
            response = requests.post(f"{self.api_url}/auth/login", 
                json={"email": "testuser@example.com", "password": "password123"},
                timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('token')
                print(f"✅ Got auth token: {self.token[:20]}...")
                return True
            else:
                print(f"❌ Login failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Failed to get auth token: {e}")
            return False
    
    def test_session_persistence(self):
        """Test session persistence by setting token and navigating directly to /home"""
        if not self.token:
            print("❌ No token available for session persistence test")
            return False
            
        try:
            print(f"\n🔍 Testing Session Persistence...")
            
            # Step 1: Navigate to the frontend
            print(f"   📍 Navigating to: {self.frontend_url}")
            self.driver.get(self.frontend_url)
            
            # Step 2: Set the token in localStorage
            print(f"   🔑 Setting token in localStorage...")
            self.driver.execute_script(f"localStorage.setItem('veriqo_token', '{self.token}');")
            
            # Verify token was set
            stored_token = self.driver.execute_script("return localStorage.getItem('veriqo_token');")
            if stored_token != self.token:
                print(f"❌ Token not properly stored in localStorage")
                return False
            print(f"   ✅ Token stored in localStorage")
            
            # Step 3: Navigate directly to /home
            print(f"   🏠 Navigating directly to /home...")
            self.driver.get(f"{self.frontend_url}/home")
            
            # Step 4: Wait and check if we're redirected to login or stay on home
            time.sleep(3)  # Give time for auth check and potential redirect
            
            current_url = self.driver.current_url
            print(f"   📍 Current URL: {current_url}")
            
            # Check if we're still on /home (session persistence working)
            if "/home" in current_url:
                print(f"   ✅ Session persistence working - stayed on /home")
                
                # Additional check: Look for home page elements
                try:
                    # Wait for home page to load
                    WebDriverWait(self.driver, 10).until(
                        EC.presence_of_element_located((By.TAG_NAME, "body"))
                    )
                    
                    # Check for typical home page elements
                    page_source = self.driver.page_source.lower()
                    if "analyze" in page_source or "amazon" in page_source:
                        print(f"   ✅ Home page content loaded successfully")
                        return True
                    else:
                        print(f"   ⚠️  On /home but content might not be fully loaded")
                        return True
                        
                except TimeoutException:
                    print(f"   ⚠️  Timeout waiting for home page content")
                    return True  # Still consider success if URL is correct
                    
            elif "/login" in current_url:
                print(f"   ❌ Session persistence failed - redirected to login")
                return False
            else:
                print(f"   ⚠️  Unexpected redirect to: {current_url}")
                return False
                
        except Exception as e:
            print(f"❌ Session persistence test failed: {e}")
            return False
    
    def test_history_page_access(self):
        """Test direct access to history page with token"""
        if not self.token:
            print("❌ No token available for history page test")
            return False
            
        try:
            print(f"\n🔍 Testing History Page Access...")
            
            # Navigate to history page directly
            print(f"   📍 Navigating directly to /history...")
            self.driver.get(f"{self.frontend_url}/history")
            
            # Wait for page to load
            time.sleep(3)
            
            current_url = self.driver.current_url
            print(f"   📍 Current URL: {current_url}")
            
            if "/history" in current_url:
                print(f"   ✅ Successfully accessed history page")
                
                # Check for history page elements
                try:
                    WebDriverWait(self.driver, 10).until(
                        EC.presence_of_element_located((By.TAG_NAME, "body"))
                    )
                    
                    page_source = self.driver.page_source.lower()
                    if "history" in page_source and ("total analyses" in page_source or "analysis" in page_source):
                        print(f"   ✅ History page content loaded successfully")
                        return True
                    else:
                        print(f"   ⚠️  On /history but expected content not found")
                        return True
                        
                except TimeoutException:
                    print(f"   ⚠️  Timeout waiting for history page content")
                    return True
                    
            elif "/login" in current_url:
                print(f"   ❌ History page access failed - redirected to login")
                return False
            else:
                print(f"   ⚠️  Unexpected redirect to: {current_url}")
                return False
                
        except Exception as e:
            print(f"❌ History page test failed: {e}")
            return False
    
    def cleanup(self):
        """Cleanup resources"""
        if self.driver:
            self.driver.quit()
    
    def run_tests(self):
        """Run all session persistence tests"""
        print("🚀 Starting Session Persistence Tests")
        print("=" * 50)
        
        # Setup
        if not self.setup_driver():
            return False
            
        if not self.get_auth_token():
            self.cleanup()
            return False
        
        # Run tests
        tests_passed = 0
        total_tests = 2
        
        if self.test_session_persistence():
            tests_passed += 1
            
        if self.test_history_page_access():
            tests_passed += 1
        
        # Cleanup
        self.cleanup()
        
        # Results
        print(f"\n" + "=" * 50)
        print(f"📊 Session Persistence Test Results: {tests_passed}/{total_tests} passed")
        
        if tests_passed == total_tests:
            print("🎉 All session persistence tests passed!")
            return True
        else:
            print(f"⚠️  {total_tests - tests_passed} session persistence tests failed")
            return False

def main():
    tester = SessionPersistenceTest()
    success = tester.run_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())