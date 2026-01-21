const estadisticas = {
  sesionesActivas: 4,
  totalAcciones: 172,
  casosGestionados: 23,
  tiempoPromedio: '4h 32m'
};

const usuarios = [
  { nombre: 'María González', rol: 'Gestor', estado: 'En línea', acciones: 45 },
  { nombre: 'Devon Lane', rol: 'Técnico', estado: 'En línea', acciones: 32 },
  { nombre: 'Carlos Méndez', rol: 'Técnico', estado: 'Ausente', acciones: 28 },
  { nombre: 'Pedro Sánchez', rol: 'Administrador', estado: 'En línea', acciones: 67 }
];

const actividad = [
  'María González asignó caso C-10245',
  'Pedro Sánchez modificó permisos',
  'Devon Lane completó caso C-10242',
  'Carlos Méndez adjuntó evidencia',
  'Pedro Sánchez generó reporte'
];

const ubicaciones = [
  { ciudad: 'Bogotá', porcentaje: 45 },
  { ciudad: 'Medellín', porcentaje: 27 },
  { ciudad: 'Cali', porcentaje: 18 },
  { ciudad: 'Barranquilla', porcentaje: 10 }
];

const timelineDatos = [
  '15:45 - María González asignó 3 casos nuevos',
  '15:30 - Pedro Sánchez modificó configuración',
  '15:15 - Devon Lane completó caso C-10242',
  '15:00 - Carlos Méndez cambió estado a Ausente',
  '14:45 - 4 usuarios conectados simultáneamente'
];

function setKPIs() {
  document.getElementById('sesiones').textContent = estadisticas.sesionesActivas;
  document.getElementById('acciones').textContent = estadisticas.totalAcciones;
  document.getElementById('casos').textContent = estadisticas.casosGestionados;
  document.getElementById('tiempo').textContent = estadisticas.tiempoPromedio;
}

function renderUsuarios() {
  const cont = document.getElementById('usuariosActivos');
  cont.innerHTML = '';
  usuarios.forEach(u => {
    const statusClass = u.estado === 'En línea' ? 'status-online' : 'status-away';
    cont.insertAdjacentHTML('beforeend', `
      <div class="user-card">
        <div class="user-meta">
          <div class="user-name">${u.nombre}</div>
          <div class="user-role">${u.rol}</div>
        </div>
        <div class="user-actions">
          <span class="status-pill ${statusClass}"><span class="status-dot"></span>${u.estado}</span>
          <div>${u.acciones} acciones hoy</div>
        </div>
      </div>
    `);
  });
}

function renderActividad() {
  const cont = document.getElementById('actividad');
  cont.innerHTML = '';
  actividad.forEach(item => {
    cont.insertAdjacentHTML('beforeend', `<div class="activity-item">${item}</div>`);
  });
}

function renderUbicaciones() {
  const cont = document.getElementById('ubicaciones');
  cont.innerHTML = '';
  ubicaciones.forEach(u => {
    cont.insertAdjacentHTML('beforeend', `
      <div class="location-row">
        <div class="location-top"><span>${u.ciudad}</span><span>${u.porcentaje}%</span></div>
        <div class="progress"><div class="progress-fill" style="width:${u.porcentaje}%"></div></div>
      </div>
    `);
  });
}

function renderTimeline() {
  const cont = document.getElementById('timeline');
  cont.innerHTML = '';
  timelineDatos.forEach(item => cont.insertAdjacentHTML('beforeend', `<li>${item}</li>`));
}

function bindRefresh() {
  const btn = document.getElementById('btnRefresh');
  if (btn) btn.addEventListener('click', () => alert('Datos actualizados'));
}

setKPIs();
renderUsuarios();
renderActividad();
renderUbicaciones();
renderTimeline();
bindRefresh();
