const usuarios = [
  { id: 18294, nombre: 'María González', email: 'mgonzalez@colsof.com.co', rol: 'Gestor', estado: 'Activo', ultimo: '2026-01-19 14:30' },
  { id: 18295, nombre: 'Devon Lane', email: 'd.lane@colsof.com.co', rol: 'Técnico', estado: 'Activo', ultimo: '2026-01-19 13:45' },
  { id: 18296, nombre: 'Carlos Méndez', email: 'cmendez@colsof.com.co', rol: 'Técnico', estado: 'Activo', ultimo: '2026-01-19 15:10' },
  { id: 18297, nombre: 'Ana Rodríguez', email: 'arodriguez@colsof.com.co', rol: 'Empleado', estado: 'Inactivo', ultimo: '2026-01-10 09:20' },
  { id: 18298, nombre: 'Pedro Sánchez', email: 'psanchez@colsof.com.co', rol: 'Administrador', estado: 'Activo', ultimo: '2026-01-19 15:50' }
];

const tabla = document.getElementById('tablaUsuarios');
const search = document.getElementById('search');
const filterRole = document.getElementById('filterRole');
const filterStatus = document.getElementById('filterStatus');

const roleMap = {
  Administrador: 'role-admin',
  Gestor: 'role-gestor',
  'Técnico': 'role-tecnico',
  Empleado: 'role-empleado'
};

const statusMap = {
  Activo: 'status-active',
  Inactivo: 'status-inactive'
};

function setKPIs() {
  document.getElementById('total').textContent = usuarios.length;
  document.getElementById('activos').textContent = usuarios.filter(u => u.estado === 'Activo').length;
  document.getElementById('inactivos').textContent = usuarios.filter(u => u.estado === 'Inactivo').length;
  document.getElementById('tecnicos').textContent = usuarios.filter(u => u.rol === 'Técnico').length;
}

function getFiltered() {
  const term = search.value.toLowerCase();
  return usuarios.filter(u => (
    u.nombre.toLowerCase().includes(term) ||
    u.email.toLowerCase().includes(term) ||
    u.id.toString().includes(term)
  ) &&
  (filterRole.value === 'todos' || u.rol === filterRole.value) &&
  (filterStatus.value === 'todos' || u.estado === filterStatus.value));
}

function render() {
  const filtrados = getFiltered();
  tabla.innerHTML = '';

  if (!filtrados.length) {
    tabla.innerHTML = '<tr><td class="empty-row" colspan="6">No se encontraron usuarios con los filtros aplicados.</td></tr>';
    return;
  }

  filtrados.forEach(u => {
    const roleClass = roleMap[u.rol] || 'role-neutral';
    const statusClass = statusMap[u.estado] || 'status-neutral';

    tabla.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${u.id}</td>
        <td class="user-name">${u.nombre}</td>
        <td class="user-email">${u.email}</td>
        <td><span class="role-pill ${roleClass}"><span class="pill-dot"></span>${u.rol}</span></td>
        <td><span class="status-pill ${statusClass}"><span class="pill-dot"></span>${u.estado}</span></td>
        <td>${u.ultimo}</td>
      </tr>
    `);
  });
}

search.oninput = render;
filterRole.onchange = render;
filterStatus.onchange = render;

function exportar() {
  const filtrados = getFiltered();
  if (!filtrados.length) {
    alert('No hay usuarios para exportar con los filtros actuales.');
    return;
  }

  const header = ['ID', 'Usuario', 'Email', 'Rol', 'Estado', 'Ultimo acceso'];
  const rows = filtrados.map(u => [u.id, u.nombre, u.email, u.rol, u.estado, u.ultimo]);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'usuarios.csv';
  a.click();
  URL.revokeObjectURL(url);
}

setKPIs();
render();
