document.addEventListener('DOMContentLoaded', function() {
    const casos = [
        {
            id: 'C-10001',
            titulo: 'Fallo en módulo de facturación',
            cliente: 'Empresa XYZ',
            tecnico: 'Juan Pérez',
            prioridad: 'Alta',
            estado: 'En Curso',
            sla: '2h',
            porcentajeSLA: 87
        },
        {
            id: 'C-10002',
            titulo: 'Consulta de reportes históricos',
            cliente: 'Carlos López',
            tecnico: 'María García',
            prioridad: 'Media',
            estado: 'Resuelto',
            sla: '8h',
            porcentajeSLA: 95
        },
        {
            id: 'C-10003',
            titulo: 'Actualización de permisos de usuario',
            cliente: 'Patricia Ruiz',
            tecnico: 'Sin asignar',
            prioridad: 'Baja',
            estado: 'Pausado',
            sla: '24h',
            porcentajeSLA: 45
        },
        {
            id: 'C-10004',
            titulo: 'Error al descargar archivos PDF',
            cliente: 'Roberto Silva',
            tecnico: 'Juan Pérez',
            prioridad: 'Alta',
            estado: 'Creado',
            sla: '1h',
            porcentajeSLA: 32
        },
        {
            id: 'C-10243',
            titulo: 'Solicitud de nuevo usuario',
            cliente: 'Ana Rodríguez',
            tecnico: 'Sin asignar',
            prioridad: 'Alta',
            estado: 'Creado',
            sla: '4h',
            porcentajeSLA: 10
        }
    ];

    const table = document.getElementById('casesTable');
    const tableBody = table ? table.querySelector('tbody') : null;
    const tableWrapper = document.getElementById('tableWrapper');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const emptyMessage = document.getElementById('emptyMessage');

    const statTotal = document.getElementById('statTotal');
    const statEnCurso = document.getElementById('statEnCurso');
    const statAlta = document.getElementById('statAlta');
    const statSla = document.getElementById('statSla');
    const statTotalNote = document.getElementById('statTotalNote');
    const statEnCursoNote = document.getElementById('statEnCursoNote');
    const statAltaNote = document.getElementById('statAltaNote');
    const statSlaNote = document.getElementById('statSlaNote');

    const btnRefresh = document.getElementById('btnRefresh');
    const btnNew = document.getElementById('btnNew');

    function renderTable(data) {
        if (!tableBody || !table) return;
        tableBody.innerHTML = '';

        const isEmpty = data.length === 0;
        if (emptyMessage) {
            emptyMessage.classList.toggle('hidden', !isEmpty);
        }
        table.classList.toggle('hidden', isEmpty);
        if (tableWrapper) {
            tableWrapper.classList.toggle('table-empty', isEmpty);
        }
        if (isEmpty) return;

        data.forEach(caso => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${caso.id}</td>
                <td>${caso.titulo}</td>
                <td>${caso.cliente}</td>
                <td>${caso.tecnico}</td>
                <td><span class="badge prioridad-${caso.prioridad}">${caso.prioridad}</span></td>
                <td><span class="badge estado-${caso.estado.replace(/\s+/g, '\\ ')}">${caso.estado}</span></td>
                <td>${caso.porcentajeSLA}% (${caso.sla})</td>
            `;

            tableBody.appendChild(row);
        });
    }

    function applyFilters() {
        const search = searchInput.value.toLowerCase();
        const estado = statusFilter.value;
        const prioridad = priorityFilter.value;

        const filtered = casos.filter(c => {
            const matchesSearch =
                c.id.toLowerCase().includes(search) ||
                c.titulo.toLowerCase().includes(search) ||
                c.cliente.toLowerCase().includes(search);

            const matchesStatus = estado === 'todos' || c.estado === estado;
            const matchesPriority = prioridad === 'todos' || c.prioridad === prioridad;

            return matchesSearch && matchesStatus && matchesPriority;
        });

        renderTable(filtered);
        renderStats(filtered);
    }

    function renderStats(data) {
        const total = data.length;
        const enCurso = data.filter(c => c.estado === 'En Curso').length;
        const alta = data.filter(c => c.prioridad === 'Alta').length;
        const slaProm = total ? Math.round(data.reduce((acc, c) => acc + c.porcentajeSLA, 0) / total) : 0;

        if (statTotal) statTotal.textContent = total;
        if (statEnCurso) statEnCurso.textContent = enCurso;
        if (statAlta) statAlta.textContent = alta;
        if (statSla) statSla.textContent = `${slaProm}%`;

        if (statTotalNote) statTotalNote.textContent = total ? 'Casos en la vista' : 'Sin datos';
        if (statEnCursoNote) statEnCursoNote.textContent = enCurso ? 'En seguimiento' : 'Ninguno activo';
        if (statAltaNote) statAltaNote.textContent = alta ? 'Requieren priorización' : 'Sin alertas altas';
        if (statSlaNote) statSlaNote.textContent = total ? 'Promedio visible' : 'Sin SLA para mostrar';
    }

    function resetAndRefresh() {
        if (searchInput) searchInput.value = '';
        if (statusFilter) statusFilter.value = 'todos';
        if (priorityFilter) priorityFilter.value = 'todos';
        applyFilters();
    }

    // Event listeners con verificación
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    if (priorityFilter) {
        priorityFilter.addEventListener('change', applyFilters);
    }

    if (btnRefresh) btnRefresh.addEventListener('click', resetAndRefresh);
    if (btnNew) btnNew.addEventListener('click', () => alert('Crear un nuevo caso'));

    // Renderizar tabla inicial
    renderTable(casos);
    renderStats(casos);
});