document.addEventListener('DOMContentLoaded', function() {
    // Datos de ejemplo para las notificaciones
    const notificacionesSistema = [
        {
            id: 1,
            tipo: 'critical',
            titulo: 'Uso de CPU por encima del 80%',
            mensaje: 'El servidor CSU-PROD-01 ha estado usando más del 80% de CPU durante los últimos 15 minutos',
            fecha: '2026-01-19 15:45',
            origen: 'Monitor Sistema',
            estado: 'unread',
            prioridad: 'high',
            icon: 'fa-server'
        },
        {
            id: 2,
            tipo: 'warning',
            titulo: 'Backup tardó más de lo esperado',
            mensaje: 'El backup automático de las 08:00 tardó 45 minutos (normal: 20 minutos)',
            fecha: '2026-01-19 08:45',
            origen: 'Servicio Backup',
            estado: 'read',
            prioridad: 'medium',
            icon: 'fa-database'
        },
        {
            id: 3,
            tipo: 'info',
            titulo: 'Actualización disponible',
            mensaje: 'CSU v2.1.1 está disponible con correcciones de seguridad',
            fecha: '2026-01-19 07:00',
            origen: 'Sistema',
            estado: 'unread',
            prioridad: 'low',
            icon: 'fa-info-circle'
        },
        {
            id: 4,
            tipo: 'security',
            titulo: 'Intento de acceso no autorizado',
            mensaje: '5 intentos fallidos de inicio de sesión desde IP 192.168.1.99',
            fecha: '2026-01-19 03:30',
            origen: 'Sistema Seguridad',
            estado: 'unread',
            prioridad: 'high',
            icon: 'fa-shield-alt'
        }
    ];

    const notificacionesUsuarios = [
        {
            id: 5,
            tipo: 'activity',
            titulo: 'Nuevo usuario registrado',
            mensaje: 'Roberto Silva ha sido registrado con rol Empleado',
            fecha: '2026-01-19 14:30',
            usuario: 'Pedro Sánchez',
            estado: 'unread',
            icon: 'fa-users'
        },
        {
            id: 6,
            tipo: 'activity',
            titulo: 'Usuario inactivado',
            mensaje: 'Diana López ha sido marcada como inactiva',
            fecha: '2026-01-19 11:00',
            usuario: 'Pedro Sánchez',
            estado: 'read',
            icon: 'fa-users'
        },
        {
            id: 7,
            tipo: 'warning',
            titulo: 'Usuario requiere reactivación',
            mensaje: 'Ana Rodríguez ha solicitado reactivación de cuenta',
            fecha: '2026-01-19 10:15',
            usuario: 'Ana Rodríguez',
            estado: 'unread',
            icon: 'fa-exclamation-triangle'
        }
    ];

    // Elementos del DOM
    const systemTab = document.getElementById('systemTab');
    const usersTab = document.getElementById('usersTab');
    const sendTab = document.getElementById('sendTab');
    const systemNotifications = document.getElementById('systemNotifications');
    const userNotifications = document.getElementById('userNotifications');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sendNotificationBtn = document.getElementById('sendNotificationBtn');
    const notificationModal = document.getElementById('notificationModal');
    const modalClose = document.querySelector('.modal-close');
    const notificationForm = document.getElementById('notificationForm');
    const btnMarkRead = document.querySelector('.btn-mark-read');

    // Actualizar estadísticas
    function updateStats() {
        const criticalCount = notificacionesSistema.filter(n => n.prioridad === 'high').length;
        const systemCount = notificacionesSistema.length;
        const systemNewCount = notificacionesSistema.filter(n => n.estado === 'unread').length;
        const usersCount = notificacionesUsuarios.length;
        const usersNewCount = notificacionesUsuarios.filter(n => n.estado === 'unread').length;
        const securityCount = notificacionesSistema.filter(n => n.tipo === 'security').length;
        const databaseCount = notificacionesSistema.filter(n => n.origen.includes('Backup') || n.origen.includes('Database')).length;
        
        // Total de sin leer
        const totalUnread = systemNewCount + usersNewCount;

        document.getElementById('criticalCount').textContent = criticalCount;
        document.getElementById('systemCount').textContent = systemCount;
        document.getElementById('systemNewCount').textContent = systemNewCount;
        document.getElementById('usersCount').textContent = usersCount;
        document.getElementById('usersNewCount').textContent = usersNewCount;
        document.getElementById('securityCount').textContent = securityCount;
        document.getElementById('databaseCount').textContent = databaseCount;
        document.querySelector('.notification-count').textContent = criticalCount;

        // Actualizar contadores en pestañas
        document.querySelectorAll('.tab-count')[0].textContent = systemCount;
        document.querySelectorAll('.tab-count')[1].textContent = usersCount;
        
        // Actualizar badge dinámicamente
        const badgeNotif = document.getElementById('badgeNotif');
        if (badgeNotif) {
            if (totalUnread > 0) {
                badgeNotif.textContent = totalUnread;
                badgeNotif.style.display = 'inline-flex';
            } else {
                badgeNotif.style.display = 'none';
            }
        }
    }

    // Renderizar notificaciones del sistema
    function renderSystemNotifications() {
        systemNotifications.innerHTML = '';
        
        notificacionesSistema.forEach(notif => {
            const notificationElement = document.createElement('div');
            notificationElement.className = `notification-item notification-${notif.tipo} notification-${notif.estado}`;
            
            let priorityText = '';
            if (notif.prioridad === 'high') priorityText = 'ALTA';
            else if (notif.prioridad === 'medium') priorityText = 'MEDIA';
            else if (notif.prioridad === 'low') priorityText = 'BAJA';
            
            notificationElement.innerHTML = `
                <div class="notification-content">
                    <div class="notification-header">
                        <div class="notification-icon-container">
                            <i class="fas ${notif.icon} notification-icon"></i>
                        </div>
                        <div class="notification-details">
                            <div class="notification-title-row">
                                <div>
                                    <h3 class="notification-title">${notif.titulo}
                                        ${notif.estado === 'unread' ? '<span class="unread-indicator"></span>' : ''}
                                    </h3>
                                    <div class="notification-meta">
                                        ${notif.prioridad ? `<span class="priority-badge priority-${notif.prioridad}">${priorityText}</span>` : ''}
                                        <span class="notification-source">${notif.origen}</span>
                                        <span class="notification-time">${notif.fecha}</span>
                                    </div>
                                </div>
                            </div>
                            <p class="notification-message">${notif.mensaje}</p>
                            <div class="notification-actions">
                                <button class="btn-view" data-id="${notif.id}">
                                    <i class="fas fa-eye"></i>
                                    Ver detalles
                                </button>
                                ${notif.prioridad === 'high' ? '<button class="btn-resolve">Resolver</button>' : ''}
                                <button class="btn-delete" data-id="${notif.id}">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            systemNotifications.appendChild(notificationElement);
        });
        
        // Añadir event listeners a los botones de eliminar
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteNotification(id, 'system');
            });
        });
    }

    // Renderizar notificaciones de usuarios
    function renderUserNotifications() {
        userNotifications.innerHTML = '';
        
        notificacionesUsuarios.forEach(notif => {
            const notificationElement = document.createElement('div');
            notificationElement.className = `notification-item notification-${notif.tipo} notification-${notif.estado}`;
            
            notificationElement.innerHTML = `
                <div class="notification-content">
                    <div class="notification-header">
                        <div class="notification-icon-container">
                            <i class="fas ${notif.icon} notification-icon"></i>
                        </div>
                        <div class="notification-details">
                            <div class="notification-title-row">
                                <div>
                                    <h3 class="notification-title">${notif.titulo}
                                        ${notif.estado === 'unread' ? '<span class="unread-indicator"></span>' : ''}
                                    </h3>
                                    <div class="notification-meta">
                                        <span class="notification-source">Por: ${notif.usuario}</span>
                                        <span class="notification-time">${notif.fecha}</span>
                                    </div>
                                </div>
                            </div>
                            <p class="notification-message">${notif.mensaje}</p>
                            <div class="notification-actions">
                                <button class="btn-resolve">
                                    Ver usuario
                                </button>
                                <button class="btn-delete" data-id="${notif.id}">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            userNotifications.appendChild(notificationElement);
        });
        
        // Añadir event listeners a los botones de eliminar
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteNotification(id, 'users');
            });
        });
    }

    // Eliminar notificación
    function deleteNotification(id, type) {
        if (confirm('¿Está seguro de que desea eliminar esta notificación?')) {
            if (type === 'system') {
                const index = notificacionesSistema.findIndex(n => n.id === id);
                if (index !== -1) {
                    notificacionesSistema.splice(index, 1);
                    renderSystemNotifications();
                }
            } else {
                const index = notificacionesUsuarios.findIndex(n => n.id === id);
                if (index !== -1) {
                    notificacionesUsuarios.splice(index, 1);
                    renderUserNotifications();
                }
            }
            updateStats();
        }
    }

    // Cambiar entre pestañas
    function switchTab(tabId) {
        // Ocultar todas las pestañas
        systemTab.classList.remove('active');
        usersTab.classList.remove('active');
        sendTab.classList.remove('active');
        
        // Remover clase active de todos los botones
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Mostrar la pestaña seleccionada
        if (tabId === 'system') {
            systemTab.classList.add('active');
            document.querySelector('[data-tab="system"]').classList.add('active');
        } else if (tabId === 'users') {
            usersTab.classList.add('active');
            document.querySelector('[data-tab="users"]').classList.add('active');
        } else if (tabId === 'send') {
            sendTab.classList.add('active');
            document.querySelector('[data-tab="send"]').classList.add('active');
        }
    }

    // Marcar todas como leídas
    function markAllAsRead() {
        notificacionesSistema.forEach(notif => notif.estado = 'read');
        notificacionesUsuarios.forEach(notif => notif.estado = 'read');
        
        renderSystemNotifications();
        renderUserNotifications();
        updateStats();
        
        alert('Todas las notificaciones han sido marcadas como leídas.');
    }

    // Filtrar notificaciones
    function setupFilterButtons() {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover active de todos los botones de filtro en el mismo contenedor
                this.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                // Añadir active al botón clickeado
                this.classList.add('active');
                
                // Aquí se implementaría la lógica de filtrado real
                // Por ahora solo mostramos un mensaje
                console.log('Filtrando por: ' + this.textContent);
            });
        });
    }

    // Inicializar
    function init() {
        // Renderizar notificaciones iniciales
        renderSystemNotifications();
        renderUserNotifications();
        updateStats();
        
        // Configurar event listeners para las pestañas
        tabButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                switchTab(tabId);
            });
        });
        
        // Configurar botones de filtro
        setupFilterButtons();
        
        // Configurar botón "Marcar todas como leídas"
        if (btnMarkRead) {
            btnMarkRead.addEventListener('click', markAllAsRead);
        }
        
        // Configurar botón "Enviar Notificación" en el header
        if (sendNotificationBtn) {
            sendNotificationBtn.addEventListener('click', function() {
                switchTab('send');
            });
        }
        
        // Configurar modal
        if (modalClose) {
            modalClose.addEventListener('click', function() {
                notificationModal.style.display = 'none';
            });
        }
        
        // Configurar formulario de notificación
        if (notificationForm) {
            notificationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const title = document.getElementById('notificationTitle').value;
                const message = document.getElementById('notificationMessage').value;
                const type = document.getElementById('notificationType').value;
                const recipients = document.getElementById('recipients').value;
                
                if (title.trim() && message.trim()) {
                    alert(`Notificación enviada exitosamente a: ${recipients}\nTipo: ${type}\nTítulo: ${title}`);
                    
                    // Resetear formulario
                    notificationForm.reset();
                    
                    // Cambiar a la pestaña de sistema
                    switchTab('system');
                } else {
                    alert('Por favor complete todos los campos requeridos.');
                }
            });
        }
        
        // Cerrar modal al hacer clic fuera de él
        window.addEventListener('click', function(e) {
            if (e.target === notificationModal) {
                notificationModal.style.display = 'none';
            }
        });
    }

    // Inicializar la aplicación
    init();
});