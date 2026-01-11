// Datos de los borradores
const drafts = [
    {
        id: 'DRAFT-001',
        title: 'Actualización servidores Datacenter',
        client: 'ECOPETROL',
        category: 'HARDWARE',
        priority: 'Alta',
        createdDate: '10 Ene 2025, 14:30',
        lastModified: 'Hace 1 hora',
        completeness: 75,
        missingFields: ['Fecha límite', 'Archivos adjuntos'],
        description: 'Actualización de firmware y parches de seguridad en servidores Dell PowerEdge del datacenter principal',
        contactName: 'María Rodríguez',
        contactPhone: '+57 310 456 7890',
        estimatedTime: '6 horas',
        notes: 'Requiere ventana de mantenimiento nocturna'
    },
    {
        id: 'DRAFT-002',
        title: 'Instalación Office 365 nuevos usuarios',
        client: 'BANCO AGRARIO',
        category: 'SOFTWARE',
        priority: 'Media',
        createdDate: '10 Ene 2025, 11:15',
        lastModified: 'Hace 3 horas',
        completeness: 60,
        missingFields: ['Prioridad', 'Contacto', 'Descripción detallada'],
        description: 'Instalación y configuración de Office 365 para 15 nuevos empleados',
        contactName: '',
        contactPhone: '',
        estimatedTime: '',
        notes: ''
    },
    {
        id: 'DRAFT-003',
        title: 'Reparación switch principal',
        client: 'QUALA SA',
        category: 'REDES',
        priority: 'Urgente',
        createdDate: '09 Ene 2025, 16:45',
        lastModified: 'Hace 1 día',
        completeness: 90,
        missingFields: ['Archivos adjuntos'],
        description: 'Switch Cisco Catalyst 3850 presenta fallas intermitentes en puertos 12-24',
        contactName: 'Andrea Gómez',
        contactPhone: '+57 312 345 6789',
        estimatedTime: '3 horas',
        notes: 'Cliente solicita atención urgente debido a pérdida de conectividad'
    },
    {
        id: 'DRAFT-004',
        title: 'Configuración backup automático',
        client: 'IDIGER',
        category: 'SOFTWARE',
        priority: 'Media',
        createdDate: '09 Ene 2025, 10:00',
        lastModified: 'Hace 1 día',
        completeness: 45,
        missingFields: ['Categoría', 'Fecha límite', 'Tiempo estimado', 'Contacto'],
        description: '',
        contactName: '',
        contactPhone: '',
        estimatedTime: '',
        notes: ''
    },
    {
        id: 'DRAFT-005',
        title: 'Mantenimiento preventivo UPS',
        client: 'CANCEROLÓGICO',
        category: 'HARDWARE',
        priority: 'Baja',
        createdDate: '08 Ene 2025, 15:20',
        lastModified: 'Hace 2 días',
        completeness: 85,
        missingFields: ['Fecha límite'],
        description: 'Mantenimiento trimestral de UPS APC Smart-UPS 10KVA',
        contactName: 'Patricia Ruiz',
        contactPhone: '+57 314 567 8901',
        estimatedTime: '2 horas',
        notes: 'Coordinar con administración para corte de energía'
    },
    {
        id: 'DRAFT-006',
        title: 'Migración email a cloud',
        client: 'COLSOF SAS',
        category: 'SOFTWARE',
        priority: 'Alta',
        createdDate: '08 Ene 2025, 09:30',
        lastModified: 'Hace 2 días',
        completeness: 70,
        missingFields: ['Tiempo estimado', 'Archivos adjuntos'],
        description: 'Migración de cuentas de correo desde servidor local a Microsoft 365',
        contactName: 'Diana López',
        contactPhone: '+57 315 678 9012',
        estimatedTime: '',
        notes: 'Migración progresiva por departamentos'
    },
    {
        id: 'DRAFT-007',
        title: 'Instalación sistema biométrico',
        client: 'SUPERSALUD',
        category: 'HARDWARE',
        priority: 'Media',
        createdDate: '07 Ene 2025, 13:00',
        lastModified: 'Hace 3 días',
        completeness: 55,
        missingFields: ['Descripción detallada', 'Fecha límite', 'Tiempo estimado'],
        description: 'Instalación de lectores biométricos',
        contactName: 'Roberto Castro',
        contactPhone: '+57 316 789 0123',
        estimatedTime: '',
        notes: ''
    }
];

// Variables globales
let currentSelectedDraft = null;
let draftToDelete = null;

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar iconos de Lucide
    if (lucide) {
        lucide.createIcons();
    }
    
    // Actualizar estadísticas
    updateStats();
    
    // Renderizar borradores
    renderDrafts();
    
    // Configurar event listeners
    setupEventListeners();
});

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

// Obtener clase de color para completitud
function getCompletenessClass(completeness) {
    if (completeness >= 80) return 'completeness-high';
    if (completeness >= 50) return 'completeness-medium';
    return 'completeness-low';
}

// Obtener clase de color para la barra de progreso
function getProgressBarClass(completeness) {
    if (completeness >= 80) return 'progress-fill-green';
    if (completeness >= 50) return 'progress-fill-yellow';
    return 'progress-fill-red';
}

// Obtener texto de estado
function getStatusText(completeness) {
    if (completeness >= 80) return 'Listo';
    if (completeness >= 50) return 'En progreso';
    return 'Incompleto';
}

// Actualizar estadísticas en la interfaz
function updateStats() {
    const readyCount = drafts.filter(d => d.completeness >= 80).length;
    const progressCount = drafts.filter(d => d.completeness >= 50 && d.completeness < 80).length;
    const incompleteCount = drafts.filter(d => d.completeness < 50).length;
    const totalCount = drafts.length;
    
    // Actualizar contadores
    document.getElementById('total-drafts').textContent = totalCount;
    document.getElementById('ready-count').textContent = readyCount;
    document.getElementById('progress-count').textContent = progressCount;
    document.getElementById('incomplete-count').textContent = incompleteCount;
    document.getElementById('drafts-count').textContent = totalCount;
}

// Renderizar la lista de borradores
function renderDrafts() {
    const draftsList = document.getElementById('drafts-list');
    draftsList.innerHTML = '';
    
    drafts.forEach(draft => {
        const draftElement = document.createElement('div');
        draftElement.className = 'draft-card';
        draftElement.dataset.id = draft.id;
        
        draftElement.innerHTML = `
            <div class="draft-content">
                <!-- Header -->
                <div class="draft-header">
                    <div class="draft-info">
                        <div class="draft-meta">
                            <span class="draft-id">${draft.id}</span>
                            ${draft.priority ? `<span class="priority-badge ${getPriorityClass(draft.priority)}">${draft.priority}</span>` : ''}
                            <span class="draft-category">${draft.category}</span>
                            <div class="draft-time">
                                <i data-lucide="clock" class="draft-time-icon"></i>
                                <span>${draft.lastModified}</span>
                            </div>
                        </div>
                        <h3 class="draft-title">${draft.title}</h3>
                        <p class="draft-client">${draft.client}</p>
                    </div>
                    
                    <div class="draft-completeness">
                        <p class="completeness-label">Completitud</p>
                        <p class="completeness-value ${getCompletenessClass(draft.completeness)}">${draft.completeness}%</p>
                    </div>
                </div>
                
                <!-- Progress Bar -->
                <div class="progress-bar">
                    <div class="progress-fill ${getProgressBarClass(draft.completeness)}" style="width: ${draft.completeness}%"></div>
                </div>
                
                <!-- Missing Fields -->
                ${draft.missingFields.length > 0 ? `
                    <div class="missing-fields">
                        <p class="missing-fields-title">Campos pendientes por completar:</p>
                        <div class="missing-fields-list">
                            ${draft.missingFields.map(field => `<span class="missing-field-tag">${field}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Info Grid -->
                <div class="draft-details">
                    <div class="draft-detail">
                        <p class="detail-label">Creado</p>
                        <p class="detail-value">${draft.createdDate}</p>
                    </div>
                    <div class="draft-detail">
                        <p class="detail-label">Contacto</p>
                        <p class="detail-value">${draft.contactName || 'No asignado'}</p>
                    </div>
                    <div class="draft-detail">
                        <p class="detail-label">Tiempo Estimado</p>
                        <p class="detail-value">${draft.estimatedTime || 'No definido'}</p>
                    </div>
                    <div class="draft-detail">
                        <p class="detail-label">Estado</p>
                        <p class="detail-value ${getCompletenessClass(draft.completeness)}">
                            ${getStatusText(draft.completeness)}
                        </p>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="draft-actions">
                    <button class="btn btn-outline view-details-btn" data-draft-id="${draft.id}">
                        <i data-lucide="eye" class="btn-icon"></i>
                        Ver Detalles
                    </button>
                    <button class="btn btn-primary edit-draft-btn" data-draft-id="${draft.id}">
                        <i data-lucide="edit" class="btn-icon"></i>
                        Continuar Editando
                    </button>
                    <button class="btn ${draft.completeness >= 80 ? 'btn-success' : 'btn-success'} publish-draft-btn" data-draft-id="${draft.id}" ${draft.completeness < 80 ? 'disabled' : ''}>
                        <i data-lucide="send" class="btn-icon"></i>
                        Publicar
                    </button>
                    <button class="btn btn-danger btn-small delete-draft-btn" data-draft-id="${draft.id}">
                        <i data-lucide="trash-2" class="btn-icon"></i>
                    </button>
                </div>
            </div>
        `;
        
        draftsList.appendChild(draftElement);
    });
    
    // Re-inicializar iconos después de agregar nuevos elementos
    if (lucide) {
        lucide.createIcons();
    }
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const draftId = this.dataset.draftId;
            openDetailModal(draftId);
        });
    });
    
    document.querySelectorAll('.edit-draft-btn').forEach(button => {
        button.addEventListener('click', function() {
            const draftId = this.dataset.draftId;
            editDraft(draftId);
        });
    });
    
    document.querySelectorAll('.publish-draft-btn').forEach(button => {
        button.addEventListener('click', function() {
            const draftId = this.dataset.draftId;
            publishDraft(draftId);
        });
    });
    
    document.querySelectorAll('.delete-draft-btn').forEach(button => {
        button.addEventListener('click', function() {
            const draftId = this.dataset.draftId;
            openDeleteModal(draftId);
        });
    });
}

// Abrir modal de detalles
function openDetailModal(draftId) {
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return;
    
    currentSelectedDraft = draft;
    
    // Actualizar información del borrador en el modal
    document.getElementById('modal-draft-id').textContent = draft.id;
    document.getElementById('modal-draft-title').textContent = draft.title;
    
    // Actualizar prioridad
    const priorityElement = document.getElementById('modal-priority');
    priorityElement.textContent = draft.priority;
    priorityElement.className = `priority-badge ${getPriorityClass(draft.priority)}`;
    
    // Actualizar completitud
    document.getElementById('modal-completeness').textContent = `${draft.completeness}%`;
    document.getElementById('modal-completeness').className = `completeness-value ${getCompletenessClass(draft.completeness)}`;
    
    // Actualizar barra de progreso
    const progressBar = document.getElementById('modal-completeness-bar');
    progressBar.className = `completeness-fill ${getProgressBarClass(draft.completeness)}`;
    progressBar.style.width = `${draft.completeness}%`;
    
    // Actualizar campos faltantes
    const missingFieldsSection = document.getElementById('modal-missing-fields');
    if (draft.missingFields.length > 0) {
        missingFieldsSection.innerHTML = `
            <p class="missing-fields-title">Campos pendientes por completar:</p>
            <div class="missing-fields-tags">
                ${draft.missingFields.map(field => `<span class="missing-field-tag-large">${field}</span>`).join('')}
            </div>
        `;
        missingFieldsSection.style.display = 'block';
    } else {
        missingFieldsSection.style.display = 'none';
    }
    
    // Actualizar detalles
    document.getElementById('modal-client').textContent = draft.client;
    document.getElementById('modal-category').textContent = draft.category;
    document.getElementById('modal-created').textContent = draft.createdDate;
    document.getElementById('modal-modified').textContent = draft.lastModified;
    document.getElementById('modal-contact').textContent = draft.contactName || 'No asignado';
    document.getElementById('modal-phone').textContent = draft.contactPhone || 'No asignado';
    
    // Actualizar descripción
    const descriptionSection = document.getElementById('modal-description-section');
    if (draft.description) {
        descriptionSection.innerHTML = `
            <p class="section-title">Descripción</p>
            <div class="section-content">${draft.description}</div>
        `;
        descriptionSection.style.display = 'block';
    } else {
        descriptionSection.style.display = 'none';
    }
    
    // Actualizar notas
    const notesSection = document.getElementById('modal-notes-section');
    if (draft.notes) {
        notesSection.innerHTML = `
            <p class="section-title">Notas</p>
            <div class="section-content">${draft.notes}</div>
        `;
        notesSection.style.display = 'block';
    } else {
        notesSection.style.display = 'none';
    }
    
    // Actualizar botón de publicación
    const publishBtn = document.getElementById('publish-draft-btn');
    if (draft.completeness >= 80) {
        publishBtn.disabled = false;
        publishBtn.className = 'btn btn-success';
    } else {
        publishBtn.disabled = true;
        publishBtn.className = 'btn btn-success';
    }
    
    // Mostrar el modal
    document.getElementById('detail-modal').style.display = 'flex';
}

// Cerrar modal de detalles
function closeDetailModal() {
    document.getElementById('detail-modal').style.display = 'none';
    currentSelectedDraft = null;
}

// Abrir modal de eliminación
function openDeleteModal(draftId) {
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return;
    
    draftToDelete = draft;
    
    // Actualizar información en el modal
    document.getElementById('delete-draft-id').textContent = draft.id;
    document.getElementById('delete-draft-title').textContent = draft.title;
    
    // Mostrar el modal
    document.getElementById('delete-modal').style.display = 'flex';
}

// Cerrar modal de eliminación
function closeDeleteModal() {
    document.getElementById('delete-modal').style.display = 'none';
    draftToDelete = null;
}

// Editar borrador
function editDraft(draftId) {
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return;
    
    alert(`Editando borrador ${draft.id}`);
    closeDetailModal();
}

// Publicar borrador
function publishDraft(draftId) {
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return;
    
    if (draft.completeness < 80) {
        alert(`El borrador necesita completar los siguientes campos antes de publicar:\n${draft.missingFields.join('\n')}`);
    } else {
        alert(`Borrador ${draft.id} publicado como caso activo`);
        if (currentSelectedDraft) {
            closeDetailModal();
        }
    }
}

// Eliminar borrador
function deleteDraft() {
    if (!draftToDelete) return;
    
    // Simular eliminación
    alert(`Borrador ${draftToDelete.id} eliminado`);
    closeDeleteModal();
    
    // En una aplicación real, aquí eliminarías el borrador del array y actualizarías la interfaz
    // Por ahora, solo mostramos un mensaje
}

// Configurar event listeners
function setupEventListeners() {
    // Botones del modal de detalles
    document.getElementById('close-detail-modal').addEventListener('click', closeDetailModal);
    document.getElementById('continue-editing-btn').addEventListener('click', function() {
        if (currentSelectedDraft) {
            editDraft(currentSelectedDraft.id);
        }
    });
    document.getElementById('publish-draft-btn').addEventListener('click', function() {
        if (currentSelectedDraft) {
            publishDraft(currentSelectedDraft.id);
        }
    });
    document.getElementById('close-modal-btn').addEventListener('click', closeDetailModal);
    
    // Botones del modal de eliminación
    document.getElementById('cancel-delete-btn').addEventListener('click', closeDeleteModal);
    document.getElementById('confirm-delete-btn').addEventListener('click', deleteDraft);
    
    // Cerrar modales al hacer clic fuera de ellos
    document.getElementById('detail-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDetailModal();
        }
    });
    
    document.getElementById('delete-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDeleteModal();
        }
    });
    
    // Barra de búsqueda
    document.getElementById('search-input').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        // Filtrar borradores
        const filteredDrafts = drafts.filter(draft => 
            draft.title.toLowerCase().includes(searchTerm) ||
            draft.client.toLowerCase().includes(searchTerm) ||
            draft.id.toLowerCase().includes(searchTerm) ||
            draft.category.toLowerCase().includes(searchTerm)
        );
        
        // Actualizar estadísticas con resultados filtrados
        const readyCount = filteredDrafts.filter(d => d.completeness >= 80).length;
        const progressCount = filteredDrafts.filter(d => d.completeness >= 50 && d.completeness < 80).length;
        const incompleteCount = filteredDrafts.filter(d => d.completeness < 50).length;
        
        document.getElementById('total-drafts').textContent = filteredDrafts.length;
        document.getElementById('ready-count').textContent = readyCount;
        document.getElementById('progress-count').textContent = progressCount;
        document.getElementById('incomplete-count').textContent = incompleteCount;
        document.getElementById('drafts-count').textContent = filteredDrafts.length;
        
        // En una aplicación real, aquí renderizarías solo los borradores filtrados
        // Por ahora, solo actualizamos las estadísticas
    });
}