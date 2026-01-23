// Configuración de la API
const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/Usuario%20GESTOR/api.php';
  }
  return window.location.pathname.includes('estadisticas') ? '../api.php' : 'api.php';
};

// Paleta de colores
const palette = {
  primary: '#15467b',
  accent: '#0b3a66',
  success: '#16a34a',
  muted: '#97a0aa'
};

// Variables globales para los gráficos
let monthlyChart, categoryChart, priorityChart, hourChart;

// Función para cargar todas las estadísticas
async function cargarEstadisticas() {
  try {
    const response = await fetch(getApiUrl() + '?action=get_estadisticas_avanzadas');
    const data = await response.json();
    
    // Actualizar KPIs
    actualizarKPIs(data.kpis);
    
    // Actualizar gráficos
    actualizarGraficoMensual(data.casos_por_mes);
    actualizarGraficoCategoria(data.por_categoria);
    actualizarGraficoPrioridad(data.por_prioridad);
    actualizarGraficoHora(data.por_hora);
    
    // Actualizar tabla de técnicos
    actualizarTablaTecnicos(data.tecnicos);
    
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
    // Mostrar valores por defecto en caso de error
    document.getElementById('kpi-total').textContent = '0';
    document.getElementById('kpi-resolucion').textContent = '0%';
    document.getElementById('kpi-tiempo').textContent = '0h';
    document.getElementById('kpi-satisfaccion').textContent = '0%';
  }
}

// Actualizar KPIs
function actualizarKPIs(kpis) {
  document.getElementById('kpi-total').textContent = kpis.total_casos.toLocaleString('es-CO');
  document.getElementById('kpi-resolucion').textContent = kpis.tasa_resolucion + '%';
  document.getElementById('kpi-tiempo').textContent = kpis.tiempo_promedio + 'h';
  document.getElementById('kpi-satisfaccion').textContent = kpis.satisfaccion + '%';
  
  // Actualizar tendencias (placeholder - se puede calcular comparando con mes anterior)
  const trendTotal = document.getElementById('kpi-total-trend');
  trendTotal.innerHTML = '<span class="negative">▾ <small>Datos del mes actual</small></span>';
  
  const trendRes = document.getElementById('kpi-resolucion-trend');
  trendRes.innerHTML = '<span class="positive">▴ <small>Tasa actual</small></span>';
  
  const trendTiempo = document.getElementById('kpi-tiempo-trend');
  trendTiempo.innerHTML = '<span class="positive">▴ <small>Promedio actual</small></span>';
  
  const trendSat = document.getElementById('kpi-satisfaccion-trend');
  trendSat.innerHTML = '<span class="positive">▴ <small>Nivel actual</small></span>';
}

// Actualizar gráfico mensual
function actualizarGraficoMensual(datosMensuales) {
  const ctx = document.getElementById('monthlyChart');
  if (!ctx) return;
  
  const labels = datosMensuales.map(d => d.mes);
  const totales = datosMensuales.map(d => d.total);
  const resueltos = datosMensuales.map(d => d.resueltos);
  const pendientes = datosMensuales.map(d => d.pendientes);
  
  if (monthlyChart) monthlyChart.destroy();
  
  monthlyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { 
          label: 'Creados', 
          data: totales, 
          borderWidth: 2, 
          borderColor: '#1d4ed8', 
          backgroundColor: 'rgba(29,78,216,0.08)', 
          tension: 0.3, 
          pointRadius: 3 
        },
        { 
          label: 'Resueltos', 
          data: resueltos, 
          borderWidth: 2, 
          borderColor: '#0b3a66', 
          backgroundColor: 'rgba(11,58,102,0.06)', 
          tension: 0.3, 
          pointRadius: 3 
        },
        { 
          label: 'Pendientes', 
          data: pendientes, 
          borderWidth: 2, 
          borderColor: '#f59e0b', 
          backgroundColor: 'rgba(245,158,11,0.06)', 
          tension: 0.3, 
          pointRadius: 3 
        }
      ]
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: false, 
      plugins: { legend: { position: 'top' } }, 
      scales: { 
        x: { ticks: { color: palette.muted }, grid: { display: false } }, 
        y: { ticks: { color: palette.muted }, grid: { color: '#f1f5f9' } } 
      }
    }
  });
}

// Actualizar gráfico de categoría
function actualizarGraficoCategoria(datosCategoria) {
  const ctx = document.getElementById('categoryChart');
  if (!ctx) return;
  
  const labels = datosCategoria.map(d => d.categoria || 'Sin categoría');
  const valores = datosCategoria.map(d => d.count);
  
  if (categoryChart) categoryChart.destroy();
  
  categoryChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: valores,
        backgroundColor: ['#1d4ed8', '#0b3a66', '#60a5fa', '#f59e0b', '#c7d2fe', '#16a34a']
      }]
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: false, 
      plugins: { legend: { position: 'bottom' } } 
    }
  });
}

// Actualizar gráfico de prioridad
function actualizarGraficoPrioridad(datosPrioridad) {
  const ctx = document.getElementById('priorityChart');
  if (!ctx) return;
  
  const prioridadLabels = {
    'critica': 'Crítica',
    'alta': 'Alta',
    'media': 'Media',
    'baja': 'Baja'
  };
  
  const labels = datosPrioridad.map(d => prioridadLabels[d.prioridad] || d.prioridad);
  const valores = datosPrioridad.map(d => d.count);
  
  if (priorityChart) priorityChart.destroy();
  
  priorityChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: valores,
        backgroundColor: ['#ef4444', '#f97316', '#fbbf24', '#60a5fa']
      }]
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: false, 
      plugins: { legend: { display: false } }, 
      scales: { 
        x: { ticks: { color: palette.muted } }, 
        y: { ticks: { color: palette.muted }, beginAtZero: true } 
      } 
    }
  });
}

// Actualizar gráfico de hora
function actualizarGraficoHora(datosHora) {
  const ctx = document.getElementById('hourChart');
  if (!ctx) return;
  
  // Crear array de 24 horas y rellenar con datos
  const horasCompletas = Array.from({length: 24}, (_, i) => i);
  const valores = horasCompletas.map(hora => {
    const dato = datosHora.find(d => d.hora === hora);
    return dato ? dato.count : 0;
  });
  
  // Filtrar solo horas laborales (8am - 6pm) para mejor visualización
  const horasLaborales = [8, 10, 12, 14, 16, 18];
  const labels = horasLaborales.map(h => `${h}:00`);
  const valoresLaborales = horasLaborales.map(h => valores[h]);
  
  if (hourChart) hourChart.destroy();
  
  hourChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: valoresLaborales,
        backgroundColor: '#60a5fa'
      }]
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: false, 
      plugins: { legend: { display: false } }, 
      scales: { 
        x: { ticks: { color: palette.muted } }, 
        y: { ticks: { color: palette.muted }, beginAtZero: true } 
      } 
    }
  });
}

// Actualizar tabla de técnicos
function actualizarTablaTecnicos(tecnicos) {
  const tbody = document.getElementById('techTable');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  const colores = [
    'linear-gradient(135deg,#6366f1,#60a5fa)',
    'linear-gradient(135deg,#7c3aed,#a78bfa)',
    'linear-gradient(135deg,#06b6d4,#60a5fa)',
    'linear-gradient(135deg,#f97316,#fb923c)',
    'linear-gradient(135deg,#ef4444,#f97316)'
  ];
  
  function obtenerIniciales(nombre) {
    return nombre.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
  }
  
  tecnicos.forEach((t, idx) => {
    const tr = document.createElement('tr');
    const isPositive = parseFloat(t.trend) >= 0;
    const trendClass = isPositive ? 'trend-up' : 'trend-down';
    const trendSymbol = isPositive ? '▴' : '▾';
    const color = colores[idx % colores.length];
    
    tr.innerHTML = `
      <td class="tech-cell">
        <div class="tech-left">
          <div class="avatar-circle" style="background:${color}">${obtenerIniciales(t.nombre)}</div>
          <div class="tech-name">${t.nombre}</div>
        </div>
      </td>
      <td class="solved"><strong>${t.resueltos}</strong></td>
      <td class="avg">${t.tiempo_promedio}h</td>
      <td class="sat">
        <div class="sat-row">
          <div class="sat-bar"><div class="sat-fill" style="width:${t.satisfaccion}%"></div></div>
          <span class="sat-percent">${t.satisfaccion}%</span>
        </div>
      </td>
      <td class="trend"><span class="${trendClass}">${trendSymbol} <small>${Math.abs(parseFloat(t.trend))}%</small></span></td>
    `;
    tbody.appendChild(tr);
  });
}

// Cargar estadísticas al iniciar
document.addEventListener('DOMContentLoaded', () => {
  cargarEstadisticas();
  
  // Actualizar cada 5 minutos
  setInterval(cargarEstadisticas, 300000);
});

// Export CSV desde el botón Exportar Reporte (incluye Tendencia)
const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
  exportBtn.addEventListener('click', function () {
    const headers = ['Técnico', 'Casos Resueltos', 'Tiempo Promedio (hrs)', 'Satisfacción', 'Tendencia'];
    const rows = technicians.map(t => [t.name, t.solved, t.avg, t.sat + '%', (t.trend >= 0 ? '+' : '-') + Math.abs(t.trend) + '%']);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte_tecnicos.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
}


