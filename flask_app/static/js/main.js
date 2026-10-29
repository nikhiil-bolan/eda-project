/**
 * EVision Enterprise Platform - Main JavaScript Controller
 * Enterprise UX for Tata / Google Style Smart EV Infrastructure Portal
 */

// ==========================================
// 1. THEME SWITCHER (Light <-> Dark)
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem('ev_theme') || 'light';
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  const html = document.documentElement;
  const body = document.body;
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  if (theme === 'dark') {
    html.classList.add('dark');
    html.classList.remove('light');
    body.classList.add('theme-dark');
    body.classList.remove('theme-light');
    if (themeIcon) themeIcon.textContent = '☀️';
    if (themeLabel) themeLabel.textContent = 'Light';
  } else {
    html.classList.remove('dark');
    html.classList.add('light');
    body.classList.remove('theme-dark');
    body.classList.add('theme-light');
    if (themeIcon) themeIcon.textContent = '🌙';
    if (themeLabel) themeLabel.textContent = 'Dark';
  }
  localStorage.setItem('ev_theme', theme);
  if (typeof renderBICharts === 'function') {
    try { renderBICharts(); } catch (err) {}
  }
  if (typeof renderEDACharts === 'function') {
    try { renderEDACharts(); } catch (err) {}
  }
}

function toggleTheme() {
  const currentTheme = localStorage.getItem('ev_theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
}

// ==========================================
// 2. LIVE GPS LOCATION CAPTURE
// ==========================================
function detectLiveGPS() {
  const locationText = document.getElementById('locationText');
  if (locationText) {
    locationText.textContent = 'Detecting GPS...';
  }

  if (!navigator.geolocation) {
    showNotification('Geolocation is not supported by your browser.', 'error');
    if (locationText) locationText.textContent = 'Mumbai, MH (Default)';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      sessionStorage.setItem('userLat', lat);
      sessionStorage.setItem('userLon', lon);
      
      // Determine nearest city or display coordinates
      let cityLabel = `GPS: ${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
      // Check proximity to key metropolitan hubs
      if (Math.abs(lat - 19.0760) < 0.5 && Math.abs(lon - 72.8777) < 0.5) cityLabel = 'Mumbai, MH (Live)';
      else if (Math.abs(lat - 28.6139) < 0.5 && Math.abs(lon - 77.2090) < 0.5) cityLabel = 'New Delhi (Live)';
      else if (Math.abs(lat - 12.9716) < 0.5 && Math.abs(lon - 77.5946) < 0.5) cityLabel = 'Bengaluru, KA (Live)';
      else if (Math.abs(lat - 18.5204) < 0.5 && Math.abs(lon - 73.8567) < 0.5) cityLabel = 'Pune, MH (Live)';
      else if (Math.abs(lat - 17.3850) < 0.5 && Math.abs(lon - 78.4867) < 0.5) cityLabel = 'Hyderabad, TS (Live)';
      else if (Math.abs(lat - 13.0827) < 0.5 && Math.abs(lon - 80.2707) < 0.5) cityLabel = 'Chennai, TN (Live)';

      if (locationText) locationText.textContent = cityLabel;
      showNotification(`Live Location Acquired: ${cityLabel}`, 'success');

      // If on stations page, reload with coordinates to sort by distance
      if (window.location.pathname === '/stations' && !window.location.search.includes('lat=')) {
        window.location.href = `/stations?lat=${lat}&lon=${lon}`;
      }
    },
    (error) => {
      console.warn('GPS location access denied or timed out:', error.message);
      if (locationText) locationText.textContent = 'Mumbai, MH (HQ)';
      showNotification('Using Metropolitan Default (Mumbai, MH). Click to enable GPS.', 'info');
    },
    { timeout: 10000, enableHighAccuracy: true }
  );
}

// ==========================================
// 3. USER AUTHENTICATION & PORTAL ACCESS
// ==========================================
function checkAuthStatus() {
  const user = JSON.parse(localStorage.getItem('ev_user') || 'null');
  const authNav = document.getElementById('authNavContainer');
  const authModal = document.getElementById('authModal');

  if (user) {
    if (authNav) {
      authNav.innerHTML = `
        <div class="user-profile-badge" title="${user.email}">
          <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
          <span class="user-name">${user.name.split(' ')[0]}</span>
          <button class="btn-logout" onclick="logoutUser()" title="Sign Out">✕</button>
        </div>
      `;
    }
    if (authModal) authModal.style.display = 'none';
  } else {
    if (authNav) {
      authNav.innerHTML = `
        <button class="pill-btn auth-pill" onclick="openAuthModal('login')">Sign In</button>
      `;
    }
    // Check if this is first visit and prompt sign in modal
    const hasSeenPrompt = sessionStorage.getItem('hasSeenAuthPrompt');
    if (!hasSeenPrompt && authModal) {
      sessionStorage.setItem('hasSeenAuthPrompt', 'true');
      setTimeout(() => {
        openAuthModal('signup');
      }, 800);
    }
  }
}

function openAuthModal(mode) {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  modal.style.display = 'flex';
  switchAuthTab(mode);
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.style.display = 'none';
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');

  if (tab === 'login') {
    if (loginForm) loginForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
    if (tabLogin) tabLogin.classList.add('active');
    if (tabSignup) tabSignup.classList.remove('active');
  } else {
    if (loginForm) loginForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'block';
    if (tabLogin) tabLogin.classList.remove('active');
    if (tabSignup) tabSignup.classList.add('active');
  }
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const user = {
    name: name || 'Enterprise Fleet Driver',
    email: email,
    vehicle: 'Tata Nexon EV Max',
    role: 'Enterprise Member',
    token: 'jwt_mock_token_' + Date.now()
  };

  localStorage.setItem('ev_user', JSON.stringify(user));
  closeAuthModal();
  checkAuthStatus();
  showNotification(`Welcome back, ${user.name}! Access unlocked.`, 'success');
  detectLiveGPS();
}

function handleSignupSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const vehicle = document.getElementById('signupVehicle').value || 'Tata Nexon EV Max';

  const user = {
    name: name,
    email: email,
    vehicle: vehicle,
    role: 'Enterprise Member',
    token: 'jwt_mock_token_' + Date.now()
  };

  localStorage.setItem('ev_user', JSON.stringify(user));
  closeAuthModal();
  checkAuthStatus();
  showNotification(`Account created! Live charging portal unlocked for ${name}.`, 'success');
  detectLiveGPS();
}

function logoutUser() {
  localStorage.removeItem('ev_user');
  checkAuthStatus();
  showNotification('Signed out securely.', 'info');
}

// ==========================================
// 4. NOTIFICATION TOAST SYSTEM
// ==========================================
function showNotification(msg, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ'}</span>
    <span class="toast-msg">${msg}</span>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================
// 5. INITIALIZATION ON DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  checkAuthStatus();
  
  // Auto-detect GPS if not yet set in session
  if (!sessionStorage.getItem('userLat')) {
    detectLiveGPS();
  } else {
    const locationText = document.getElementById('locationText');
    const lat = parseFloat(sessionStorage.getItem('userLat'));
    const lon = parseFloat(sessionStorage.getItem('userLon'));
    if (locationText && !isNaN(lat)) {
      if (Math.abs(lat - 19.0760) < 0.5) locationText.textContent = 'Mumbai, MH (Live)';
      else if (Math.abs(lat - 28.6139) < 0.5) locationText.textContent = 'New Delhi (Live)';
      else if (Math.abs(lat - 12.9716) < 0.5) locationText.textContent = 'Bengaluru, KA (Live)';
      else locationText.textContent = `Live: ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    }
  }
});

