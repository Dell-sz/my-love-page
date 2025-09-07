// Auth module for handling login, register, logout, and token management

// Base API URL - adjust if needed
const API_BASE_URL = 'http://localhost:3000/api'; // Assuming backend runs on port 3000

// Utility function to get JWT token from localStorage
function getToken() {
  return localStorage.getItem('jwtToken');
}

// Utility function to set JWT token in localStorage
function setToken(token) {
  localStorage.setItem('jwtToken', token);
}

// Utility function to remove JWT token
function removeToken() {
  localStorage.removeItem('jwtToken');
}

// Utility function to check if user is logged in
function isLoggedIn() {
  const token = getToken();
  if (!token) return false;
  // Check if token is expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (e) {
    return false;
  }
}

// Utility function to show messages
function showMessage(elementId, message, type = 'error') {
  const messageEl = document.getElementById(elementId);
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.className = type; // Add CSS classes for styling
  }
}

// Login function
async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setToken(data.data.token);
      showMessage('message', 'Login realizado com sucesso!', 'success');
      // Redirect to memories page
      window.location.href = 'memories.html';
    } else {
      showMessage('message', data.message || 'Erro no login');
    }
  } catch (error) {
    console.error('Login error:', error);
    showMessage('message', 'Erro de conexão');
  }
}

// Register function
async function register(name, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setToken(data.data.token);
      showMessage('message', 'Registro realizado com sucesso!', 'success');
      // Redirect to memories page
      window.location.href = 'memories.html';
    } else {
      showMessage('message', data.message || 'Erro no registro');
    }
  } catch (error) {
    console.error('Register error:', error);
    showMessage('message', 'Erro de conexão');
  }
}

// Logout function
function logout() {
  removeToken();
  // Redirect to index
  window.location.href = 'index.html';
}

// Event listeners for forms
document.addEventListener('DOMContentLoaded', () => {
  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      await login(email, password);
    });
  }

  // Register form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      await register(name, email, password);
    });
  }

  // Check if user is logged in on protected pages
  if (window.location.pathname.includes('memories.html') || window.location.pathname.includes('save-memory.html')) {
    if (!isLoggedIn()) {
      window.location.href = 'login.html';
    }
  }

  // Update navigation based on login status
  updateNavigation();
});

// Function to update navigation links
function updateNavigation() {
  const loginLink = document.getElementById('login-link');
  const logoutLink = document.getElementById('logout-link');

  if (isLoggedIn()) {
    if (loginLink) loginLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'inline';
  } else {
    if (loginLink) loginLink.style.display = 'inline';
    if (logoutLink) logoutLink.style.display = 'none';
  }
}

// Export functions for use in other modules
window.Auth = {
  getToken,
  setToken,
  removeToken,
  isLoggedIn,
  login,
  register,
  logout
};
