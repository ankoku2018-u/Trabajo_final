const form = document.getElementById('loginForm');
const alertBox = document.getElementById('alertBox');
const passwordInput = document.getElementById('password');
const emailInput = document.getElementById('email');
const togglePassword = document.querySelector('.toggle');
const inputGroups = Array.from(form.querySelectorAll('.input-group[data-field]'));

// Toggle password visibility
if (togglePassword) {
  togglePassword.addEventListener('click', () => {
    const isHidden = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isHidden ? 'text' : 'password');
    
    // Update ARIA label for accessibility
    togglePassword.setAttribute(
      'aria-label',
      isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña'
    );
  });

  // Also allow Enter/Space to trigger the toggle
  togglePassword.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePassword.click();
    }
  });
}

// Validation function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Form submission with validation
form.addEventListener('submit', (event) => {
  event.preventDefault();
  let hasError = false;

  // Validate email
  const emailValue = emailInput.value.trim();
  const emailGroup = emailInput.closest('.input-group');
  
  if (!emailValue || !validateEmail(emailValue)) {
    hasError = true;
    emailGroup.classList.add('error');
    emailInput.setAttribute('aria-invalid', 'true');
  } else {
    emailGroup.classList.remove('error');
    emailInput.setAttribute('aria-invalid', 'false');
  }

  // Validate password
  const passwordValue = passwordInput.value.trim();
  const passwordGroup = passwordInput.closest('.input-group');
  
  if (!passwordValue || passwordValue.length < 3) {
    hasError = true;
    passwordGroup.classList.add('error');
    passwordInput.setAttribute('aria-invalid', 'true');
  } else {
    passwordGroup.classList.remove('error');
    passwordInput.setAttribute('aria-invalid', 'false');
  }

  // Show/hide alert
  alertBox.classList.toggle('show', hasError);

  if (!hasError) {
    // Success: Hide alert and prepare for navigation/API call
    alertBox.classList.remove('show');
    
    // Aquí iría la lógica de autenticación real
    console.log('Login attempt:', {
      email: emailValue,
      remember: form.remember.checked
    });
    
    // Simulate successful login - replace with actual API call
    // window.location.href = 'Usuario GESTOR/Menu principal.html';
    
    // For demo, just reset the form
    form.reset();
  } else {
    // Focus on first error field for accessibility
    const firstError = form.querySelector('.input-group.error input');
    if (firstError) {
      firstError.focus();
    }
  }
});

// Remove error styles on input
inputGroups.forEach((group) => {
  const input = group.querySelector('input');
  input.addEventListener('input', () => {
    group.classList.remove('error');
    input.setAttribute('aria-invalid', 'false');
    alertBox.classList.remove('show');
  });

  // Also remove error on focus for better UX
  input.addEventListener('focus', () => {
    if (group.classList.contains('error')) {
      group.classList.remove('error');
      input.setAttribute('aria-invalid', 'false');
    }
  });
});

// Dismiss alert on click
alertBox.addEventListener('click', () => {
  alertBox.classList.remove('show');
});

// Handle "Remember me" with localStorage (optional enhancement)
const rememberCheckbox = form.querySelector('input[name="remember"]');
if (rememberCheckbox) {
  // Load remembered email if exists
  const rememberedEmail = localStorage.getItem('rememberedEmail');
  if (rememberedEmail) {
    emailInput.value = rememberedEmail;
    rememberCheckbox.checked = true;
  }

  // Save email when form is submitted successfully
  form.addEventListener('submit', () => {
    if (rememberCheckbox.checked && !form.querySelector('.input-group.error')) {
      localStorage.setItem('rememberedEmail', emailInput.value);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  });
}
