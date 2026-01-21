// Datos de ejemplo para las consultas
const sampleQueries = [
    { 
        name: 'Casos sin resolver', 
        query: 'SELECT * FROM casos WHERE estado != "Resuelto" ORDER BY fecha_creacion DESC',
        description: 'Lista todos los casos activos pendientes de resolución'
    },
    { 
        name: 'Técnicos con mayor carga', 
        query: 'SELECT tecnico_id, COUNT(*) as total FROM casos WHERE estado = "En Curso" GROUP BY tecnico_id ORDER BY total DESC',
        description: 'Muestra técnicos ordenados por cantidad de casos activos'
    },
    { 
        name: 'Casos por prioridad', 
        query: 'SELECT prioridad, COUNT(*) as cantidad FROM casos GROUP BY prioridad',
        description: 'Distribución de casos según nivel de prioridad'
    }
];

// Datos de ejemplo para resultados de consultas
const queryResultsData = {
    columns: ['ID', 'Cliente', 'Estado', 'Prioridad', 'Fecha'],
    rows: [
        ['C-10245', 'María González', 'En Curso', 'Alta', '2026-01-19'],
        ['C-10244', 'Carlos Méndez', 'Pausado', 'Media', '2026-01-19'],
        ['C-10243', 'Ana Rodríguez', 'Creado', 'Alta', '2026-01-18'],
        ['C-10242', 'Pedro Sánchez', 'En Curso', 'Baja', '2026-01-18'],
        ['C-10241', 'Laura Martínez', 'En Curso', 'Media', '2026-01-18']
    ],
    executionTime: '0.034s',
    rowsAffected: 5
};

// Variables globales
let isExecutingQuery = false;

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar iconos de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Configurar event listeners
    setupEventListeners();
    
    // Inicializar pestañas
    initTabs();
});

// Inicializar el sistema de pestañas
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Activar la primera pestaña por defecto
    if (tabButtons.length > 0 && tabPanes.length > 0) {
        const firstTabId = tabButtons[0].dataset.tab;
        showTab(firstTabId);
    }
}

// Mostrar una pestaña específica
function showTab(tabId) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Desactivar todos los botones de pestaña
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Mostrar la pestaña seleccionada
    const tabPane = document.getElementById(`${tabId}-tab`);
    if (tabPane) {
        tabPane.classList.add('active');
    }
    
    // Activar el botón de la pestaña seleccionada
    const tabButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    if (tabButton) {
        tabButton.classList.add('active');
    }
}

// Ejecutar consulta SQL
function executeQuery() {
    if (isExecutingQuery) return;
    
    const queryEditor = document.getElementById('query-editor');
    const queryText = queryEditor.value.trim();
    
    if (!queryText) {
        alert('Por favor, escribe una consulta SQL');
        return;
    }
    
    // Mostrar estado de ejecución
    isExecutingQuery = true;
    const executeBtn = document.getElementById('execute-query');
    const originalText = executeBtn.innerHTML;
    executeBtn.innerHTML = '<i data-lucide="refresh-cw" class="btn-icon animate-spin"></i> Ejecutando...';
    executeBtn.disabled = true;
    
    // Simular tiempo de ejecución
    setTimeout(() => {
        // Mostrar resultados
        displayQueryResults();
        
        // Restaurar botón
        isExecutingQuery = false;
        executeBtn.innerHTML = originalText;
        executeBtn.disabled = false;
        
        // Mostrar botón de exportar
        document.getElementById('export-results').style.display = 'flex';
        
        // Re-inicializar iconos
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, 800);
}

// Mostrar resultados de la consulta
function displayQueryResults() {
    const resultsContainer = document.getElementById('query-results');
    
    // Crear estructura de resultados
    resultsContainer.innerHTML = `
        <div class="results-header">
            <div class="results-title">Resultados</div>
            <div class="results-meta">
                <span class="results-time">
                    <i data-lucide="clock" class="btn-icon-small"></i>
                    ${queryResultsData.executionTime}
                </span>
                <span class="results-rows">
                    <i data-lucide="file-text" class="btn-icon-small"></i>
                    ${queryResultsData.rowsAffected} filas
                </span>
            </div>
        </div>
        <table class="results-table">
            <thead>
                <tr>
                    ${queryResultsData.columns.map(col => `<th>${col}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${queryResultsData.rows.map(row => `
                    <tr>
                        ${row.map((cell, cellIdx) => {
                            if (cellIdx === 3) { // Columna de prioridad
                                let priorityClass = 'priority-low';
                                if (cell === 'Alta') priorityClass = 'priority-high';
                                if (cell === 'Media') priorityClass = 'priority-medium';
                                
                                return `<td><span class="priority-badge ${priorityClass}">${cell}</span></td>`;
                            }
                            return `<td>${cell}</td>`;
                        }).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Mostrar contenedor de resultados
    resultsContainer.style.display = 'block';
}

// Limpiar editor de consultas
function clearQueryEditor() {
    document.getElementById('query-editor').value = '';
    document.getElementById('query-results').style.display = 'none';
    document.getElementById('export-results').style.display = 'none';
}

// Exportar resultados
function exportQueryResults() {
    // En una aplicación real, esto generaría un archivo descargable
    alert('Los resultados se han exportado correctamente');
}

// Crear backup
function createBackup() {
    const backupType = document.getElementById('backup-type').value;
    const backupLocation = document.getElementById('backup-location').value;
    
    // Simular creación de backup
    alert(`Backup de tipo "${backupType}" creado en: ${backupLocation}`);
}

// Seleccionar archivo de backup para restaurar
function selectBackupFile() {
    // En una aplicación real, esto abriría un diálogo de selección de archivos
    alert('Por favor, selecciona el archivo de backup desde tu computadora');
}

// Configurar todos los event listeners
function setupEventListeners() {
    // Navegación de pestañas
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            showTab(tabId);
        });
    });
    
    // Consultas SQL
    const btnExecute = document.getElementById('execute-query');
    if (btnExecute) btnExecute.addEventListener('click', executeQuery);
    const btnClear = document.getElementById('clear-query');
    if (btnClear) btnClear.addEventListener('click', clearQueryEditor);
    const btnExport = document.getElementById('export-results');
    if (btnExport) btnExport.addEventListener('click', exportQueryResults);
    
    // Consultas predefinidas
    document.querySelectorAll('.sample-query').forEach(query => {
        query.addEventListener('click', function() {
            const queryText = this.dataset.query;
            document.getElementById('query-editor').value = queryText;
        });
    });
    
    // Backup
    const btnCreateBackup = document.getElementById('create-backup');
    if (btnCreateBackup) btnCreateBackup.addEventListener('click', createBackup);
    const btnSelectBackup = document.getElementById('select-backup-file');
    if (btnSelectBackup) btnSelectBackup.addEventListener('click', selectBackupFile);
    
    // Botones de mantenimiento
    document.querySelectorAll('.maintenance-card .btn').forEach(button => {
        button.addEventListener('click', function() {
            const cardTitle = this.closest('.maintenance-card').querySelector('.maintenance-title').textContent;
            alert(`Iniciando: ${cardTitle}`);
        });
    });
    
    // Botones de backup history
    document.querySelectorAll('.btn-backup-action.restore').forEach(button => {
        button.addEventListener('click', function() {
            const backupDate = this.closest('.backup-item').querySelector('.backup-date').textContent;
            alert(`Restaurando backup del ${backupDate}`);
        });
    });
    
    document.querySelectorAll('.btn-backup-action.download').forEach(button => {
        button.addEventListener('click', function() {
            const backupDate = this.closest('.backup-item').querySelector('.backup-date').textContent;
            alert(`Descargando backup del ${backupDate}`);
        });
    });
    
    document.querySelectorAll('.btn-backup-action.delete').forEach(button => {
        button.addEventListener('click', function() {
            const backupDate = this.closest('.backup-item').querySelector('.backup-date').textContent;
            if (confirm(`¿Estás seguro de que quieres eliminar el backup del ${backupDate}?`)) {
                alert(`Backup del ${backupDate} eliminado`);
            }
        });
    });
    
    // Botones de importación/exportación
    const importBtn = document.querySelector('.import-card .btn');
    if (importBtn) {
        importBtn.addEventListener('click', function() {
            alert('Por favor, selecciona el archivo que deseas importar');
        });
    }
    
    document.querySelectorAll('.btn-export').forEach(button => {
        button.addEventListener('click', function() {
            const format = this.textContent;
            alert(`Exportando datos en formato ${format}`);
        });
    });
}

// Añadir animación de spin para iconos de carga
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .animate-spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);