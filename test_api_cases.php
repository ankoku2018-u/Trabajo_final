<?php
// Archivo de prueba para verificar que el API está trayendo datos correctamente

require_once 'Proyecto de Software CSU - COLSOF/conexion.php';

echo "=== PRUEBA DE CONEXIÓN Y DATOS ===\n\n";

// 1. Verificar conexión
if (!$conn) {
    die("Error: No se pudo conectar a la base de datos\n");
}
echo "✓ Conexión exitosa\n\n";

// 2. Verificar que existen datos en la tabla ticket
echo "--- Contando tickets en la base de datos ---\n";
$count_result = pg_query($conn, "SELECT COUNT(*) as total FROM base_de_datos_csu.ticket");
if ($count_result) {
    $row = pg_fetch_assoc($count_result);
    echo "Total de tickets: " . $row['total'] . "\n\n";
} else {
    echo "Error al contar: " . pg_last_error($conn) . "\n";
}

// 3. Ejecutar la misma query que el API
echo "--- Ejecutando query del API (get_cases_list) ---\n";
$query = "
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
";

$result = pg_query($conn, $query);

if (!$result) {
    echo "Error en la query: " . pg_last_error($conn) . "\n";
    pg_close($conn);
    exit;
}

$cases = [];
while($row = pg_fetch_assoc($result)) {
    $cases[] = $row;
}

echo "Se encontraron " . count($cases) . " casos\n\n";

// 4. Mostrar los primeros 3 casos en formato JSON
echo "--- Primeros 3 casos en JSON ---\n";
echo json_encode(array_slice($cases, 0, 3), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";

// 5. Mostrar resumen de todos los casos
echo "--- Resumen de todos los casos ---\n";
foreach ($cases as $i => $case) {
    echo ($i+1) . ". ID: {$case['id']}, Cliente: {$case['cliente']}, Estado: {$case['estado']}, Prioridad: {$case['prioridad']}\n";
}

pg_close($conn);
echo "\n✓ Prueba completada\n";
?>
