# Diagrama de Flujo: Integración de Casos

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    NAVEGADOR WEB (Usuario)                      │
├─────────────────────────────────────────────────────────────────┤
│                  Menu principal.html (Gestor)                   │
│                                                                  │
│  [HTML Table]                                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ID │ Apertura │ Estado │ Técnico │ Prioridad │ Categoría │ │
│  │ 1  │ 22 ene   │ Abierto│ Juan   │ Alta     │ Hardware  │ │
│  │ 2  │ 21 ene   │ Pausa  │ María  │ Media    │ Software  │ │
│  │ 3  │ 20 ene   │ Cerrado│ Carlos │ Baja     │ Seguridad │ │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [JavaScript - script.js]                                        │
│  • loadCasesTable()                                              │
│  • Fetch API call                                                │
│  • Formateo de fechas                                            │
│  • Mapeo de estados/prioridades                                  │
│  • Generación de avatares                                        │
└────────────────────────────────┬──────────────────────────────┘
                                 │
                    fetch('?action=get_cases_list')
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              SERVIDOR WEB (Apache/Nginx/PHP)                    │
├─────────────────────────────────────────────────────────────────┤
│                   api.php (Backend API)                         │
│                                                                  │
│  GET request handler:                                            │
│  1. Obtiene parámetro: ?action=get_cases_list                   │
│  2. Ejecuta query SQL con JOINs                                  │
│  3. Retorna JSON array de casos                                  │
│                                                                  │
│  SELECT query:                                                   │
│  ├─ FROM base_de_datos_csu.ticket (t)                           │
│  ├─ LEFT JOIN ususario (u) → nombre técnico                     │
│  ├─ LEFT JOIN categoria (cat) → categoría y prioridad           │
│  └─ LEFT JOIN cliente (c) → empresa cliente                     │
└────────────────────────────────┬──────────────────────────────┘
                                 │
                    JSON Response
                  {id, fecha_creacion, asignado_a,
                   estado, prioridad, categoria, cliente}
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              BASE DE DATOS PostgreSQL (Supabase)                │
├─────────────────────────────────────────────────────────────────┤
│  base_de_datos_csu (Schema)                                     │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    ticket    │  │   ususario   │  │  categoria   │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ id_ticket    │  │ id_usuario   │  │ id_categoria │          │
│  │ id_cliente   │  │ nombre_user  │  │ nombre_cat   │          │
│  │ id_gestor    │  │ rol          │  │ prioridad    │          │
│  │ estado       │  │              │  │              │          │
│  │ fecha_crec   │  │              │  │              │          │
│  │ tecnico_id   ├──┤──────────────┘  └──────────────┘          │
│  └──────────────┘  categoria_id ├──────┘                       │
│  cliente_id                                                      │
│         │                                                        │
│         └─────────┐                                              │
│                   ▼                                              │
│          ┌──────────────┐                                       │
│          │   cliente    │                                       │
│          ├──────────────┤                                       │
│          │ id_cliente   │                                       │
│          │ empresa      │                                       │
│          │ contacto     │                                       │
│          └──────────────┘                                       │
│                                                                  │
│  Total de registros: 8 tickets con datos reales                 │
└─────────────────────────────────────────────────────────────────┘
```

## Flujo de Datos Detallado

### 1. SOLICITUD (Cliente → Servidor)
```
GET /Usuario%20GESTOR/api.php?action=get_cases_list
```

### 2. PROCESAMIENTO (Servidor)
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
LEFT JOIN base_de_datos_csu.ususario u 
    ON t.tecnico_ususario_id_usuario = u.id_usuario
LEFT JOIN base_de_datos_csu.categoria cat 
    ON t.categoria_id_categoria = cat.id_categoria
LEFT JOIN base_de_datos_csu.cliente c 
    ON t.id_cliente = c.id_cliente
ORDER BY t.fecha_creacion DESC
LIMIT 20
```

### 3. RESPUESTA (Servidor → Cliente)
```json
[
  {
    "id": 1,
    "fecha_creacion": "2026-01-22T16:27:08+00:00",
    "asignado_a": "Juan Técnico",
    "estado": "abierto",
    "prioridad": "Alta",
    "categoria": "Hardware",
    "cliente": "Empresa A"
  },
  {
    "id": 2,
    "fecha_creacion": "2026-01-21T10:15:30+00:00",
    "asignado_a": "María Técnico",
    "estado": "en_progreso",
    "prioridad": "Media",
    "categoria": "Software",
    "cliente": "Empresa B"
  },
  ...
]
```

### 4. RENDERIZADO (Cliente - JavaScript)
```javascript
// Entrada: JSON del servidor
const caso = {
    id: 1,
    fecha_creacion: "2026-01-22T16:27:08+00:00",
    asignado_a: "Juan Técnico",
    estado: "abierto",
    prioridad: "Alta",
    categoria: "Hardware",
    cliente: "Empresa A"
}

// Procesamiento:
fechaFormato = "22 ene 2026, 16:27"  // Formato local
estadoInfo = {
    clase: "abierto",
    etiqueta: "Abierto",
    color: "#e74c3c"
}
prioridadInfo = {
    clase: "alta",
    color: "#e74c3c",
    label: "Alta"
}
colorAvatar = "#FF6B6B"  // Basado en primera letra de nombre

// Salida: HTML renderizado
<tr>
    <td class="td-check"><input type="checkbox"></td>
    <td><strong>#1</strong></td>
    <td><small>22 ene 2026, 16:27</small></td>
    <td><span class="status abierto">
        <span class="checkdot" style="background:#e74c3c"></span>
        Abierto
    </span></td>
    <td>
        <div class="assignee">
            <span class="ava" style="background:#FF6B6B">J</span>
            <div>Juan Técnico</div>
        </div>
    </td>
    <td><span class="priority alta" style="...">Alta</span></td>
    <td><span class="category-badge">Hardware</span></td>
    <td>Empresa A</td>
    <td><small>Sistema</small></td>
    <td class="ellipsis">···</td>
</tr>
```

### 5. VISUALIZACIÓN (HTML en Navegador)
```
┌─────────────────────────────────────────────────────────────┐
│ ✓ │  #1  │ 22 ene 16:27 │ ⚫Abierto  │ J Juan Técnico      │
│   │      │              │           │ (Avatar rojo)        │
│─────────────────────────────────────────────────────────────│
│   │ Alta │ Hardware     │ Empresa A │ Sistema              │ ···
│─────────────────────────────────────────────────────────────│
│ ✓ │  #2  │ 21 ene 10:15 │ ⚫En Prog  │ M María Técnico     │
│   │      │              │           │ (Avatar verde)       │
│─────────────────────────────────────────────────────────────│
│   │Media │ Software     │ Empresa B │ Sistema              │ ···
└─────────────────────────────────────────────────────────────┘
```

## Mapeo de Estilos

### Estados → Colores
```
abierto        → 🔴 Rojo      (#e74c3c) - Urgente
en_progreso    → 🟠 Naranja   (#f39c12) - Procesando
resuelto       → 🟢 Verde     (#27ae60) - Completado
cerrado        → 🟢 Verde     (#27ae60) - Completado
cancelado      → ⚪ Gris      (#95a5a6) - Inactivo
```

### Prioridades → Colores
```
alta/urgente/critica → 🔴 Rojo      (#e74c3c)
media                → 🟠 Naranja   (#f39c12)
baja                 → 🔵 Azul      (#3498db)
```

## Componentes del Sistema

```
┌─ FRONTEND (Cliente)
│  ├─ Menu principal.html      (Estructura HTML)
│  ├─ script.js                (Lógica JavaScript)
│  │  ├─ loadCasesTable()      (Carga tabla)
│  │  ├─ formatearFecha()      (Formato de fechas)
│  │  ├─ mapearEstado()        (Estadística a visual)
│  │  └─ mapearPrioridad()     (Prioridad a color)
│  └─ Estilos.css              (Estilos CSS)
│     ├─ .status.*             (Estados)
│     ├─ .priority.*           (Prioridades)
│     └─ .category-badge       (Categorías)
│
├─ BACKEND (Servidor)
│  └─ api.php                  (API REST)
│     └─ get_cases_list        (Endpoint)
│        └─ conexion.php       (Conexión BD)
│
└─ BASE DE DATOS (PostgreSQL/Supabase)
   └─ base_de_datos_csu
      ├─ ticket               (8 registros)
      ├─ ususario             (4 técnicos)
      ├─ categoria            (6 categorías)
      └─ cliente              (5 clientes)
```

## Secuencia Temporal

```
1. Usuario abre Menu principal.html
                    ↓
2. Navegador carga HTML + CSS + JS
                    ↓
3. Script.js ejecuta loadCasesTable() automáticamente
                    ↓
4. Fetch GET /api.php?action=get_cases_list
                    ↓
5. Servidor consulta PostgreSQL (query con 3 JOINs)
                    ↓
6. BD retorna 8 casos con datos relacionados
                    ↓
7. PHP convierte a JSON y retorna al cliente
                    ↓
8. JavaScript procesa JSON, formatea datos
                    ↓
9. Crea elementos <tr> para cada caso
                    ↓
10. Aplica estilos según estado/prioridad
                    ↓
11. Inyecta en DOM (cases-table-body)
                    ↓
12. Navegador renderiza tabla con datos reales
                    ↓
13. Usuario ve tabla completamente poblada ✓
```

