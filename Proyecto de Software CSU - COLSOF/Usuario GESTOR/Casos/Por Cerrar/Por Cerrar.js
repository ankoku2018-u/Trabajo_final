let selectedCase = null;

const cases = [
  { id:'#40123789', title:'Instalación completa de Office 365', client:'ECOPETROL', technician:'Juan Pérez', priority:'Alta', pendingDays:1, completed:'08 Ene 2025', resolution:'Office instalado y configurado', attachments:['Acta_Entrega.pdf'], reason:'Pendiente validación cliente' },
  { id:'#40123456', title:'Reparación servidor principal', client:'BANCO AGRARIO', technician:'Dianne Russell', priority:'Urgente', pendingDays:1, completed:'08 Ene 2025', resolution:'Fuente reemplazada', attachments:['Informe_Tecnico.pdf'], reason:'Pendiente firma acta' },
  { id:'#39987654', title:'Configuración firewall', client:'QUALA SA', technician:'Juan Pérez', priority:'Alta', pendingDays:2, completed:'07 Ene 2025', resolution:'Firewall configurado', attachments:['Firewall.pdf'], reason:'Pendiente aprobación' }
];

function daysClass(d) {
  if (d >= 3) return 'red';
  if (d >= 2) return 'orange';
  return 'yellow';
}

function render() {
  const list = document.getElementById('casesList');
  list.innerHTML = '';

  document.getElementById('totalPending').textContent = cases.length;
  document.getElementById('kpiTotal').textContent = cases.length;
  document.getElementById('kpiUrgent').textContent = cases.filter(c => c.pendingDays === 1).length;
  document.getElementById('kpiSoon').textContent = cases.filter(c => c.pendingDays === 2).length;
  document.getElementById('kpiLate').textContent = cases.filter(c => c.pendingDays >= 3).length;

  cases.forEach(c => {
    list.innerHTML += `
      <div class="case">
        <div class="case-header">
          <div>
            <strong>${c.id}</strong>
            <span class="badge priority-${c.priority}">${c.priority}</span>
          </div>
          <span class="days ${daysClass(c.pendingDays)}">Hace ${c.pendingDays} día(s)</span>
        </div>
        <h3>${c.title}</h3>
        <p><strong>Cliente:</strong> ${c.client}</p>
        <p><strong>Técnico:</strong> ${c.technician}</p>
        <p>${c.resolution}</p>
        <div class="attachments">
          ${c.attachments.map(a => `<span>${a}</span>`).join('')}
        </div>
        <div class="actions">
          <button class="view" onclick="openModal('${c.id}')">Ver</button>
          <button class="reject" onclick="reject('${c.id}')">Rechazar</button>
          <button class="approve" onclick="approve('${c.id}')">Aprobar</button>
        </div>
      </div>
    `;
  });
}

function openModal(id) {
  selectedCase = cases.find(c => c.id === id);
  document.getElementById('modalId').textContent = selectedCase.id;
  document.getElementById('modalBody').innerHTML = `
    <p><strong>${selectedCase.title}</strong></p>
    <p>${selectedCase.resolution}</p>
    <p><em>${selectedCase.reason}</em></p>
  `;
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

function approve(id) {
  alert(`Caso ${id} aprobado y cerrado`);
}

function reject(id) {
  alert(`Caso ${id} rechazado y devuelto`);
}

function approveCase() {
  approve(selectedCase.id);
  closeModal();
}

function rejectCase() {
  reject(selectedCase.id);
  closeModal();
}

render();
