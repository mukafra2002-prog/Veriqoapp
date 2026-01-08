// Veriqo Chrome Extension - Background Service Worker
const API_URL = 'https://smart-review-6.preview.emergentagent.com/api';
const FREE_CHECKS_LIMIT = 3;

// Initialize extension storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    freeChecksUsed: 0,
    userToken: null,
    userEmail: null,
    analysisCache: {}
  });
  console.log('Veriqo extension installed');
});

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeProduct') {
    handleAnalyzeProduct(request.url, request.asin).then(sendResponse);
    return true; // Keep channel open for async response
  }
  
  if (request.action === 'getStatus') {
    handleGetStatus().then(sendResponse);
    return true;
  }
  
  if (request.action === 'login') {
    handleLogin(request.email, request.password).then(sendResponse);
    return true;
  }
  
  if (request.action === 'logout') {
    handleLogout().then(sendResponse);
    return true;
  }
  
  if (request.action === 'getCachedAnalysis') {
    handleGetCachedAnalysis(request.asin).then(sendResponse);
    return true;
  }
});

async function handleGetStatus() {
  const data = await chrome.storage.local.get(['freeChecksUsed', 'userToken', 'userEmail']);
  return {
    freeChecksUsed: data.freeChecksUsed || 0,
    freeChecksRemaining: FREE_CHECKS_LIMIT - (data.freeChecksUsed || 0),
    isLoggedIn: !!data.userToken,
    userEmail: data.userEmail
  };
}

async function handleLogin(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.detail || 'Login failed' };
    }
    
    const data = await response.json();
    await chrome.storage.local.set({
      userToken: data.token,
      userEmail: data.user.email,
      userName: data.user.name,
      checksRemaining: data.user.checks_remaining
    });
    
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

async function handleLogout() {
  await chrome.storage.local.set({
    userToken: null,
    userEmail: null,
    userName: null
  });
  return { success: true };
}

async function handleGetCachedAnalysis(asin) {
  const data = await chrome.storage.local.get(['analysisCache']);
  const cache = data.analysisCache || {};
  return cache[asin] || null;
}

async function handleAnalyzeProduct(url, asin) {
  try {
    // Check cache first
    const cacheData = await chrome.storage.local.get(['analysisCache']);
    const cache = cacheData.analysisCache || {};
    if (cache[asin]) {
      return { success: true, analysis: cache[asin], fromCache: true };
    }
    
    // Get current status
    const storageData = await chrome.storage.local.get(['freeChecksUsed', 'userToken']);
    const freeChecksUsed = storageData.freeChecksUsed || 0;
    const userToken = storageData.userToken;
    
    // Check if user can analyze
    if (!userToken && freeChecksUsed >= FREE_CHECKS_LIMIT) {
      return { 
        success: false, 
        error: 'FREE_LIMIT_REACHED',
        message: 'You\'ve used all 3 free checks. Sign up for unlimited access!'
      };
    }
    
    // Make API request
    const headers = { 'Content-Type': 'application/json' };
    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    }
    
    // Use extension-specific endpoint for non-logged-in users
    const endpoint = userToken ? '/analyze' : '/extension/analyze';
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ amazon_url: url })
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.detail || 'Analysis failed' };
    }
    
    const analysis = await response.json();
    
    // Cache the result
    cache[asin] = analysis;
    await chrome.storage.local.set({ analysisCache: cache });
    
    // Increment free checks if not logged in
    if (!userToken) {
      await chrome.storage.local.set({ freeChecksUsed: freeChecksUsed + 1 });
    }
    
    return { success: true, analysis };
  } catch (error) {
    console.error('Analysis error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}
