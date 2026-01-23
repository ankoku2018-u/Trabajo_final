// Script para probar que el API está trayendo datos correctamente
import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';

// Leer DATABASE_URL del archivo Config.env
const envPath = path.join(process.cwd(), 'Config.env');
let DATABASE_URL = '';

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/DATABASE_URL=(.+)/);
    if (match) {
        DATABASE_URL = match[1].trim();
    }
} else {
    console.error('Archivo Config.env no encontrado');
    process.exit(1);
}

async function testCasesAPI() {
    console.log('=== PRUEBA DE CASOS API ===\n');
    console.log('DATABASE_URL:', DATABASE_URL.substring(0, 50) + '...\n');
    
    try {
        const sql = postgres(DATABASE_URL);
        
        // 1. Verificar conexión
        console.log('✓ Conexión exitosa\n');
        
        // 2. Contar tickets
        const countResult = await sql`
            SELECT COUNT(*) as total FROM base_de_datos_csu.ticket
        `;
        console.log(`--- Total de tickets: ${countResult[0].total} ---\n`);
        
        // 3. Ejecutar la misma query que el API
        console.log('--- Ejecutando query del API (get_cases_list) ---\n');
        
        const cases = await sql`
            SELECT 
                t.id_ticket as id, 
                t.fecha_creacion, 
                u.nombre_usuario as asignado_a, 
                t.estado,
                cat.prioridad, 
                cat.nombre_categoria as categoria, 
                c.empresa as cliente
            FROM base_de_datos_csu.ticket t
            LEFT JOIN base_de_datos_csu.ususario u ON t.tecnico_ususario_id_usuario = u.id_usuario
            LEFT JOIN base_de_datos_csu.categoria cat ON t.categoria_id_categoria = cat.id_categoria
            LEFT JOIN base_de_datos_csu.cliente c ON t.id_cliente = c.id_cliente
            ORDER BY t.fecha_creacion DESC 
            LIMIT 20
        `;
        
        console.log(`Se encontraron ${cases.length} casos\n`);
        
        // 4. Mostrar primeros 3 casos
        console.log('--- Primeros 3 casos (JSON) ---');
        console.log(JSON.stringify(cases.slice(0, 3), null, 2));
        console.log('');
        
        // 5. Resumen de todos
        console.log('--- Resumen de todos los casos ---');
        cases.forEach((c, i) => {
            console.log(`${i+1}. ID: ${c.id}, Cliente: ${c.cliente}, Estado: ${c.estado}, Prioridad: ${c.prioridad}`);
        });
        
        console.log('\n✓ Prueba completada');
        
        await sql.end();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

testCasesAPI();
