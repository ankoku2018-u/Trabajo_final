// ============================================================
// AUTENTICACIÓN CON BASE DE DATOS
// ============================================================

const form = document.getElementById('loginForm');
const alertBox = document.getElementById('alertBox');
const passwordInput = document.getElementById('password');
const emailInput = document.getElementById('email');
const togglePassword = document.querySelector('.toggle');
const inputGroups = Array.from(form.querySelectorAll('.input-group[data-field]'));
const submitButton = form.querySelector('.submit');

// Obtener URL de la API - local y producción
const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_URL = isLocalhost
  ? 'http://localhost:3000/api'
  : window.location.origin + '/api';

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
    // Success: Hide alert and perform login
    alertBox.classList.remove('show');
    
    // Llamar a la función de autenticación real
    performLogin(emailValue, passwordValue);
  } else {
    // Focus on first error field for accessibility
    const firstError = form.querySelector('.input-group.error input');
    if (firstError) {
      firstError.focus();
    }
    return;
  }

  // Si la validación es correcta, mostrar mensaje de éxito (modo standalone)
  performLoginStandalone(emailValue, passwordValue);
});

// ============================================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================================

// Función para mostrar alerta con el nuevo contenido
function showAlert(mensaje, tipo = 'error') {
  alertBox.classList.remove('success', 'warning');
  alertBox.classList.add(tipo);
  alertBox.querySelector('.alert-content').innerHTML = `
    <h2>${tipo === 'error' ? 'Error de autenticación' : 'Información'}</h2>
    <p>${mensaje}</p>
  `;
  alertBox.classList.add('show');
}

// Función para ocultar alerta
function hideAlert() {
  alertBox.classList.remove('show');
}

// Autenticación con API
async function performLogin(email, password) {
  try {
    // Deshabilitar botón durante la solicitud
    submitButton.disabled = true;
    submitButton.textContent = 'Ingresando...';

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Error en autenticación
      showAlert(data.error || 'Error en la autenticación', 'error');
      submitButton.disabled = false;
      submitButton.textContent = 'Ingresar';
      return;
    }

    // Autenticación exitosa
    hideAlert();
    
    // Guardar datos del usuario en localStorage
    const userData = {
      id: data.data.id,
      nombre: data.data.nombre,
      apellido: data.data.apellido,
      email: data.data.email,
      rol: data.data.rol,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem('usuario', JSON.stringify(userData));

    // Guardar email si "Recordar" está marcado
    if (form.remember.checked) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    // Redirigir según el rol después de 500ms
    setTimeout(() => {
      const rol = data.data.rol.toLowerCase();
      
      if (rol === 'administrador') {
        window.location.href = 'Usuario ADMINISTRDOR/Menu principal Admin.html';
      } else if (rol === 'gestor') {
        window.location.href = 'Usuario GESTOR/Menu principal.html';
      } else if (rol === 'tecnico' || rol === 'técnico') {
        // Redirigir a página de técnico (usar admin por ahora si no existe)
        window.location.href = 'Usuario ADMINISTRDOR/Menu principal Admin.html';
      } else {
        showAlert('Rol de usuario no reconocido: ' + data.data.rol, 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'Ingresar';
      }
    }, 500);

  } catch (error) {
    console.error('Error en login:', error);
    showAlert('Error al conectar con el servidor. Intenta más tarde.', 'error');
    submitButton.disabled = false;
    submitButton.textContent = 'Ingresar';
  }
}

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

// Handle "Remember me" with localStorage
const rememberCheckbox = form.querySelector('input[name="remember"]');
if (rememberCheckbox) {
  // Load remembered email if exists
  const rememberedEmail = localStorage.getItem('rememberedEmail');
  if (rememberedEmail) {
    emailInput.value = rememberedEmail;
    rememberCheckbox.checked = true;
  }
}
