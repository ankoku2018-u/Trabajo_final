// Datos de los casos sin asignar
const unassignedCases = [
    {
        id: '#40345678',
        title: 'Error crítico en base de datos',
        client: 'ECOPETROL',
        category: 'SOFTWARE',
        priority: 'Urgente',
        created: '10 Ene 2025, 09:15',
        waitingTime: '2 horas',
        description: 'Base de datos Oracle presenta errores de conexión intermitentes',
        requiredSkill: 'Administración BD Oracle',
        estimatedTime: '4-6 horas'
    },
    {
        id: '#40345679',
        title: 'Instalación de puntos de red',
        client: 'BANCO AGRARIO',
        category: 'HARDWARE',
        priority: 'Alta',
        created: '10 Ene 2025, 08:30',
        waitingTime: '3 horas',
        description: 'Requiere instalación de 12 puntos de red en nueva oficina',
        requiredSkill: 'Cableado estructurado',
        estimatedTime: '8 horas'
    },
    {
        id: '#40345680',
        title: 'Configuración email corporativo',
        client: 'QUALA SA',
        category: 'SOFTWARE',
        priority: 'Media',
        created: '10 Ene 2025, 07:45',
        waitingTime: '4 horas',
        description: 'Configurar cuentas Outlook para 25 usuarios nuevos',
        requiredSkill: 'Office 365 / Exchange',
        estimatedTime: '2-3 horas'
    },
    {
        id: '#40345681',
        title: 'Reparación impresora multifuncional',
        client: 'IDIGER',
        category: 'HARDWARE',
        priority: 'Baja',
        created: '09 Ene 2025, 16:20',
        waitingTime: '1 día',
        description: 'Impresora HP OfficeJet no reconoce cartuchos de tinta',
        requiredSkill: 'Soporte impresoras',
        estimatedTime: '1 hora'
    },
    {
        id: '#40345682',
        title: 'Actualización de antivirus',
        client: 'CANCEROLÓGICO',
        category: 'SOFTWARE',
        priority: 'Media',
        created: '09 Ene 2025, 14:00',
        waitingTime: '1 día',
        description: 'Actualización masiva de McAfee en 40 equipos',
        requiredSkill: 'Gestión antivirus',
        estimatedTime: '3-4 horas'
    },
    {
        id: '#40345683',
        title: 'Configuración de VPN',
        client: 'COLSOF SAS',
        category: 'REDES',
        priority: 'Alta',
        created: '09 Ene 2025, 11:30',
        waitingTime: '1 día',
        description: 'Configurar acceso VPN para 15 usuarios remotos',
        requiredSkill: 'Redes y seguridad',
        estimatedTime: '2 horas'
    },
    {
        id: '#40345684',
        title: 'Mantenimiento servidor',
        client: 'SUPERSALUD',
        category: 'HARDWARE',
        priority: 'Media',
        created: '08 Ene 2025, 15:45',
        waitingTime: '2 días',
        description: 'Mantenimiento preventivo de servidor Dell PowerEdge',
        requiredSkill: 'Hardware servidores',
        estimatedTime: '3 horas'
    }
];

// Datos de los técnicos
const technicians = [
    { id: 1, name: 'Juan Pérez', avatar: 'JP', currentLoad: 8, maxLoad: 10, skills: ['Hardware', 'Software', 'BD Oracle'] },
    { id: 2, name: 'Dianne Russell', avatar: 'DR', currentLoad: 6, maxLoad: 10, skills: ['Redes', 'Cableado', 'VPN'] },
    { id: 3, name: 'Jane Cooper', avatar: 'JC', currentLoad: 5, maxLoad: 10, skills: ['Software', 'Office 365', 'Antivirus'] },
    { id: 4, name: 'Robert Fox', avatar: 'RF', currentLoad: 4, maxLoad: 10, skills: ['Hardware', 'Servidores', 'Impresoras'] },
    { id: 5, name: 'Cody Fisher', avatar: 'CF', currentLoad: 3, maxLoad: 10, skills: ['Seguridad', 'Redes', 'Firewall'] }
];

// Variables globales
let currentSelectedCase = null;

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar iconos de Lucide
    if (lucide) {
        lucide.createIcons();
    }
    
    // Actualizar estadísticas
    updateStats();
    
    // Renderizar casos
    renderCases();
    
    // Renderizar técnicos
    renderTechnicians();
    
    // Renderizar técnicos para el modal (inicialmente vacío)
    renderModalTechnicians();
    
    // Configurar event listeners
    setupEventListeners();
});

// Actualizar estadísticas en la interfaz
function updateStats() {
    const urgentCount = unassignedCases.filter(c => c.priority === 'Urgente').length;
    const highCount = unassignedCases.filter(c => c.priority === 'Alta').length;
    const totalCount = unassignedCases.length;
    
    // Actualizar contadores
    document.getElementById('urgent-count').textContent = urgentCount;
    document.getElementById('high-count').textContent = highCount;
    document.getElementById('total-unassigned').textContent = totalCount;
    document.getElementById('queue-count').textContent = totalCount;
    
    // Actualizar mensaje de alerta
    const alertMessage = document.getElementById('alert-message');
    alertMessage.textContent = `Hay ${urgentCount} casos urgentes y ${highCount} casos de alta prioridad esperando asignación. Asigna estos casos lo antes posible para mantener los SLA.`;
}

// Obtener clase de color para prioridad
function getPriorityClass(priority) {
    switch(priority) {
        case 'Urgente': return 'priority-urgent';
        case 'Alta': return 'priority-high';
        case 'Media': return 'priority-medium';
        case 'Baja': return 'priority-low';
        default: return 'priority-medium';
    }
}

// Obtener clase de color para tiempo de espera
function getWaitingTimeClass(waitingTime) {
    if (waitingTime.includes('día') && parseInt(waitingTime) >= 2) return 'waiting-time-red';
    if (waitingTime.includes('día')) return 'waiting-time-orange';
    if (parseInt(waitingTime) >= 3) return 'waiting-time-orange';
    return 'waiting-time-yellow';
}

// Obtener color para la barra de carga
function getLoadColorClass(load, maxLoad) {
    const percentage = (load / maxLoad) * 100;
    if (percentage >= 80) return 'load-fill-red';
    if (percentage >= 60) return 'load-fill-yellow';
    return 'load-fill-green';
}

// Renderizar la lista de casos
function renderCases() {
    const casesList = document.getElementById('cases-list');
    casesList.innerHTML = '';
    
    unassignedCases.forEach(caso => {
        const caseElement = document.createElement('div');
        caseElement.className = 'case-card';
        caseElement.dataset.id = caso.id;
        
        caseElement.innerHTML = `
            <div class="case-content">
                <div class="case-header">
                    <div class="case-info">
                        <div class="case-id-priority">
                            <span class="case-id">${caso.id}</span>
                            <span class="priority-badge ${getPriorityClass(caso.priority)}">${caso.priority}</span>
                            <div class="waiting-time ${getWaitingTimeClass(caso.waitingTime)}">
                                <i data-lucide="clock" class="waiting-time-icon"></i>
                                <span>Esperando ${caso.waitingTime}</span>
                            </div>
                        </div>
                        <h3 class="case-title">${caso.title}</h3>
                        <p class="case-description">${caso.description}</p>
                    </div>
                </div>
                
                <div class="case-details">
                    <div>
                        <p class="detail-label">Cliente</p>
                        <p class="detail-value">${caso.client}</p>
                    </div>
                    <div>
                        <p class="detail-label">Categoría</p>
                        <p class="detail-value">${caso.category}</p>
                    </div>
                    <div>
                        <p class="detail-label">Tiempo Estimado</p>
                        <p class="detail-value">${caso.estimatedTime}</p>
                    </div>
                </div>
                
                <div class="skill-card">
                    <p class="skill-label">Habilidad Requerida:</p>
                    <p class="skill-value">${caso.requiredSkill}</p>
                </div>
                
                <div class="case-actions">
                    <button class="btn btn-outline view-details-btn" data-case-id="${caso.id}">
                        <i data-lucide="eye" class="btn-icon"></i>
                        Ver Detalles
                    </button>
                    <button class="btn btn-primary assign-btn" data-case-id="${caso.id}">
                        <i data-lucide="user-plus" class="btn-icon"></i>
                        Asignar Técnico
                    </button>
                </div>
            </div>
        `;
        
        casesList.appendChild(caseElement);
    });
    
    // Re-inicializar iconos después de agregar nuevos elementos
    if (lucide) {
        lucide.createIcons();
    }
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.assign-btn').forEach(button => {
        button.addEventListener('click', function() {
            const caseId = this.dataset.caseId;
            openAssignModal(caseId);
        });
    });
    
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const caseId = this.dataset.caseId;
            showCaseDetails(caseId);
        });
    });
}

// Renderizar la lista de técnicos en el panel lateral
function renderTechnicians() {
    const techniciansList = document.getElementById('technicians-list');
    techniciansList.innerHTML = '';
    
    technicians.forEach(tech => {
        const techElement = document.createElement('div');
        techElement.className = 'technician-card';
        techElement.dataset.id = tech.id;
        
        const loadPercentage = Math.round((tech.currentLoad / tech.maxLoad) * 100);
        
        techElement.innerHTML = `
            <div class="technician-header">
                <div class="technician-avatar">${tech.avatar}</div>
                <div class="technician-info">
                    <p class="technician-name">${tech.name}</p>
                    <p class="technician-load">${tech.currentLoad}/${tech.maxLoad} casos activos</p>
                </div>
            </div>
            
            <div class="load-container">
                <div class="load-header">
                    <span>Carga de trabajo</span>
                    <span>${loadPercentage}%</span>
                </div>
                <div class="load-bar">
                    <div class="load-fill ${getLoadColorClass(tech.currentLoad, tech.maxLoad)}" 
                         style="width: ${loadPercentage}%"></div>
                </div>
            </div>
            
            <div class="skills-container">
                <p class="skills-label">Habilidades:</p>
                <div class="skills-list">
                    ${tech.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        `;
        
        techniciansList.appendChild(techElement);
    });
}

// Renderizar técnicos en el modal de asignación
function renderModalTechnicians() {
    const modalTechniciansList = document.getElementById('technicians-modal-list');
    modalTechniciansList.innerHTML = '';
    
    if (!currentSelectedCase) return;
    
    technicians.forEach(tech => {
        const hasSkill = tech.skills.some(skill => 
            currentSelectedCase.requiredSkill.toLowerCase().includes(skill.toLowerCase())
        );
        
        const loadPercentage = Math.round((tech.currentLoad / tech.maxLoad) * 100);
        
        const techElement = document.createElement('div');
        techElement.className = `technician-modal-card ${hasSkill ? 'recommended' : ''}`;
        techElement.dataset.techId = tech.id;
        
        techElement.innerHTML = `
            <div class="technician-modal-content">
                <div class="technician-modal-left">
                    <div class="technician-modal-avatar">${tech.avatar}</div>
                    <div class="technician-modal-info">
                        <p class="technician-modal-name">
                            ${tech.name}
                            ${hasSkill ? '<span class="recommended-badge">Recomendado</span>' : ''}
                        </p>
                        <p class="technician-modal-load">${tech.currentLoad}/${tech.maxLoad} casos activos</p>
                    </div>
                </div>
                <div class="technician-modal-right">
                    <div class="modal-load-bar">
                        <div class="modal-load-fill ${getLoadColorClass(tech.currentLoad, tech.maxLoad)}" 
                             style="width: ${loadPercentage}%"></div>
                    </div>
                    <p class="load-percentage">${loadPercentage}% carga</p>
                </div>
            </div>
        `;
        
        techElement.addEventListener('click', function() {
            assignCase(currentSelectedCase.id, tech.id);
        });
        
        modalTechniciansList.appendChild(techElement);
    });
}

// Abrir modal de asignación
function openAssignModal(caseId) {
    const caso = unassignedCases.find(c => c.id === caseId);
    if (!caso) return;
    
    currentSelectedCase = caso;
    
    // Actualizar información del caso en el modal
    document.getElementById('modal-case-info').textContent = `${caso.id} - ${caso.title}`;
    document.getElementById('modal-skill').textContent = caso.requiredSkill;
    
    // Renderizar técnicos en el modal
    renderModalTechnicians();
    
    // Mostrar el modal
    document.getElementById('assign-modal').style.display = 'flex';
}

// Cerrar modal de asignación
function closeAssignModal() {
    document.getElementById('assign-modal').style.display = 'none';
    currentSelectedCase = null;
}

// Asignar caso a un técnico
function assignCase(caseId, technicianId) {
    const caso = unassignedCases.find(c => c.id === caseId);
    const tech = technicians.find(t => t.id === technicianId);
    
    if (!caso || !tech) return;
    
    // Simular asignación
    alert(`Caso ${caseId} asignado a ${tech.name}`);
    
    // En una aplicación real, aquí actualizarías los datos
    // Por ahora, solo cerramos el modal
    closeAssignModal();
}

// Mostrar detalles del caso
function showCaseDetails(caseId) {
    const caso = unassignedCases.find(c => c.id === caseId);
    if (!caso) return;
    
    // En una aplicación completa, aquí podrías mostrar un modal con más detalles
    // Por ahora, solo mostramos una alerta
    alert(`Detalles del caso ${caseId}:\n\n` +
          `Título: ${caso.title}\n` +
          `Cliente: ${caso.client}\n` +
          `Categoría: ${caso.category}\n` +
          `Prioridad: ${caso.priority}\n` +
          `Creado: ${caso.created}\n` +
          `Tiempo de espera: ${caso.waitingTime}\n` +
          `Descripción: ${caso.description}\n` +
          `Habilidad requerida: ${caso.requiredSkill}\n` +
          `Tiempo estimado: ${caso.estimatedTime}`);
}

// Configurar event listeners
function setupEventListeners() {
    // Botón para cancelar asignación
    document.getElementById('cancel-assign').addEventListener('click', closeAssignModal);
    
    // Cerrar modal al hacer clic fuera de él
    document.getElementById('assign-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeAssignModal();
        }
    });
}