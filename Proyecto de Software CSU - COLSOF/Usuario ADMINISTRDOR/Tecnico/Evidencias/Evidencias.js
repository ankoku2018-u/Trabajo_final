const evidencias = [
	{ id: 1, nombre: 'diagnostico_hardware_C10245.pdf', tipo: 'documento', formato: 'PDF', tamano: '2.4 MB', caso: 'C-10245', tecnico: 'Carlos Méndez', fecha: '2026-01-19 10:30', categoria: 'Diagnóstico', estado: 'Aprobado' },
	{ id: 2, nombre: 'foto_equipo_dañado_01.jpg', tipo: 'imagen', formato: 'JPG', tamano: '3.8 MB', caso: 'C-10245', tecnico: 'Carlos Méndez', fecha: '2026-01-19 10:45', categoria: 'Fotografía', estado: 'Aprobado' },
	{ id: 3, nombre: 'log_sistema_error.txt', tipo: 'documento', formato: 'TXT', tamano: '45 KB', caso: 'C-10244', tecnico: 'Devon Lane', fecha: '2026-01-19 08:45', categoria: 'Logs', estado: 'Pendiente' }
];

const grid = document.getElementById('gridView');
const table = document.querySelector('#listView tbody');
const tableWrapper = document.getElementById('tableWrapper');
const gridWrapper = document.getElementById('gridWrapper');
const search = document.getElementById('searchEvidence');
const typeFilter = document.getElementById('typeFilter');
const noResults = document.getElementById('noResults');
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');
const btnRefresh = document.getElementById('btnRefresh');
const btnUpload = document.getElementById('btnUpload');

const statTotal = document.getElementById('statTotal');
const statAprobadas = document.getElementById('statAprobadas');
const statPendientes = document.getElementById('statPendientes');
const statTipos = document.getElementById('statTipos');
const statTotalNote = document.getElementById('statTotalNote');
const statAprobadasNote = document.getElementById('statAprobadasNote');
const statPendientesNote = document.getElementById('statPendientesNote');
const statTiposNote = document.getElementById('statTiposNote');

let currentView = 'grid';
let currentData = [...evidencias];

function renderGrid(data) {
	if (!grid) return;
	grid.innerHTML = '';

	data.forEach(ev => {
		const card = document.createElement('div');
		card.className = 'file-card';
		card.innerHTML = `
			<div class="file-top">
				<div>
					<div class="file-name">${ev.nombre}</div>
					<div class="file-meta">${ev.formato} • ${ev.tamano} • ${ev.fecha}</div>
				</div>
				<span class="badge estado-${ev.estado}">${ev.estado}</span>
			</div>
			<div class="file-meta">Caso: ${ev.caso} • Técnico: ${ev.tecnico} • ${ev.categoria}</div>
			<div class="file-actions">
				<a class="link" href="#">Ver</a>
				<a class="link" href="#">Descargar</a>
			</div>
		`;
		grid.appendChild(card);
	});
}

function renderTable(data) {
	if (!table) return;
	table.innerHTML = '';

	data.forEach(ev => {
		const row = document.createElement('tr');
		row.innerHTML = `
			<td>${ev.nombre}</td>
			<td>${ev.tipo}</td>
			<td>${ev.caso}</td>
			<td>${ev.tecnico}</td>
			<td>${ev.categoria}</td>
			<td>${ev.fecha}</td>
			<td>${ev.tamano}</td>
			<td><span class="badge estado-${ev.estado}">${ev.estado}</span></td>
			<td><a class="link" href="#">Ver</a> | <a class="link" href="#">Descargar</a></td>
		`;
		table.appendChild(row);
	});
}

function renderStats(data) {
	const total = data.length;
	const aprobadas = data.filter(e => e.estado === 'Aprobado').length;
	const pendientes = data.filter(e => e.estado === 'Pendiente').length;
	const imagenes = data.filter(e => e.tipo === 'imagen').length;
	const docs = data.filter(e => e.tipo === 'documento').length;

	if (statTotal) statTotal.textContent = total;
	if (statAprobadas) statAprobadas.textContent = aprobadas;
	if (statPendientes) statPendientes.textContent = pendientes;
	if (statTipos) statTipos.textContent = `${imagenes} / ${docs}`;

	if (statTotalNote) statTotalNote.textContent = total ? 'Registros visibles' : 'Sin datos';
	if (statAprobadasNote) statAprobadasNote.textContent = aprobadas ? 'Listas para uso' : 'Ninguna aprobada';
	if (statPendientesNote) statPendientesNote.textContent = pendientes ? 'En revisión' : 'Sin pendientes';
	if (statTiposNote) statTiposNote.textContent = 'Imágenes / Documentos';
}

function render(data) {
	const isEmpty = data.length === 0;
	if (noResults) noResults.classList.toggle('hidden', !isEmpty);

	if (gridWrapper) gridWrapper.classList.toggle('hidden', currentView !== 'grid');
	if (tableWrapper) tableWrapper.classList.toggle('hidden', currentView !== 'list');

	if (currentView === 'grid') {
		renderGrid(isEmpty ? [] : data);
	} else {
		renderTable(isEmpty ? [] : data);
	}
}

function applyFilters() {
	const term = search ? search.value.toLowerCase() : '';
	const type = typeFilter ? typeFilter.value : 'todos';

	currentData = evidencias.filter(e => {
		const matchSearch = e.nombre.toLowerCase().includes(term) || e.caso.toLowerCase().includes(term) || e.tecnico.toLowerCase().includes(term);
		const matchType = type === 'todos' || e.tipo === type;
		return matchSearch && matchType;
	});

	renderStats(currentData);
	render(currentData);
}

function switchView(view) {
	currentView = view;
	const isGrid = view === 'grid';
	if (gridBtn) {
		gridBtn.classList.toggle('active', isGrid);
		gridBtn.setAttribute('aria-pressed', isGrid);
	}
	if (listBtn) {
		listBtn.classList.toggle('active', !isGrid);
		listBtn.setAttribute('aria-pressed', !isGrid);
	}
	if (gridWrapper) gridWrapper.classList.toggle('hidden', !isGrid);
	if (tableWrapper) tableWrapper.classList.toggle('hidden', isGrid);
	render(currentData);
}

function resetFilters() {
	if (search) search.value = '';
	if (typeFilter) typeFilter.value = 'todos';
	applyFilters();
	switchView('grid');
}

if (search) search.addEventListener('input', applyFilters);
if (typeFilter) typeFilter.addEventListener('change', applyFilters);
if (gridBtn) gridBtn.addEventListener('click', () => switchView('grid'));
if (listBtn) listBtn.addEventListener('click', () => switchView('list'));
if (btnRefresh) btnRefresh.addEventListener('click', resetFilters);
if (btnUpload) btnUpload.addEventListener('click', () => alert('Subir nueva evidencia'));

applyFilters();
switchView('grid');