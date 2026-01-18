let currentAction = null;

/* Tabs */
document.querySelectorAll('.tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

/* Modal */
function confirmAction(action) {
  currentAction = action;
  document.getElementById('confirmModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('confirmModal').style.display = 'none';
}

function executeAction() {
  alert(`Acción ejecutada: ${currentAction}`);
  closeModal();
}

/* Datos simulados */
const backups = [
  { fecha: '2026-01-07', tipo: 'Completo', tamaño: '2.4 GB', estado: 'Exitoso' },
  { fecha: '2026-01-06', tipo: 'Completo', tamaño: '2.38 GB', estado: 'Exitoso' }
];

const backupTable = document.getElementById('backupTable');
backups.forEach(b => {
  backupTable.innerHTML += `
    <tr>
      <td>${b.fecha}</td>
      <td>${b.tipo}</td>
      <td>${b.tamaño}</td>
      <td>${b.estado}</td>
    </tr>
  `;
});
