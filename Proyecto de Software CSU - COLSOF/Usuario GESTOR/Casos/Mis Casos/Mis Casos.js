let filterStatus = 'all';

const cases = [
  { id:'#30459366', title:'Problema con impresora HP LaserJet', client:'COLSOF SAS', category:'HARDWARE', priority:'Alta', status:'En Progreso', created:'06 Ene 2025, 09:30', updated:'Hace 2 horas', description:'La impresora no responde...', notes:3, attachments:2, assignedBy:'María Rodríguez', deadline:'08 Ene 2025' },
  { id:'#39374065', title:'Instalación de software contable', client:'QUALA SA', category:'SOFTWARE', priority:'Media', status:'Pendiente', created:'06 Ene 2025, 11:15', updated:'Hace 4 horas', description:'Instalación en 5 estaciones', notes:1, attachments:1, assignedBy:'Carlos Mendoza', deadline:'10 Ene 2025' },
  { id:'#3903712064', title:'Error en base de datos Oracle', client:'ECOPETROL', category:'SOFTWARE', priority:'Urgente', status:'En Progreso', created:'05 Ene 2025, 14:20', updated:'Hace 30 min', description:'Errores de conexión', notes:8, attachments:4, assignedBy:'Diana López', deadline:'06 Ene 2025' },
  { id:'#301916063', title:'Mantenimiento servidores', client:'BANCO AGRARIO', category:'MANTENIMIENTO', priority:'Baja', status:'Programado', created:'04 Ene 2025, 16:45', updated:'Hace 1 día', description:'Mantenimiento mensual', notes:0, attachments:1, assignedBy:'Roberto Castro', deadline:'15 Ene 2025' },
  { id:'#356894061', title:'Actualización antivirus', client:'IDIGER', category:'SOFTWARE', priority:'Alta', status:'Completado', created:'02 Ene 2025, 08:30', updated:'Hace 2 días', description:'Actualización McAfee', notes:4, attachments:2, assignedBy:'Jorge Silva', deadline:'05 Ene 2025' }
];

function render() {
  const list = document.getElementById('casesList');
  list.innerHTML = '';

  const filtered = filterStatus === 'all'
    ? cases
    : cases.filter(c => c.status === filterStatus);

  document.getElementById('totalCases').textContent = cases.length;
  document.getElementById('inProgress').textContent = cases.filter(c => c.status === 'En Progreso').length;
  document.getElementById('pending').textContent = cases.filter(c => c.status === 'Pendiente').length;
  document.getElementById('completed').textContent = cases.filter(c => c.status === 'Completado').length;
  document.getElementById('activeCases').textContent =
    cases.filter(c => c.status !== 'Completado').length + ' casos activos';

  filtered.forEach(c => {
    list.innerHTML += `
      <div class="case" onclick="openModal('${c.id}')">
        <span class="badge priority-${c.priority}">${c.priority}</span>
        <strong>${c.id}</strong>
        <h3>${c.title}</h3>
        <p>${c.description}</p>
        <small>${c.client} • Vence ${c.deadline}</small>
      </div>
    `;
  });
}

function setFilter(status) {
  filterStatus = status;
  render();
}

function openModal(id) {
  const c = cases.find(x => x.id === id);
  document.getElementById('modalId').textContent = c.id;
  document.getElementById('modalTitle').textContent = c.title;
  document.getElementById('modalBody').innerHTML = `
    <p><strong>Cliente:</strong> ${c.client}</p>
    <p><strong>Categoría:</strong> ${c.category}</p>
    <p><strong>Prioridad:</strong> ${c.priority}</p>
    <p><strong>Estado:</strong> ${c.status}</p>
    <p><strong>Asignado por:</strong> ${c.assignedBy}</p>
    <p><strong>Descripción:</strong></p>
    <p>${c.description}</p>
  `;
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

render();
