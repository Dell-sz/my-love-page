// Auth module for JWT authentication
// Handles login, register, logout, token storage, and protected page checks

const Auth = {
  // API base URL (adjust if needed)
  API_BASE_URL: 'http://localhost:5000/api',

  // Get stored token
  getToken() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    console.log('Auth.getToken():', token ? 'Token found' : 'No token found');
    return token;
  },

  // Store token
  setToken(token, keepLoggedIn = false) {
    if (keepLoggedIn) {
      localStorage.setItem('authToken', token);
    } else {
      sessionStorage.setItem('authToken', token);
    }
  },

  // Remove token
  removeToken() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  },

  // Check if user is logged in
  isLoggedIn() {
    const token = this.getToken();
    if (!token) return false;

    // Optional: Check if token is expired (if JWT has exp claim)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (e) {
      return true; // If can't parse, assume valid
    }
  },

  // Login function
  async login(email, password, keepLoggedIn = false) {
    try {
      // Example request: POST /api/auth/login
      // Body: { email, password }
      // Response: { success: true, data: { user: { id, name, email }, token: "jwt_token" } }
      const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('Login successful, token received:', data.data.token ? 'Present' : 'Missing');
        this.setToken(data.data.token, keepLoggedIn);
        console.log('Token stored, keepLoggedIn:', keepLoggedIn);
        return { success: true, user: data.data.user };
      } else {
        console.log('Login failed:', data.message);
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Connection error' };
    }
  },

  // Register function
  async register(name, email, password, keepLoggedIn = false) {
    try {
      // Example request: POST /api/auth/register
      // Body: { name, email, password }
      // Response: { success: true, data: { user: { id, name, email }, token: "jwt_token" } }
      const response = await fetch(`${this.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.setToken(data.data.token, keepLoggedIn);
        return { success: true, user: data.data.user };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Connection error' };
    }
  },

  // Get user name from token
  getUserName() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.name || null;
    } catch (e) {
      return null;
    }
  },

  // Logout function
  logout() {
    this.removeToken();
    window.location.href = 'landing.html';
  }
};

// Make Auth available globally
window.Auth = Auth;

// Check authentication on protected pages
document.addEventListener('DOMContentLoaded', () => {
  // Protected pages that require authentication
  const protectedPages = ['index.html', 'memories.html', 'save-memory.html', 'preferences.html'];
  const currentPath = window.location.pathname;

  // Check if current page is protected
  const isProtectedPage = protectedPages.some(page => currentPath.includes(page));

  if (isProtectedPage && !Auth.isLoggedIn()) {
    // Redirect to login if not authenticated
    window.location.href = 'login.html';
  }

  // Redirect authenticated users away from login/register pages
  const authPages = ['login.html', 'register.html'];
  const isAuthPage = authPages.some(page => currentPath.includes(page));

  if (isAuthPage && Auth.isLoggedIn()) {
    // Redirect to memories page if already logged in
    window.location.href = 'memories.html';
  }

  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const keepLoggedIn = document.getElementById('keep-logged-in').checked;
      const messageDiv = document.getElementById('message');

      if (!email || !password) {
        messageDiv.textContent = 'Por favor, preencha todos os campos.';
        messageDiv.className = 'error';
        return;
      }

      messageDiv.textContent = 'Fazendo login...';
      messageDiv.className = '';

      const result = await Auth.login(email, password, keepLoggedIn);

      if (result.success) {
        messageDiv.textContent = 'Login bem-sucedido! Redirecionando...';
        messageDiv.className = 'success';
        setTimeout(() => {
          window.location.href = 'memories.html';
        }, 1000);
      } else {
        messageDiv.textContent = result.message;
        messageDiv.className = 'error';
      }
    });
  }

  // Register form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const keepLoggedIn = document.getElementById('keep-logged-in').checked;
      const messageDiv = document.getElementById('message');

      if (!name || !email || !password) {
        messageDiv.textContent = 'Por favor, preencha todos os campos.';
        messageDiv.className = 'error';
        return;
      }

      messageDiv.textContent = 'Registrando...';
      messageDiv.className = '';

      const result = await Auth.register(name, email, password, keepLoggedIn);

      if (result.success) {
        messageDiv.textContent = 'Registro bem-sucedido! Redirecionando...';
        messageDiv.className = 'success';
        setTimeout(() => {
          window.location.href = 'memories.html';
        }, 1000);
      } else {
        messageDiv.textContent = result.message;
        messageDiv.className = 'error';
      }
    });
  }

  // Update navigation based on auth status
  const loginLink = document.getElementById('login-link');
  const logoutLink = document.getElementById('logout-link');
  const userInfo = document.getElementById('user-info');
  const userName = document.getElementById('user-name');

  if (loginLink && logoutLink) {
    if (Auth.isLoggedIn()) {
      loginLink.style.display = 'none';
      logoutLink.style.display = 'inline';

      // Show user info if available
      if (userInfo && userName) {
        const name = Auth.getUserName();
        if (name) {
          userName.textContent = name;
          userInfo.style.display = 'inline';
        }
      }
    } else {
      loginLink.style.display = 'inline';
      logoutLink.style.display = 'none';
      if (userInfo) {
        userInfo.style.display = 'none';
      }
    }
  }
});
