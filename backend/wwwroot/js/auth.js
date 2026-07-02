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

// Handle Registration (Disabled for Demo)
function handleRegister(e) {
  e.preventDefault();
  
  showError('register-error', 'Kayıtlar geçici olarak durdurulmuştur.');
  Utils.showToast('Kayıt işlemleri demo sürecinde kapalıdır.', 'error');
}

// Handle Login
async function handleLogin(e) {
  e.preventDefault();
  
  const usernameInput = document.getElementById('login-username').value.trim();
  const passwordInput = document.getElementById('login-password').value;
  
  if (!usernameInput || !passwordInput) {
    showError('login-error', 'Lütfen kullanıcı adı ve şifrenizi girin.');
    return;
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Giriş Yapılıyor...';
  }

  try {
    const response = await fetch('/Account/Login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: usernameInput, password: passwordInput })
    });

    let data;
    try {
      data = await response.json();
    } catch(err) {
      data = { success: false, message: 'Hatalı Şifre' };
    }

    if (!response.ok || !data.success) {
      showError('login-error', data.message || 'Hatalı Şifre');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Giriş Yap';
      }
      return;
    }

    loginUser(data.user);
  } catch (error) {
    showError('login-error', 'Hatalı Şifre');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Giriş Yap';
    }
  }
}

// Login active user
function loginUser(user) {
  const activeSession = {
    id: user.id,
    username: user.username,
    initial: user.initial || user.username.charAt(0).toUpperCase(),
    role: user.role
  };
  
  localStorage.setItem('aniverse_currentUser', JSON.stringify(activeSession));
  localStorage.setItem('userRole', user.role);
  localStorage.setItem('isLoggedIn', 'true');
  
  Utils.showToast(`Hoş geldin, ${user.username}!`, 'success');
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 800);
}

// Logout active user
async function logoutUser() {
  try {
    await fetch('/Account/Logout', { method: 'POST' });
  } catch(e) {}
  localStorage.removeItem('aniverse_currentUser');
  localStorage.removeItem('userRole');
  localStorage.removeItem('isLoggedIn');
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
