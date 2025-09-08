# Debug Instructions for 401 Unauthorized Error

## Problem

The application is returning 401 Unauthorized errors when trying to save memories, even after successful login.

## Debugging Steps

### 1. Test Login Process

1. Open `test-login.html` in your browser
2. Open Developer Tools (F12) and go to Console tab
3. Try to login with valid credentials
4. Check the console logs for:
   - "Login successful, token received: Present"
   - "Token stored, keepLoggedIn: true/false"
   - "Auth.getToken(): Token found"

### 2. Check Token Storage

After login, in the browser console, run:

```javascript
// Check localStorage
console.log('localStorage token:', localStorage.getItem('authToken'));

// Check sessionStorage
console.log('sessionStorage token:', sessionStorage.getItem('authToken'));

// Check if Auth module can retrieve token
console.log('Auth.getToken():', window.Auth.getToken());
```

### 3. Test API Request Headers

1. Go to the memories page after login
2. Open Network tab in Developer Tools
3. Try to save a memory
4. Check the request headers for the POST /api/memories request
5. Look for the "Authorization: Bearer `token`" header

### 4. Check Backend Response

1. Make sure the backend is running on <http://localhost:5000>
2. Test the backend directly:

   ```bash
   curl -X GET http://localhost:5000/api/memories
   ```

   Should return: `{"success":false,"message":"Not authorized to access this route"}`

### 5. Common Issues to Check

#### Issue 1: Token not being stored

- Check if `data.data.token` exists in login response
- Verify the token is being stored in the correct storage (localStorage vs sessionStorage)

#### Issue 2: Token not being sent in API requests

- Check if `getAuthHeaders()` is returning the correct headers
- Verify the Authorization header format: `Bearer <token>`

#### Issue 3: Backend token validation

- Ensure backend expects "Bearer <token>" format
- Check if JWT secret matches between frontend and backend

#### Issue 4: Token expiration

- Check if token has expired (JWT exp claim)
- Verify token validity in jwt.io

### 6. Manual Testing Commands

```javascript
// Test token retrieval
window.Auth.getToken()

// Test if user is logged in
window.Auth.isLoggedIn()

// Test user name extraction
window.Auth.getUserName()

// Test API headers
getAuthHeaders()
```

### 7. Expected Console Logs

After successful login, you should see:

```
Auth.getToken(): Token found
Login successful, token received: Present
Token stored, keepLoggedIn: true/false
getAuthHeaders(): {Authorization: "Bearer eyJ..."}
```

### 8. Next Steps

If the issue persists after checking these points:

1. Verify the backend JWT secret matches what's used to generate tokens
2. Check if the backend expects the token in a different format
3. Ensure the frontend and backend are using the same API base URL
4. Check for CORS issues if running on different ports

Please run these tests and share the console output so I can help identify the root cause.
