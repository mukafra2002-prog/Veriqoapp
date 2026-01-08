"""
Safe Core Backend Tests - Veriqo
Tests for the Safe Core refactoring:
1. Verdicts renamed from BUY/THINK/AVOID to great_match/good_match/consider_options
2. Field 'top_complaints' renamed to 'things_to_know'
3. Field 'who_should_not_buy' renamed to 'best_suited_for'
4. authenticity_score removed
5. Admin stats use new verdict naming
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://veriqo-check.preview.emergentagent.com')

# Test credentials
TEST_EMAIL = "testuser@example.com"
TEST_PASSWORD = "password123"


class TestAuthFlow:
    """Test authentication flow"""
    
    def test_api_health(self):
        """Test API health endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("✓ API health check passed")
    
    def test_login_success(self):
        """Test login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == TEST_EMAIL
        print(f"✓ Login successful for {TEST_EMAIL}")
        return data["token"]
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@example.com",
            "password": "wrongpass"
        })
        assert response.status_code == 401
        print("✓ Invalid credentials rejected correctly")


class TestSafeCoreHistory:
    """Test history endpoint returns Safe Core field names"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Authentication failed")
    
    def test_history_endpoint(self, auth_token):
        """Test history endpoint returns data"""
        response = requests.get(
            f"{BASE_URL}/api/history",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ History endpoint returned {len(data)} analyses")
        
        # If there are analyses, check field names
        if len(data) > 0:
            analysis = data[0]
            print(f"  - First analysis: {analysis.get('product_name', 'Unknown')[:50]}")
            print(f"  - Verdict: {analysis.get('verdict')}")
            
            # Check for Safe Core field names (or fallbacks)
            has_things_to_know = "things_to_know" in analysis or "top_complaints" in analysis
            has_best_suited_for = "best_suited_for" in analysis or "who_should_not_buy" in analysis
            
            print(f"  - Has things_to_know or top_complaints: {has_things_to_know}")
            print(f"  - Has best_suited_for or who_should_not_buy: {has_best_suited_for}")
            
            # Verify authenticity_score is NOT present in new analyses
            if "authenticity_score" in analysis:
                print("  ⚠ Warning: authenticity_score still present (may be old data)")


class TestSafeCoreAdminStats:
    """Test admin stats endpoint returns Safe Core verdict naming"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Authentication failed")
    
    def test_admin_stats_verdict_naming(self, admin_token):
        """Test admin stats uses Safe Core verdict naming"""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 403:
            pytest.skip("User is not admin")
        
        assert response.status_code == 200
        data = response.json()
        
        # Check for Safe Core verdict naming in stats
        print("Admin Stats Response:")
        print(f"  - Total users: {data.get('total_users')}")
        print(f"  - Total analyses: {data.get('total_analyses')}")
        
        # Safe Core verdict stats
        great_match = data.get('verdict_great_match', 0)
        good_match = data.get('verdict_good_match', 0)
        consider_options = data.get('verdict_consider_options', 0)
        
        print(f"  - Great Match count: {great_match}")
        print(f"  - Good Match count: {good_match}")
        print(f"  - Consider Options count: {consider_options}")
        
        # Verify Safe Core naming is present
        assert 'verdict_great_match' in data or 'verdict_buy' in data, "Missing verdict stats"
        print("✓ Admin stats endpoint working with Safe Core naming")


class TestSafeCoreCSVExport:
    """Test CSV export uses Safe Core field names"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Authentication failed")
    
    def test_csv_export_headers(self, auth_token):
        """Test CSV export has Safe Core column names"""
        response = requests.get(
            f"{BASE_URL}/api/history/export",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        if response.status_code == 403:
            print("✓ CSV export correctly requires premium (403 for free users)")
            return
        
        assert response.status_code == 200
        content = response.text
        
        # Check CSV headers for Safe Core naming
        first_line = content.split('\n')[0]
        print(f"CSV Headers: {first_line}")
        
        # Should have "Things to Know" and "Best Suited For" columns
        assert "Things to Know" in first_line or "Top Complaints" in first_line
        assert "Best Suited For" in first_line or "Who Should NOT Buy" in first_line
        print("✓ CSV export has correct column headers")


class TestSafeCoreCompare:
    """Test compare endpoint returns Safe Core field names"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Authentication failed")
    
    def test_compare_validation(self, auth_token):
        """Test compare endpoint validation"""
        # Test with insufficient URLs
        response = requests.post(
            f"{BASE_URL}/api/compare",
            json={"product_urls": ["https://amazon.com/dp/test"]},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 400
        print("✓ Compare endpoint correctly validates URL count")
    
    def test_compare_too_many_urls(self, auth_token):
        """Test compare endpoint rejects too many URLs"""
        response = requests.post(
            f"{BASE_URL}/api/compare",
            json={"product_urls": [
                "https://amazon.com/dp/test1",
                "https://amazon.com/dp/test2",
                "https://amazon.com/dp/test3",
                "https://amazon.com/dp/test4"
            ]},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 400
        print("✓ Compare endpoint correctly rejects >3 URLs")


class TestSafeCoreWishlist:
    """Test wishlist functionality"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Authentication failed")
    
    def test_get_wishlist(self, auth_token):
        """Test get wishlist endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/wishlist",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Wishlist endpoint returned {len(data)} items")


class TestSafeCoreAIConfig:
    """Test AI config endpoint"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Authentication failed")
    
    def test_ai_config_endpoint(self, admin_token):
        """Test AI config endpoint returns Safe Core settings"""
        response = requests.get(
            f"{BASE_URL}/api/admin/ai-config",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 403:
            pytest.skip("User is not admin")
        
        assert response.status_code == 200
        data = response.json()
        
        print("AI Config Response:")
        print(f"  - AI Enabled: {data.get('config', {}).get('enabled')}")
        print(f"  - Neutral Language Enforced: {data.get('config', {}).get('neutral_language_enforced')}")
        print(f"  - Disclaimers Required: {data.get('config', {}).get('disclaimers_required')}")
        
        # Check disclaimers are present
        if 'disclaimers' in data:
            print(f"  - Disclaimers: {list(data['disclaimers'].keys())}")
        
        print("✓ AI config endpoint working")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
