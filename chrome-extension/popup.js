// Veriqo Chrome Extension - Popup Script

document.addEventListener('DOMContentLoaded', init);

async function init() {
  const status = await getStatus();
  updateUI(status);
  
  // Setup event listeners
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

async function getStatus() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getStatus' }, resolve);
  });
}

function updateUI(status) {
  const guestView = document.getElementById('guest-view');
  const userView = document.getElementById('user-view');
  const checksBadge = document.getElementById('checks-badge');
  const checksCount = document.getElementById('checks-count');
  
  if (status.isLoggedIn) {
    // Show user view
    guestView.classList.add('hidden');
    userView.classList.remove('hidden');
    
    document.getElementById('user-email').textContent = status.userEmail;
    document.getElementById('user-name').textContent = status.userEmail.split('@')[0];
    document.getElementById('user-initial').textContent = status.userEmail[0].toUpperCase();
    document.getElementById('checks-remaining').textContent = '∞';
  } else {
    // Show guest view
    guestView.classList.remove('hidden');
    userView.classList.add('hidden');
    
    // Update checks badge
    const remaining = status.freeChecksRemaining;
    checksCount.textContent = remaining;
    
    if (remaining === 0) {
      checksBadge.className = 'checks-badge empty';
      checksBadge.innerHTML = '0 free checks remaining - <a href="https://veriqo-check.preview.emergentagent.com/register" target="_blank" style="color: inherit; text-decoration: underline;">Sign up</a>';
    } else if (remaining === 1) {
      checksBadge.className = 'checks-badge warning';
    } else {
      checksBadge.className = 'checks-badge';
    }
  }
}

async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const loginBtn = document.getElementById('login-btn');
  const errorMessage = document.getElementById('error-message');
  
  // Disable button
  loginBtn.disabled = true;
  loginBtn.textContent = 'Signing in...';
  errorMessage.classList.add('hidden');
  
  const result = await new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'login', email, password }, resolve);
  });
  
  if (result.success) {
    const status = await getStatus();
    updateUI(status);
  } else {
    errorMessage.textContent = result.error;
    errorMessage.classList.remove('hidden');
  }
  
  // Re-enable button
  loginBtn.disabled = false;
  loginBtn.textContent = 'Sign In';
}

async function handleLogout() {
  await new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'logout' }, resolve);
  });
  
  const status = await getStatus();
  updateUI(status);
}
