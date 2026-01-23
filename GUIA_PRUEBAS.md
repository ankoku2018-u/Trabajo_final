# Guía de Prueba: Sistema de Casos Integrado

## 🎯 Objetivo
Verificar que la tabla de casos del menú principal está correctamente integrada con la base de datos y mostrando datos reales.

## 📋 Requisitos Previos
- Servidor web local (Apache/Nginx) ejecutándose
- PHP 7.4+ con módulo PostgreSQL
- Base de datos PostgreSQL en Supabase con datos poblados
- Navegador moderno con JavaScript habilitado

---

## 🚀 Prueba 1: Verificar Base de Datos

### Paso 1: Conectar a Supabase
1. Abrir [https://supabase.com](https://supabase.com)
2. Login a tu cuenta
3. Seleccionar el proyecto
4. Ir a SQL Editor

### Paso 2: Ejecutar Query
Copiar y pegar en el editor SQL:

```sql
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
LIMIT 20;
```

### Paso 3: Verificar Resultados
Deberías ver **8 filas** con datos como:

| id | fecha_creacion | asignado_a | estado | prioridad | categoria | cliente |
|----|----------------|-----------|--------|-----------|-----------|---------|
| 1 | 2026-01-22... | Juan... | abierto | Alta | Hardware | Empresa A |
| 2 | 2026-01-21... | María... | en_progreso | Media | Software | Empresa B |
| ... | ... | ... | ... | ... | ... | ... |

✅ **Si ves 8 filas**: Base de datos está correcta

❌ **Si no ves datos**:
```sql
-- Verificar cuántos tickets hay
SELECT COUNT(*) FROM base_de_datos_csu.ticket;

-- Si hay 0, ejecutar nuevamente el script de llenado
```

---

## 🚀 Prueba 2: Probar API PHP Directamente

### Paso 1: Abrir Navegador
1. Abrir navegador web
2. Ir a la barra de direcciones

### Paso 2: Acceder al API
Ir a la URL (ajusta la ruta según tu servidor):

```
http://localhost/path/to/Usuario%20GESTOR/api.php?action=get_cases_list
```

**Ejemplos según tu configuración:**
- Si está en Apache (htdocs): `http://localhost/Proyecto%20CSU/Usuario%20GESTOR/api.php?action=get_cases_list`
- Si es desarrollo local: `http://127.0.0.1:8000/...`
- Si usas XAMPP: `http://localhost/htdocs/proyecto/...`

### Paso 3: Verificar Respuesta JSON

Deberías ver JSON como:

```json
[
  {
    "id": "1",
    "fecha_creacion": "2026-01-22T16:27:08+00:00",
    "asignado_a": "Juan Tecnólogo",
    "estado": "abierto",
    "prioridad": "Alta",
    "categoria": "Hardware",
    "cliente": "Empresa A"
  },
  {
    "id": "2",
    "fecha_creacion": "2026-01-21T10:15:30+00:00",
    "asignado_a": "María Técnica",
    "estado": "en_progreso",
    "prioridad": "Media",
    "categoria": "Software",
    "cliente": "Empresa B"
  },
  ...
]
```

✅ **Si ves JSON con 8 items**: API funciona correctamente

❌ **Si ves error o JSON vacío**:
1. Verificar que api.php existe
2. Revisar que Config.env tiene DATABASE_URL correcto
3. Revisar errores en consola del navegador

### Paso 4: Guardar JSON (Opcional)
Para depuración, guardar respuesta:
1. Click derecho → Seleccionar todo
2. Copiar y pegar en archivo `respuesta.json`

---

## 🚀 Prueba 3: Abrir Menú Principal en Navegador

### Paso 1: Abrir Archivo HTML
En navegador, ir a:

```
http://localhost/path/to/Usuario%20GESTOR/Menu%20principal.html
```

Alternativamente:
1. En Explorer, navegar a: `Usuario GESTOR/Menu principal.html`
2. Click derecho → Abrir con → Navegador

### Paso 2: Verificar Carga
La página debe:
- ✅ Cargar con estilo completo
- ✅ Mostrar menú lateral
- ✅ Mostrar header con perfil
- ✅ Mostrar métricas
- ✅ Mostrar tabla de casos

### Paso 3: Verificar Tabla de Casos
La tabla debe mostrar:

```
┌─────────────────────────────────────────────────────────────┐
│ ☑ │ #1 │ 22 ene 16:27 │ 🔴 Abierto │ J Juan... │ 🔴 Alta  │
├─────────────────────────────────────────────────────────────┤
│   │ Hardware │ Empresa A │ Sistema │ ···
├─────────────────────────────────────────────────────────────┤
│ ☑ │ #2 │ 21 ene 10:15 │ 🟠 En Prog │ M María... │ 🟠 Media │
├─────────────────────────────────────────────────────────────┤
│   │ Software │ Empresa B │ Sistema │ ···
└─────────────────────────────────────────────────────────────┘
```

### Paso 4: Verificar Elementos Específicos

**Columnas visibles:**
- ✅ Checkbox (☑)
- ✅ ID del caso (#1, #2, ...)
- ✅ Fecha (22 ene 16:27)
- ✅ Estado (color según estado)
- ✅ Técnico asignado (con avatar de color)
- ✅ Prioridad (color según prioridad)
- ✅ Categoría (nombre)
- ✅ Cliente (empresa)
- ✅ Autor (Sistema)
- ✅ Botón de más opciones (···)

**Colores:**
- 🔴 Rojo: Abierto o Prioridad Alta
- 🟠 Naranja: En Progreso o Prioridad Media
- 🟢 Verde: Cerrado/Resuelto o Prioridad Baja

---

## 🚀 Prueba 4: Depuración en Navegador

### Paso 1: Abrir Consola (F12)

1. Abrir Menú principal.html
2. Presionar **F12** o Click derecho → Inspeccionar
3. Ir a pestaña **Console**

### Paso 2: Revisar Mensajes

La consola debe estar limpia o mostrar logs informativos:

```
✅ Correcto: (vacío o logs normales)
❌ Error: "Uncaught SyntaxError" o "Failed to fetch"
```

### Paso 3: Ejecutar Pruebas Manuales

En la consola, escribir y ejecutar:

```javascript
// 1. Verificar que loadCasesTable existe
typeof loadCasesTable

// Resultado esperado: "function"
```

```javascript
// 2. Verificar URL del API
getApiUrl()

// Resultado esperado: "/Usuario%20GESTOR/api.php" o similar
```

```javascript
// 3. Hacer fetch manual
fetch(getApiUrl() + '?action=get_cases_list')
  .then(r => r.json())
  .then(d => {
    console.log('Casos recibidos:', d.length);
    console.log('Primer caso:', d[0]);
  })
  .catch(e => console.error('Error:', e));

// Resultado esperado:
// Casos recibidos: 8
// Primer caso: {id: "1", fecha_creacion: "2026-01-22...", ...}
```

### Paso 4: Revisar Red (Network)

1. Ir a pestaña **Network**
2. Recargar página (F5)
3. Buscar request a `api.php`
4. Click en él
5. Ir a pestaña **Response**

Debe mostrar JSON con los 8 casos.

---

## 🚀 Prueba 5: Interactividad

### Paso 1: Seleccionar Casos
Hacer click en checkbox de una fila:
- ✅ Checkbox debe marcarse
- ✅ Fila debe resaltarse ligeramente

### Paso 2: Pasar Mouse sobre Filas
Hover sobre una fila:
- ✅ Fila debe cambiar fondo ligeramente
- ✅ Botón ··· debe ser más visible

### Paso 3: Click en Botón ···
Click en botón de opciones (···):
- ⚠️ Puede no tener acción implementada aún
- Este es un punto de expansión futura

---

## 📊 Tabla de Validación

Marca cada punto como completado:

| # | Prueba | Resultado | Estado |
|---|--------|-----------|--------|
| 1 | Base datos con 8 tickets | ✅ ✅ ✅ | |
| 2 | API retorna JSON válido | ✅ ✅ ✅ | |
| 3 | Menú principal carga | ✅ ✅ ✅ | |
| 4 | Tabla visible | ✅ ✅ ✅ | |
| 5 | 8 filas en tabla | ✅ ✅ ✅ | |
| 6 | Fechas formateadas | ✅ ✅ ✅ | |
| 7 | Estados con colores | ✅ ✅ ✅ | |
| 8 | Prioridades con colores | ✅ ✅ ✅ | |
| 9 | Avatares de técnicos | ✅ ✅ ✅ | |
| 10 | Nombres de clientes | ✅ ✅ ✅ | |
| 11 | Categorías mostradas | ✅ ✅ ✅ | |
| 12 | Sin errores en consola | ✅ ✅ ✅ | |
| 13 | Responsive (mobile) | ✅ ✅ ✅ | |
| 14 | Interactividad funciona | ✅ ✅ ✅ | |

---

## 🔍 Comparación: Imagen vs Realidad

### Imagen que compartiste:
```
Mostraba tabla con:
- Casos reales
- Estados con colores
- Técnicos asignados
- Prioridades
- Categorías
- Clientes
```

### Lo que deberías ver ahora:
```
Exactamente lo mismo pero:
- Datos dinámicos desde BD (8 casos)
- Fechas reales de inserción
- Técnicos reales del sistema
- Estados reales del proyecto
- Categorías del CSU
- Clientes insertados
```

✅ Deben coincider perfectamente

---

## 🐛 Solución de Problemas Comunes

### Problema: "Cargando casos..." (indefinido)
```
→ El fetch está fallando
→ Revisar Network tab (F12)
→ Ver si hay error 404 o CORS
→ Verificar que api.php existe
```

### Problema: Tabla vacía
```
→ fetch funcionó pero no hay datos
→ Revisar respuesta JSON en Network
→ Si JSON está vacío: base datos no tiene datos
→ Ejecutar script de llenado nuevamente
```

### Problema: Fechas muestran "Invalid Date"
```
→ Navegador no soporta toLocaleDateString
→ Usar navegador más moderno (Chrome/Firefox/Edge)
→ O modificar formato en script.js
```

### Problema: Sin colores en estados
```
→ Clases CSS no coinciden
→ Revisar que estado en BD es minúscula: 'abierto'
→ Revisar Estilos.css tiene .status.abierto
```

---

## 📈 Siguientes Pasos (Después de Validar)

1. **Filtros**: Implementar búsqueda activa
2. **Paginación**: Conectar con servidor
3. **Acciones**: Botones para editar/ver detalles
4. **Notificaciones**: Conectar con datos reales
5. **Estadísticas**: Actualizar métricas desde BD

---

## ✨ Resultado Esperado Final

Cuando todo funciona correctamente:

```
Menu Principal Gestor
├─ Sidebar: Menú completo visible
├─ Header: Perfil de usuario
├─ Métricas: Estadísticas (quizá hardcoded)
├─ Tabla: 
│  ├─ 8 filas de casos
│  ├─ Todos los campos visible
│  ├─ Colores según estado/prioridad
│  ├─ Avatares únicos para técnicos
│  └─ Interactiva (seleccionar, hover)
└─ Footer: Paginación
```

**Toda la tabla poblada desde base de datos PostgreSQL** ✅

---

## 📞 Registro de Prueba

Completar al probar:

```
Fecha de Prueba: _______________
Navegador/Versión: _______________
Servidor: _______________

Resultado Final: ✅ TODO FUNCIONA / ⚠️ PROBLEMAS ENCONTRADOS

Notas:
_____________________________________________________
_____________________________________________________
```

---

**¡Exitosas pruebas!** 🎉

