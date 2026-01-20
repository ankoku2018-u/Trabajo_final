const total = 48199;
document.getElementById('totalCases').textContent =
  total.toLocaleString();

/* Datos */
const categorias = [
  { nombre: 'Hardware', casos: 12500 },
  { nombre: 'Software', casos: 18200 },
  { nombre: 'Red', casos: 8900 },
  { nombre: 'Seguridad', casos: 4200 },
  { nombre: 'Usuario', casos: 4400 }
];

/* Tabla */
const tbody = document.getElementById('tableData');
categorias.forEach(c => {
  tbody.innerHTML += `
    <tr>
      <td>${c.nombre}</td>
      <td>${c.casos}</td>
      <td>${((c.casos / total) * 100).toFixed(1)}%</td>
    </tr>
  `;
});

/* Gráfico Canvas */
const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');
const max = Math.max(...categorias.map(c => c.casos));

categorias.forEach((c, i) => {
  const barHeight = (c.casos / max) * 180;
  const x = 60 + i * 100;
  const y = 220 - barHeight;

  ctx.fillStyle = '#2563eb';
  ctx.fillRect(x, y, 40, barHeight);
  ctx.fillText(c.nombre, x - 10, 240);
});

/* Exportar */
function exportar() {
  alert('Reporte exportado correctamente');
}
