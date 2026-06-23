/* ======================================================
   AniVerse – Authentication Logic (LocalStorage DB)
   ====================================================== */

// Toggle between Login and Register forms
function toggleAuth(type) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const btnLogin = document.getElementById('btn-login');
  const btnRegister = document.getElementById('btn-register');

  // Reset errors
  document.getElementById('login-error').style.display = 'none';
  document.getElementById('register-error').style.display = 'none';

  if (type === 'login') {
    loginForm.classList.add('active-form');
    registerForm.classList.remove('active-form');
    btnLogin.classList.add('active');
    btnRegister.classList.remove('active');
  } else {
    registerForm.classList.add('active-form');
    loginForm.classList.remove('active-form');
    btnRegister.classList.add('active');
    btnLogin.classList.remove('active');
  }
}

// Show Error Message
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.style.display = 'block';
}

// Initialize "Database"
function getUsers() {
  const users = localStorage.getItem('aniverse_users');
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem('aniverse_users', JSON.stringify(users));
}

// Handle Registration
function handleRegister(e) {
  e.preventDefault();
  
  const usernameInput = document.getElementById('reg-username').value.trim();
  const passwordInput = document.getElementById('reg-password').value;
  const confirmPasswordInput = document.getElementById('reg-password-confirm').value;
  
  // Validation
  if (passwordInput !== confirmPasswordInput) {
    showError('register-error', 'Şifreler eşleşmiyor!');
    return;
  }
  
  const users = getUsers();
  
  // Check if username is taken (Case insensitive)
  const isTaken = users.some(u => u.username.toLowerCase() === usernameInput.toLowerCase());
  
  if (isTaken) {
    showError('register-error', 'Bu kullanıcı adı zaten alınmış!');
    return;
  }
  
  // Create User
  const newUser = {
    id: Date.now(),
    username: usernameInput,
    password: passwordInput, // Plain text ONLY because this is a client-side demo
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  
  // Login directly
  loginUser(newUser);
}

// Handle Login
function handleLogin(e) {
  e.preventDefault();
  
  const usernameInput = document.getElementById('login-username').value.trim();
  const passwordInput = document.getElementById('login-password').value;
  
  const users = getUsers();
  
  const user = users.find(u => 
    u.username.toLowerCase() === usernameInput.toLowerCase() && 
    u.password === passwordInput
  );
  
  if (user) {
    loginUser(user);
  } else {
    showError('login-error', 'Kullanıcı adı veya şifre hatalı!');
  }
}

// Login active user
function loginUser(user) {
  // Strip password before saving to active session
  const activeSession = {
    id: user.id,
    username: user.username,
    initial: user.username.charAt(0).toUpperCase()
  };
  
  localStorage.setItem('aniverse_currentUser', JSON.stringify(activeSession));
  
  Utils.showToast(`Hoş geldin, ${user.username}!`, 'success');
  
  // Redirect to home page
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// Logout active user (to be called from components.js)
function logoutUser() {
  localStorage.removeItem('aniverse_currentUser');
  window.location.href = 'index.html';
}

// Provide Auth object globally
window.Auth = {
  logout: logoutUser,
  getCurrentUser: () => {
    const user = localStorage.getItem('aniverse_currentUser');
    return user ? JSON.parse(user) : null;
  }
};
