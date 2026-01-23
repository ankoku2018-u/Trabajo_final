import postgres from 'postgres';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configPath = join(__dirname, '..', 'Config.env');
const configContent = readFileSync(configPath, 'utf8');
const dbUrlLine = configContent.split('\n').find(line => line.startsWith('DATABASE_URL='));
const DATABASE_URL = dbUrlLine ? dbUrlLine.split('=')[1].trim() : null;

const sql = postgres(DATABASE_URL);

function hashPassword(password) {
  return Buffer.from(password).toString('base64');
}

async function fillDatabase() {
  try {
    console.log('\n📝 Llenando tablas con datos realistas del CSU...\n');

    // Limpiar tablas
    console.log('🧹 Limpiando tablas existentes...');
    await sql`TRUNCATE TABLE base_de_datos_csu.informe_has_administrador CASCADE`;
    await sql`TRUNCATE TABLE base_de_datos_csu.informe CASCADE`;
    await sql`TRUNCATE TABLE base_de_datos_csu.seguimiento CASCADE`;
    await sql`TRUNCATE TABLE base_de_datos_csu.archivo CASCADE`;
    await sql`TRUNCATE TABLE base_de_datos_csu.ticket CASCADE`;
    await sql`TRUNCATE TABLE base_de_datos_csu.categoria CASCADE`;
    await sql`TRUNCATE TABLE base_de_datos_csu.tecnico CASCADE`;
    await sql`TRUNCATE TABLE base_de_datos_csu.gestor CASCADE`;
    await sql`TRUNCATE TABLE base_de_datos_csu.cliente CASCADE`;
    await sql`TRUNCATE TABLE base_de_datos_csu.administrador CASCADE`;
    await sql`TRUNCATE TABLE base_de_datos_csu.ususario CASCADE`;
    console.log('✅ Tablas limpias\n');

    // 1. Insertar administrador
    console.log('➕ Insertando administrador...');
    const adminResult = await sql`
      INSERT INTO base_de_datos_csu.administrador (nivel_acceso, fecha_asignacion)
      VALUES ('Total', now()::date)
      RETURNING id_administrador
    `;
    const adminId = adminResult[0].id_administrador;
    console.log(`✅ Administrador insertado (ID: ${adminId})`);

    // 2. Insertar Usuarios
    console.log('➕ Insertando usuarios...');
    const usuarios = await sql`
      INSERT INTO base_de_datos_csu.ususario (nombre_usuario, correo, contrasena, rol, fecha_creacion, fecha_modificacion, estado, administrador_id_administrador)
      VALUES
        ('juan.garcia', 'juan.garcia@colsof.com', ${hashPassword('pass123')}, 'Administrador', now(), now(), 'Activo', ${adminId}),
        ('maria.rodriguez', 'maria.rodriguez@colsof.com', ${hashPassword('pass123')}, 'Gestor', now(), now(), 'Activo', ${adminId}),
        ('carlos.diaz', 'carlos.diaz@colsof.com', ${hashPassword('pass123')}, 'Tecnico', now(), now(), 'Activo', ${adminId}),
        ('ana.lopez', 'ana.lopez@colsof.com', ${hashPassword('pass123')}, 'Tecnico', now(), now(), 'Activo', ${adminId}),
        ('roberto.martinez', 'roberto.martinez@colsof.com', ${hashPassword('pass123')}, 'Tecnico', now(), now(), 'Activo', ${adminId}),
        ('sandra.gomez', 'sandra.gomez@colsof.com', ${hashPassword('pass123')}, 'Gestor', now(), now(), 'Activo', ${adminId}),
        ('luis.sanchez', 'luis.sanchez@colsof.com', ${hashPassword('pass123')}, 'Tecnico', now(), now(), 'Activo', ${adminId}),
        ('patricia.cruz', 'patricia.cruz@colsof.com', ${hashPassword('pass123')}, 'Administrador', now(), now(), 'Activo', ${adminId})
      RETURNING id_usuario
    `;
    const userIds = usuarios.map(u => u.id_usuario);
    console.log(`✅ ${usuarios.length} usuarios insertados`);

    // 3. Insertar Gestores
    console.log('➕ Insertando gestores...');
    const gestores = await sql`
      INSERT INTO base_de_datos_csu.gestor (especialidad, fecha_asignacion, ususario_id_usuario, ususario_administrador_id_administrador)
      VALUES
        ('Soporte General', now()::date, ${userIds[1]}, ${adminId}),
        ('Desarrollo', now()::date, ${userIds[5]}, ${adminId})
      RETURNING id_gestor
    `;
    const gestorIds = gestores.map(g => g.id_gestor);
    console.log(`✅ ${gestores.length} gestores insertados`);

    // 4. Insertar Técnicos
    console.log('➕ Insertando técnicos...');
    const tecnicos = await sql`
      INSERT INTO base_de_datos_csu.tecnico (especializacion, certificacion, disponibilidad, ticket_maximo, fecha_asignacion, ususario_id_usuario, ususario_administrador_id_administrador)
      VALUES
        ('Redes y Conectividad', 'Cisco CCNA', 'Disponible', 5, now()::date, ${userIds[2]}, ${adminId}),
        ('Base de Datos', 'Oracle DBA', 'Disponible', 4, now()::date, ${userIds[3]}, ${adminId}),
        ('Seguridad Informática', 'CompTIA Security+', 'Disponible', 3, now()::date, ${userIds[4]}, ${adminId}),
        ('Hardware', 'CompTIA A+', 'Disponible', 6, now()::date, ${userIds[6]}, ${adminId})
      RETURNING id_tecnico
    `;
    const tecnicoIds = tecnicos.map(t => t.id_tecnico);
    console.log(`✅ ${tecnicos.length} técnicos insertados`);

    // 5. Insertar Clientes
    console.log('➕ Insertando clientes...');
    const clientes = await sql`
      INSERT INTO base_de_datos_csu.cliente (empresa, sede, direccion, contacto_principal, telefono_principal, contacto_secundario, telefono_secundario, correo, fecha_creacion)
      VALUES
        ('Empresa A S.A.S', 'Bogotá', 'Carrera 5 No. 12-34', 'Jorge Acosta', '3101234567', 'María López', '3101234568', 'contacto@empresaa.com', now()),
        ('Soluciones B Ltda', 'Medellín', 'Calle 45 No. 67-89', 'Pedro Ruiz', '3102345678', 'Laura Gómez', '3102345679', 'info@solucionesb.com', now()),
        ('Consultoria C SAS', 'Cali', 'Carrera 10 No. 10-10', 'Andrés Vega', '3103456789', 'Isabel Torres', '3103456790', 'contacto@consultoriac.com', now()),
        ('Servicios D S.A.S', 'Barranquilla', 'Calle 80 No. 50-50', 'Fernando Díaz', '3104567890', 'Rosa Martínez', '3104567891', 'info@serviciosd.com', now()),
        ('Tecnología E Ltda', 'Bogotá', 'Avenida El Dorado 123', 'Camila García', '3105678901', 'Diego López', '3105678902', 'contacto@tecnologiae.com', now())
      RETURNING id_cliente
    `;
    const clienteIds = clientes.map(c => c.id_cliente);
    console.log(`✅ ${clientes.length} clientes insertados`);

    // 6. Insertar Categorías
    console.log('➕ Insertando categorías...');
    const categorias = await sql`
      INSERT INTO base_de_datos_csu.categoria (nombre_categoria, prioridad, clasificacion, tiempo_respuesta, notificacion, descripcion, estado, fecha_creacion)
      VALUES
        ('Hardware', 'Alta', 'Crítica', 2, true, 'Problemas relacionados con hardware y equipos físicos', 'Activa', now()),
        ('Software', 'Media', 'Normal', 4, true, 'Problemas relacionados con software y aplicaciones', 'Activa', now()),
        ('Conectividad', 'Alta', 'Crítica', 1, true, 'Problemas de red e internet', 'Activa', now()),
        ('Seguridad', 'Alta', 'Crítica', 1, true, 'Problemas de seguridad informática', 'Activa', now()),
        ('Consultoría', 'Media', 'Normal', 8, false, 'Servicios de consultoría y asesoría', 'Activa', now()),
        ('Mantenimiento', 'Baja', 'Preventiva', 24, false, 'Servicios de mantenimiento preventivo', 'Activa', now())
      RETURNING id_categoria
    `;
    const categoriaIds = categorias.map(c => c.id_categoria);
    console.log(`✅ ${categorias.length} categorías insertadas`);

    // 7. Primero crear seguimientos sin referenciar tickets
    console.log('➕ Insertando seguimientos base...');
    const seguimientos = await sql`
      INSERT INTO base_de_datos_csu.seguimiento (id_ticket, id_usuario, fecha, comentarios, tipo, estado_anterior, estado_nuevo)
      VALUES
        (1, ${userIds[2]}, now(), 'Se inició diagnóstico del servidor', 'asignacion', 'abierto', 'en_progreso'),
        (2, ${userIds[3]}, now() - interval '1 hours', 'Se identificó problema en código', 'cambio_estado', 'abierto', 'en_progreso'),
        (3, ${userIds[4]}, now() - interval '30 minutes', 'Se ejecutó test de velocidad', 'comentario', 'abierto', 'abierto'),
        (4, ${userIds[5]}, now(), 'Actualización antivirus requerida', 'asignacion', 'abierto', 'en_progreso'),
        (5, ${userIds[3]}, now() - interval '12 hours', 'Reinicio de base de datos completado', 'cambio_estado', 'abierto', 'en_progreso'),
        (6, ${userIds[4]}, now() - interval '5 days', 'Auditoría iniciada', 'asignacion', 'abierto', 'en_progreso'),
        (7, ${userIds[6]}, now() - interval '5 days', 'Se reemplazó pantalla', 'cambio_estado', 'en_progreso', 'cerrado'),
        (8, ${userIds[3]}, now() - interval '8 days', 'Mantenimiento completado exitosamente', 'cambio_estado', 'en_progreso', 'cerrado')
      RETURNING id_seguimiento
    `;
    const seguimientoIds = seguimientos.map(s => s.id_seguimiento);
    console.log(`✅ ${seguimientos.length} seguimientos insertados`);

    // 8. Insertar Tickets
    console.log('➕ Insertando tickets...');
    const tickets = await sql`
      INSERT INTO base_de_datos_csu.ticket (
        estado, id_cliente, id_tecnico, id_gestor, descripcion, 
        fecha_creacion, fecha_actualizacion, cliente_id_cliente, 
        gestor_id_gestor, gestor_ususario_id_usuario, gestor_ususario_administrador_id_administrador,
        tecnico_id_tecnico, tecnico_ususario_id_usuario, tecnico_ususario_administrador_id_administrador,
        seguimiento_id_seguimiento, categoria_id_categoria
      )
      VALUES
        ('abierto', ${clienteIds[0]}, ${tecnicoIds[0]}, ${gestorIds[0]}, 'Falla en servidor principal - No enciende correctamente', now(), now(), ${clienteIds[0]}, ${gestorIds[0]}, ${userIds[1]}, ${adminId}, ${tecnicoIds[0]}, ${userIds[2]}, ${adminId}, ${seguimientoIds[0]}, ${categoriaIds[0]}),
        ('abierto', ${clienteIds[1]}, ${tecnicoIds[1]}, ${gestorIds[1]}, 'Error en aplicación web - Error 500', now(), now(), ${clienteIds[1]}, ${gestorIds[1]}, ${userIds[5]}, ${adminId}, ${tecnicoIds[1]}, ${userIds[3]}, ${adminId}, ${seguimientoIds[1]}, ${categoriaIds[1]}),
        ('abierto', ${clienteIds[2]}, ${tecnicoIds[2]}, ${gestorIds[0]}, 'Internet lento - Velocidad muy baja', now(), now(), ${clienteIds[2]}, ${gestorIds[0]}, ${userIds[1]}, ${adminId}, ${tecnicoIds[2]}, ${userIds[4]}, ${adminId}, ${seguimientoIds[2]}, ${categoriaIds[2]}),
        ('abierto', ${clienteIds[0]}, ${tecnicoIds[3]}, ${gestorIds[1]}, 'Antivirus necesario - Actualización requerida', now(), now(), ${clienteIds[0]}, ${gestorIds[1]}, ${userIds[5]}, ${adminId}, ${tecnicoIds[3]}, ${userIds[6]}, ${adminId}, ${seguimientoIds[3]}, ${categoriaIds[3]}),
        ('en_progreso', ${clienteIds[3]}, ${tecnicoIds[1]}, ${gestorIds[0]}, 'Problema en base de datos - No responde', now() - interval '2 days', now(), ${clienteIds[3]}, ${gestorIds[0]}, ${userIds[1]}, ${adminId}, ${tecnicoIds[1]}, ${userIds[3]}, ${adminId}, ${seguimientoIds[4]}, ${categoriaIds[1]}),
        ('en_progreso', ${clienteIds[4]}, ${tecnicoIds[2]}, ${gestorIds[1]}, 'Consultoría en seguridad - Auditoría requerida', now() - interval '5 days', now(), ${clienteIds[4]}, ${gestorIds[1]}, ${userIds[5]}, ${adminId}, ${tecnicoIds[2]}, ${userIds[4]}, ${adminId}, ${seguimientoIds[5]}, ${categoriaIds[4]}),
        ('cerrado', ${clienteIds[1]}, ${tecnicoIds[3]}, ${gestorIds[0]}, 'Reparación de computadora - Pantalla dañada', now() - interval '10 days', now() - interval '5 days', ${clienteIds[1]}, ${gestorIds[0]}, ${userIds[1]}, ${adminId}, ${tecnicoIds[3]}, ${userIds[6]}, ${adminId}, ${seguimientoIds[6]}, ${categoriaIds[0]}),
        ('cerrado', ${clienteIds[2]}, ${tecnicoIds[1]}, ${gestorIds[1]}, 'Mantenimiento preventivo - Limpieza y actualización', now() - interval '15 days', now() - interval '8 days', ${clienteIds[2]}, ${gestorIds[1]}, ${userIds[5]}, ${adminId}, ${tecnicoIds[1]}, ${userIds[3]}, ${adminId}, ${seguimientoIds[7]}, ${categoriaIds[5]})
      RETURNING id_ticket
    `;
    console.log(`✅ ${tickets.length} tickets insertados`);

    // 9. Insertar Archivos
    console.log('➕ Insertando archivos...');
    const archivos = await sql`
      INSERT INTO base_de_datos_csu.archivo (
        id_ticket, tipo_archivo, nombre_archivo, ruta_archivo, tamanio_kb, fecha_creacion,
        tecnico_id_tecnico, tecnico_ususario_id_usuario, tecnico_ususario_administrador_id_administrador,
        gestor_id_gestor, gestor_ususario_id_usuario, gestor_ususario_administrador_id_administrador
      )
      VALUES
        (1, 'pdf', 'informe_servidor.pdf', '/uploads/tickets/1/informe_servidor.pdf', 2048, now(), ${tecnicoIds[0]}, ${userIds[2]}, ${adminId}, ${gestorIds[0]}, ${userIds[1]}, ${adminId}),
        (2, 'imagen', 'captura_error.png', '/uploads/tickets/2/captura_error.png', 512, now() - interval '1 hours', ${tecnicoIds[1]}, ${userIds[3]}, ${adminId}, ${gestorIds[1]}, ${userIds[5]}, ${adminId}),
        (5, 'otro', 'logs_bd.txt', '/uploads/tickets/5/logs_bd.txt', 1024, now() - interval '12 hours', ${tecnicoIds[1]}, ${userIds[3]}, ${adminId}, ${gestorIds[0]}, ${userIds[1]}, ${adminId}),
        (7, 'pdf', 'factura_pantalla.pdf', '/uploads/tickets/7/factura_pantalla.pdf', 1536, now() - interval '5 days', ${tecnicoIds[3]}, ${userIds[6]}, ${adminId}, ${gestorIds[0]}, ${userIds[1]}, ${adminId})
      RETURNING id_archivo
    `;
    console.log(`✅ ${archivos.length} archivos insertados`);

    // 10. Insertar Informes
    console.log('➕ Insertando informes...');
    const informes = await sql`
      INSERT INTO base_de_datos_csu.informe (id_usuario, tipo_informe, fecha_generacion, descripcion)
      VALUES
        (${userIds[6]}, 'clientes', now() - interval '5 days', 'Se reemplazó pantalla defectuosa. Equipo operativo. Pruebas completadas exitosamente. Usuario satisfecho con el servicio.'),
        (${userIds[3]}, 'rendimiento', now() - interval '8 days', 'Se realizó limpieza de equipos, actualización de drivers y antivirus. Sistema optimizado. Sin problemas detectados. Rendimiento mejorado en 30%.'),
        (${userIds[3]}, 'auditoria', now() - interval '12 hours', 'Base de datos restaurada. Se realizaron backups completos. Performance mejorada en 45%. Sin errores. Validación completada.')
      RETURNING id_informe
    `;
    const informeIds = informes.map(i => i.id_informe);
    console.log(`✅ ${informes.length} informes insertados`);

    // 11. Insertar relaciones Informe-Administrador
    console.log('➕ Insertando relaciones informe-administrador...');
    await sql`
      INSERT INTO base_de_datos_csu.informe_has_administrador (informe_id_informe, administrador_id_administrador)
      VALUES
        (${informeIds[0]}, ${adminId}),
        (${informeIds[1]}, ${adminId}),
        (${informeIds[2]}, ${adminId})
    `;
    console.log(`✅ 3 relaciones informe-administrador insertadas`);

    console.log('\n✅ Base de datos llenada exitosamente con datos realistas del CSU\n');
    console.log('📊 Resumen de datos insertados:');
    console.log(`   • ${usuarios.length} Usuarios`);
    console.log(`   • ${gestores.length} Gestores`);
    console.log(`   • ${tecnicos.length} Técnicos`);
    console.log(`   • ${clientes.length} Clientes`);
    console.log(`   • ${categorias.length} Categorías`);
    console.log(`   • ${tickets.length} Tickets`);
    console.log(`   • ${seguimientos.length} Seguimientos`);
    console.log(`   • ${archivos.length} Archivos`);
    console.log(`   • ${informes.length} Informes\n`);

  } catch (err) {
    console.error('❌ Error al llenar la base de datos:', err.message);
    console.error(err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

fillDatabase();
