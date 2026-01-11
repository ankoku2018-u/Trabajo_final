let selectedTechnician = 'all';
let selectedCase = null;

const technicians = [
  { id: 'all', name: 'Todos', avatar: '👥', activeCount: 8 },
  { id: 1, name: 'Juan Pérez', avatar: 'JP', activeCount: 8 },
  { id: 2, name: 'Dianne Russell', avatar: 'DR', activeCount: 6 },
  { id: 3, name: 'Jane Cooper', avatar: 'JC', activeCount: 5 },
  { id: 4, name: 'Robert Fox', avatar: 'RF', activeCount: 4 },
  { id: 5, name: 'Cody Fisher', avatar: 'CF', activeCount: 3 }
];

const cases = [
  { id:'#40234567', title:'Instalación ERP', technician:'Juan Pérez', technicianId:1, client:'ECOPETROL', category:'SOFTWARE', priority:'Alta', status:'En Progreso', deadline:'12 Ene 2025', description:'Instalación SAP' },
  { id:'#40234568', title:'Reparación impresora', technician:'Juan Pérez', technicianId:1, client:'BANCO AGRARIO', category:'HARDWARE', priority:'Media', status:'Pendiente', deadline:'10 Ene 2025', description:'Atasco papel' },
  { id:'#40234569', title:'Switches', technician:'Dianne Russell', technicianId:2, client:'QUALA', category:'REDES', priority:'Urgente', status:'En Progreso', deadline:'09 Ene 2025', description:'VLANs' }
];

function render() {
  document.getElementById('totalCases').textContent = cases.length;

  const techDiv = document.getElementById('technicians');
  techDiv.innerHTML = '';

  technicians.forEach(t => {
    const div = document.createElement('div');
    div.className = `tech ${selectedTechnician === t.id ? 'active' : ''}`;
    div.onclick = () => { selectedTechnician = t.id; render(); };
    div.innerHTML = `<strong>${t.avatar}</strong><p>${t.name}</p><p>${t.activeCount}</p>`;
    techDiv.appendChild(div);
  });

  const filtered = selectedTechnician === 'all'
    ? cases
    : cases.filter(c => c.technicianId === selectedTechnician);

  document.getElementById('kpiProgress').textContent = filtered.filter(c => c.status === 'En Progreso').length;
  document.getElementById('kpiPending').textContent = filtered.filter(c => c.status === 'Pendiente').length;
  document.getElementById('kpiUrgent').textContent = filtered.filter(c => c.priority === 'Urgente').length;
  document.getElementById('kpiScheduled').textContent = filtered.filter(c => c.status === 'Programado').length;

  const tbody = document.getElementById('casesTable');
  tbody.innerHTML = '';

  filtered.forEach(c => {
    tbody.innerHTML += `
      <tr>
        <td><strong>${c.id}</strong><br>${c.title}</td>
        <td>${c.technician}</td>
        <td>${c.client}</td>
        <td>${c.category}</td>
        <td><span class="badge priority-${c.priority}">${c.priority}</span></td>
        <td><span class="badge status-${c.status.replace(' ','')}">${c.status}</span></td>
        <td>${c.deadline}</td>
        <td class="actions">
          <button onclick="openModal('${c.id}')">👁</button>
        </td>
      </tr>
    `;
  });
}

function openModal(id) {
  selectedCase = cases.find(c => c.id === id);
  document.getElementById('modalId').textContent = selectedCase.id;
  document.getElementById('modalBody').innerHTML = `
    <p><strong>${selectedCase.title}</strong></p>
    <p>${selectedCase.description}</p>
  `;
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

function reassign() {
  alert(`Reasignando caso ${selectedCase.id}`);
}

render();
