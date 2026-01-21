document.addEventListener('DOMContentLoaded', function() {
    // Datos de ejemplo
    const systemStatus = {
        servidor: {
            nombre: 'CSU-PROD-01',
            estado: 'Operativo',
            uptime: '45 días 12:34:56',
            cpu: 34,
            ram: 62,
            disco: 45,
            red: 'Normal'
        },
        baseDatos: {
            motor: 'PostgreSQL 15.2',
            estado: 'Activo',
            conexiones: 42,
            maxConexiones: 100,
            tamaño: '2.4 GB',
            ultimoBackup: '2026-01-19 08:00'
        },
        aplicacion: {
            version: 'CSU v2.1.0',
            estado: 'Operativo',
            usuariosConectados: 12,
            solicitudesPorMinuto: 145,
            tiempoRespuesta: '234ms'
        }
    };

    const servicios = [
        { nombre: 'API REST', puerto: 8080, estado: 'Activo', pid: 1234, memoria: '456 MB', cpu: '12%' },
        { nombre: 'WebSocket Server', puerto: 8081, estado: 'Activo', pid: 1235, memoria: '234 MB', cpu: '8%' },
        { nombre: 'Worker Queue', puerto: 6379, estado: 'Activo', pid: 1236, memoria: '128 MB', cpu: '5%' },
        { nombre: 'Mail Service', puerto: 5432, estado: 'Activo', pid: 1237, memoria: '89 MB', cpu: '3%' },
        { nombre: 'Backup Scheduler', puerto: null, estado: 'Activo', pid: 1238, memoria: '45 MB', cpu: '1%' }
    ];

    const logs = [
        { nivel: 'INFO', timestamp: '2026-01-19 15:45:23', mensaje: 'Usuario admin@colsof.com.co inició sesión', servicio: 'auth' },
        { nivel: 'INFO', timestamp: '2026-01-19 15:44:10', mensaje: 'Caso C-10245 creado exitosamente', servicio: 'api' },
        { nivel: 'WARNING', timestamp: '2026-01-19 15:42:05', mensaje: 'Tiempo de respuesta mayor a 500ms detectado', servicio: 'monitor' },
        { nivel: 'INFO', timestamp: '2026-01-19 15:40:30', mensaje: 'Backup automático completado', servicio: 'backup' },
        { nivel: 'ERROR', timestamp: '2026-01-19 15:38:15', mensaje: 'Intento de acceso no autorizado desde IP 192.168.1.99', servicio: 'security' },
        { nivel: 'INFO', timestamp: '2026-01-19 15:35:00', mensaje: 'Cache limpiado exitosamente', servicio: 'cache' }
    ];

    const configuraciones = [
        { categoria: 'General', clave: 'app.name', valor: 'CSU - Centro de Soporte', tipo: 'texto' },
        { categoria: 'General', clave: 'app.version', valor: '2.1.0', tipo: 'texto' },
        { categoria: 'Seguridad', clave: 'session.timeout', valor: '30', tipo: 'número' },
        { categoria: 'Seguridad', clave: 'password.min_length', valor: '8', tipo: 'número' },
        { categoria: 'Seguridad', clave: 'max_login_attempts', valor: '5', tipo: 'número' },
        { categoria: 'Email', clave: 'smtp.host', valor: 'smtp.colsof.com.co', tipo: 'texto' },
        { categoria: 'Email', clave: 'smtp.port', valor: '587', tipo: 'número' },
        { categoria: 'Database', clave: 'db.pool_size', valor: '20', tipo: 'número' },
        { categoria: 'Database', clave: 'db.backup_enabled', valor: 'true', tipo: 'booleano' },
        { categoria: 'Performance', clave: 'cache.enabled', valor: 'true', tipo: 'booleano' },
        { categoria: 'Performance', clave: 'cache.ttl', valor: '3600', tipo: 'número' }
    ];

    // Elementos del DOM
    const refreshBtn = document.getElementById('refreshBtn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const systemTab = document.getElementById('systemTab');
    const servicesTab = document.getElementById('servicesTab');
    const logsTab = document.getElementById('logsTab');
    const configTab = document.getElementById('configTab');
    const servicesTableBody = document.getElementById('servicesTableBody');
    const logsList = document.getElementById('logsList');
    const configSections = document.querySelector('.config-sections');
    const logFilterButtons = document.querySelectorAll('.log-filter-btn');
    const exportBtn = document.querySelector('.btn-export');
    const importBtn = document.querySelector('.btn-import');
    const resetBtn = document.querySelector('.btn-reset');
    const saveBtn = document.querySelector('.btn-save');

    // Actualizar métricas del sistema
    function updateSystemMetrics() {
        // Actualizar valores de CPU, RAM, Disco
        document.getElementById('cpuValue').textContent = `${systemStatus.servidor.cpu}%`;
        document.querySelector('.cpu-progress').style.width = `${systemStatus.servidor.cpu}%`;
        
        document.getElementById('ramValue').textContent = `${systemStatus.servidor.ram}%`;
        document.querySelector('.ram-progress').style.width = `${systemStatus.servidor.ram}%`;
        
        document.getElementById('diskValue').textContent = `${systemStatus.servidor.disco}%`;
        document.querySelector('.disk-progress').style.width = `${systemStatus.servidor.disco}%`;
        
        document.getElementById('uptimeValue').textContent = systemStatus.servidor.uptime;
        document.getElementById('dbEngine').textContent = systemStatus.baseDatos.motor;
        document.getElementById('dbConnections').textContent = `${systemStatus.baseDatos.conexiones}/${systemStatus.baseDatos.maxConexiones}`;
        document.getElementById('dbSize').textContent = systemStatus.baseDatos.tamaño;
        document.getElementById('lastBackup').textContent = systemStatus.baseDatos.ultimoBackup;
        document.getElementById('appVersion').textContent = systemStatus.aplicacion.version;
        document.getElementById('activeUsers').textContent = systemStatus.aplicacion.usuariosConectados;
        document.getElementById('requestsPerMin').textContent = systemStatus.aplicacion.solicitudesPorMinuto;
        document.getElementById('responseTime').textContent = systemStatus.aplicacion.tiempoRespuesta;
    }

    // Renderizar tabla de servicios
    function renderServicesTable() {
        servicesTableBody.innerHTML = '';
        
        servicios.forEach(servicio => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${servicio.nombre}</td>
                <td>${servicio.puerto || 'N/A'}</td>
                <td>${servicio.pid}</td>
                <td>${servicio.memoria}</td>
                <td>${servicio.cpu}</td>
                <td>
                    <span class="status-badge-small">
                        <i class="fas fa-check-circle"></i>
                        ${servicio.estado}
                    </span>
                </td>
                <td>
                    <div class="service-actions">
                        <button class="btn-restart" data-service="${servicio.nombre}">
                            Reiniciar
                        </button>
                        <button class="btn-stop" data-service="${servicio.nombre}">
                            Detener
                        </button>
                    </div>
                </td>
            `;
            
            servicesTableBody.appendChild(row);
        });
        
        // Añadir event listeners a los botones de acción
        document.querySelectorAll('.btn-restart').forEach(btn => {
            btn.addEventListener('click', function() {
                const serviceName = this.getAttribute('data-service');
                restartService(serviceName);
            });
        });
        
        document.querySelectorAll('.btn-stop').forEach(btn => {
            btn.addEventListener('click', function() {
                const serviceName = this.getAttribute('data-service');
                stopService(serviceName);
            });
        });
    }

    // Renderizar logs
    function renderLogs(filter = 'all') {
        logsList.innerHTML = '';
        
        const filteredLogs = filter === 'all' 
            ? logs 
            : logs.filter(log => log.nivel === filter);
        
        filteredLogs.forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry log-${log.nivel.toLowerCase()}`;
            
            logEntry.innerHTML = `
                <div class="log-header">
                    <span class="log-level log-level-${log.nivel.toLowerCase()}">${log.nivel}</span>
                    <span class="log-service">[${log.servicio}]</span>
                    <span class="log-timestamp">${log.timestamp}</span>
                </div>
                <div class="log-message">${log.mensaje}</div>
            `;
            
            logsList.appendChild(logEntry);
        });
    }

    // Renderizar configuración
    function renderConfiguration() {
        configSections.innerHTML = '';
        
        // Obtener categorías únicas
        const categorias = [...new Set(configuraciones.map(c => c.categoria))];
        
        categorias.forEach(categoria => {
            const section = document.createElement('div');
            section.className = 'config-section';
            
            let sectionHTML = `<h3 class="section-title">${categoria}</h3>`;
            sectionHTML += `<div class="config-grid">`;
            
            const configs = configuraciones.filter(c => c.categoria === categoria);
            
            configs.forEach(config => {
                sectionHTML += `
                    <div class="config-item">
                        <label class="config-label">${config.clave}</label>
                        ${config.tipo === 'booleano' 
                            ? `<select class="config-input" data-key="${config.clave}">
                                <option value="true" ${config.valor === 'true' ? 'selected' : ''}>Activado</option>
                                <option value="false" ${config.valor === 'false' ? 'selected' : ''}>Desactivado</option>
                               </select>`
                            : `<input type="${config.tipo === 'número' ? 'number' : 'text'}" 
                                     class="config-input" 
                                     data-key="${config.clave}"
                                     value="${config.valor}">`
                        }
                    </div>
                `;
            });
            
            sectionHTML += `</div>`;
            section.innerHTML = sectionHTML;
            configSections.appendChild(section);
        });
    }

    // Funciones de acción
    function restartService(serviceName) {
        if (confirm(`¿Está seguro de que desea reiniciar el servicio "${serviceName}"?`)) {
            alert(`Reiniciando servicio: ${serviceName}`);
            // Aquí iría la lógica real para reiniciar el servicio
        }
    }

    function stopService(serviceName) {
        if (confirm(`¿Está seguro de que desea detener el servicio "${serviceName}"?`)) {
            alert(`Deteniendo servicio: ${serviceName}`);
            // Aquí iría la lógica real para detener el servicio
        }
    }

    function exportLogs() {
        alert('Exportando logs...');
        // Aquí iría la lógica real para exportar logs
    }

    function importConfiguration() {
        alert('Importando configuración...');
        // Aquí iría la lógica real para importar configuración
    }

    function resetConfiguration() {
        if (confirm('¿Está seguro de que desea restablecer la configuración a los valores predeterminados?')) {
            renderConfiguration();
            alert('Configuración restablecida a valores predeterminados.');
        }
    }

    function saveConfiguration() {
        // Recopilar todos los valores de configuración
        const configInputs = document.querySelectorAll('.config-input');
        const updatedConfig = [];
        
        configInputs.forEach(input => {
            updatedConfig.push({
                clave: input.getAttribute('data-key'),
                valor: input.value
            });
        });
        
        alert('Configuración guardada exitosamente.');
        console.log('Configuración actualizada:', updatedConfig);
        // Aquí iría la lógica real para guardar la configuración
    }

    // Cambiar entre pestañas
    function switchTab(tabId) {
        // Ocultar todas las pestañas
        systemTab.classList.remove('active');
        servicesTab.classList.remove('active');
        logsTab.classList.remove('active');
        configTab.classList.remove('active');
        
        // Remover clase active de todos los botones
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Mostrar la pestaña seleccionada
        if (tabId === 'system') {
            systemTab.classList.add('active');
            document.querySelector('[data-tab="system"]').classList.add('active');
        } else if (tabId === 'services') {
            servicesTab.classList.add('active');
            document.querySelector('[data-tab="services"]').classList.add('active');
        } else if (tabId === 'logs') {
            logsTab.classList.add('active');
            document.querySelector('[data-tab="logs"]').classList.add('active');
        } else if (tabId === 'config') {
            configTab.classList.add('active');
            document.querySelector('[data-tab="config"]').classList.add('active');
        }
    }

    // Actualizar datos (simulación)
    function refreshData() {
        // Añadir animación de giro al botón
        const icon = refreshBtn.querySelector('i');
        icon.classList.add('refreshing');
        
        // Simular actualización de datos
        setTimeout(() => {
            // Actualizar métricas con valores aleatorios (simulación)
            systemStatus.servidor.cpu = Math.floor(Math.random() * 30) + 20;
            systemStatus.servidor.ram = Math.floor(Math.random() * 30) + 40;
            systemStatus.servidor.disco = Math.floor(Math.random() * 10) + 40;
            systemStatus.baseDatos.conexiones = Math.floor(Math.random() * 30) + 30;
            systemStatus.aplicacion.usuariosConectados = Math.floor(Math.random() * 10) + 5;
            systemStatus.aplicacion.solicitudesPorMinuto = Math.floor(Math.random() * 50) + 100;
            systemStatus.aplicacion.tiempoRespuesta = `${Math.floor(Math.random() * 100) + 200}ms`;
            
            // Actualizar UI
            updateSystemMetrics();
            
            // Remover animación
            icon.classList.remove('refreshing');
            
            alert('Datos actualizados exitosamente.');
        }, 1000);
    }

    // Inicializar
    function init() {
        // Inicializar datos
        updateSystemMetrics();
        renderServicesTable();
        renderLogs();
        renderConfiguration();
        
        // Configurar event listeners para las pestañas
        tabButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                switchTab(tabId);
            });
        });
        
        // Configurar botón de actualización
        refreshBtn.addEventListener('click', refreshData);
        
        // Configurar filtros de logs
        logFilterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover active de todos los botones de filtro
                logFilterButtons.forEach(b => b.classList.remove('active'));
                // Añadir active al botón clickeado
                this.classList.add('active');
                
                // Filtrar logs
                const filter = this.textContent === 'Todos' ? 'all' : this.textContent;
                renderLogs(filter);
            });
        });
        
        // Configurar botones de acción
        if (exportBtn) {
            exportBtn.addEventListener('click', exportLogs);
        }
        
        if (importBtn) {
            importBtn.addEventListener('click', importConfiguration);
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', resetConfiguration);
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', saveConfiguration);
        }
    }

    // Inicializar la aplicación
    init();
});