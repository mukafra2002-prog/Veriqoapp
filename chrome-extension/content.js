// Veriqo Chrome Extension - Content Script
// Runs on Amazon product pages

(function() {
  'use strict';

  // Check if we're on a product page
  function isProductPage() {
    return window.location.pathname.includes('/dp/') || 
           window.location.pathname.includes('/gp/product/');
  }

  // Extract ASIN from URL
  function getASIN() {
    const match = window.location.pathname.match(/\/dp\/([A-Z0-9]{10})/i) ||
                  window.location.pathname.match(/\/gp\/product\/([A-Z0-9]{10})/i);
    return match ? match[1] : null;
  }

  // Get product URL
  function getProductURL() {
    const asin = getASIN();
    if (asin) {
      return `https://www.amazon.com/dp/${asin}`;
    }
    return window.location.href;
  }

  // Create and inject the Veriqo badge
  function createVeriqoBadge() {
    // Remove existing badge if present
    const existing = document.getElementById('veriqo-badge');
    if (existing) existing.remove();

    const badge = document.createElement('div');
    badge.id = 'veriqo-badge';
    badge.innerHTML = `
      <div class="veriqo-badge-content">
        <div class="veriqo-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="veriqo-text">Analyze with Veriqo</span>
        <div class="veriqo-loader" style="display: none;">
          <div class="veriqo-spinner"></div>
        </div>
      </div>
    `;

    badge.addEventListener('click', handleBadgeClick);
    document.body.appendChild(badge);

    // Check for cached analysis
    checkCachedAnalysis();
  }

  // Check if we have a cached analysis for this product
  async function checkCachedAnalysis() {
    const asin = getASIN();
    if (!asin) return;

    chrome.runtime.sendMessage({ action: 'getCachedAnalysis', asin }, (cached) => {
      if (cached) {
        showAnalysisResult(cached);
      }
    });
  }

  // Handle badge click
  async function handleBadgeClick() {
    const badge = document.getElementById('veriqo-badge');
    const loader = badge.querySelector('.veriqo-loader');
    const text = badge.querySelector('.veriqo-text');
    
    // Show loading state
    text.style.display = 'none';
    loader.style.display = 'block';
    badge.classList.add('loading');

    const url = getProductURL();
    const asin = getASIN();

    chrome.runtime.sendMessage({ 
      action: 'analyzeProduct', 
      url, 
      asin 
    }, (response) => {
      loader.style.display = 'none';
      badge.classList.remove('loading');

      if (response.success) {
        showAnalysisResult(response.analysis);
      } else if (response.error === 'FREE_LIMIT_REACHED') {
        showSignupPrompt();
      } else {
        showError(response.error || 'Analysis failed');
      }
    });
  }

  // Show analysis result
  function showAnalysisResult(analysis) {
    const badge = document.getElementById('veriqo-badge');
    
    // Normalize verdict
    const verdictMap = {
      'buy': 'great_match', 'BUY': 'great_match', 'great_match': 'great_match',
      'think': 'good_match', 'THINK': 'good_match', 'good_match': 'good_match',
      'avoid': 'consider_options', 'AVOID': 'consider_options', 'consider_options': 'consider_options'
    };
    const verdict = verdictMap[analysis.verdict] || 'good_match';
    
    const verdictConfig = {
      'great_match': { label: 'Great Match', color: '#10B981', icon: '✓' },
      'good_match': { label: 'Good Match', color: '#F59E0B', icon: '!' },
      'consider_options': { label: 'Consider Options', color: '#6366F1', icon: '?' }
    };
    
    const config = verdictConfig[verdict];
    
    badge.innerHTML = `
      <div class="veriqo-result" style="border-color: ${config.color}20;">
        <div class="veriqo-result-header">
          <div class="veriqo-logo" style="color: ${config.color};">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="veriqo-brand">Veriqo</span>
          <button class="veriqo-close" onclick="document.getElementById('veriqo-badge').remove()">×</button>
        </div>
        <div class="veriqo-verdict" style="background: ${config.color}15; border-color: ${config.color}40;">
          <span class="veriqo-verdict-icon" style="background: ${config.color};">${config.icon}</span>
          <span class="veriqo-verdict-label" style="color: ${config.color};">${config.label}</span>
          <span class="veriqo-score">${analysis.confidence_score}%</span>
        </div>
        <div class="veriqo-summary">${analysis.summary?.slice(0, 150) || 'Product analyzed successfully.'}...</div>
        <div class="veriqo-things-to-know">
          <div class="veriqo-section-title">Things to Know</div>
          ${(analysis.things_to_know || analysis.top_complaints || []).slice(0, 2).map(item => `
            <div class="veriqo-item">• ${item.title}</div>
          `).join('')}
        </div>
        <a href="https://veriqo-check.preview.emergentagent.com/results/${analysis.id}" target="_blank" class="veriqo-full-report">
          View Full Report →
        </a>
      </div>
    `;
    
    badge.classList.add('expanded');
  }

  // Show signup prompt
  function showSignupPrompt() {
    const badge = document.getElementById('veriqo-badge');
    
    badge.innerHTML = `
      <div class="veriqo-result veriqo-signup">
        <div class="veriqo-result-header">
          <div class="veriqo-logo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="veriqo-brand">Veriqo</span>
          <button class="veriqo-close" onclick="document.getElementById('veriqo-badge').remove()">×</button>
        </div>
        <div class="veriqo-signup-content">
          <div class="veriqo-signup-icon">🔒</div>
          <div class="veriqo-signup-title">Free Checks Used</div>
          <div class="veriqo-signup-text">You've used all 3 free checks. Sign up for unlimited product insights!</div>
          <a href="https://veriqo-check.preview.emergentagent.com/register" target="_blank" class="veriqo-signup-btn">
            Sign Up Free
          </a>
          <a href="https://veriqo-check.preview.emergentagent.com/login" target="_blank" class="veriqo-login-link">
            Already have an account? Log in
          </a>
        </div>
      </div>
    `;
    
    badge.classList.add('expanded');
  }

  // Show error
  function showError(message) {
    const badge = document.getElementById('veriqo-badge');
    const text = badge.querySelector('.veriqo-text');
    
    if (text) {
      text.textContent = 'Error - Click to retry';
      text.style.display = 'block';
      text.style.color = '#EF4444';
    }
    
    setTimeout(() => {
      if (text) {
        text.textContent = 'Analyze with Veriqo';
        text.style.color = '';
      }
    }, 3000);
  }

  // Initialize
  function init() {
    if (isProductPage()) {
      // Wait for page to fully load
      if (document.readyState === 'complete') {
        createVeriqoBadge();
      } else {
        window.addEventListener('load', createVeriqoBadge);
      }
    }
  }

  // Watch for URL changes (Amazon uses SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      if (isProductPage()) {
        setTimeout(createVeriqoBadge, 500);
      } else {
        const badge = document.getElementById('veriqo-badge');
        if (badge) badge.remove();
      }
    }
  }).observe(document, { subtree: true, childList: true });

  init();
})();
