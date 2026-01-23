# ⚡ INICIO RÁPIDO - Sistema de Casos CSU

## 3 Pasos para Usar el Sistema

### 1️⃣ Verificar Base de Datos
```bash
# En Supabase SQL Editor, ejecutar:
SELECT COUNT(*) FROM base_de_datos_csu.ticket;

# Resultado esperado: 8
```

### 2️⃣ Abrir Menú Principal
```
URL: http://localhost/Usuario%20GESTOR/Menu%20principal.html
(Ajusta la ruta según tu servidor)
```

### 3️⃣ ¡Listo!
Deberías ver la tabla poblada con 8 casos reales.

---

## 🔍 Verificación Rápida

### Si no ves datos:
1. Abrir Consola (F12)
2. Ejecutar:
```javascript
fetch(getApiUrl() + '?action=get_cases_list')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Si ves error:
Revisar que `/Usuario GESTOR/api.php` existe y es accesible.

---

## 📋 Archivos Modificados

| Archivo | ¿Qué cambió? |
|---------|-------------|
| `api.php` | Query mejorada, JOINs a 3 tablas |
| `script.js` | Formateo de fechas y colores |
| `Estilos.css` | Nuevos estilos para estados/prioridades |

---

## 🎯 Resultado Esperado

```
┌─────────────────────────────────────────────────────┐
│ ☑ │ ID │ Fecha │ Estado │ Técnico │ Prioridad │ ... │
├─────────────────────────────────────────────────────┤
│ ☑ │ #1 │ 22e... │ 🔴Abierto │ Juan... │ 🔴Alta   │ ... │
│ ☑ │ #2 │ 21e... │ 🟠Prog... │ María... │ 🟠Media  │ ... │
│ ☑ │ #3 │ 20e... │ 🟢Resol... │ Carlos... │ 🔵Baja  │ ... │
│ ... (5 casos más)
└─────────────────────────────────────────────────────┘
```

---

## ⚡ Comandos Útiles

### Base de Datos
```sql
-- Ver últimos 3 casos
SELECT id_ticket, fecha_creacion, estado 
FROM base_de_datos_csu.ticket 
ORDER BY fecha_creacion DESC LIMIT 3;

-- Contar total de casos
SELECT COUNT(*) FROM base_de_datos_csu.ticket;

-- Ver casos por estado
SELECT estado, COUNT(*) 
FROM base_de_datos_csu.ticket 
GROUP BY estado;
```

### Frontend (Console)
```javascript
// Verificar API
getApiUrl()

// Cargar tabla manualmente
loadCasesTable()

// Ver un caso
fetch(getApiUrl() + '?action=get_cases_list')
  .then(r => r.json())
  .then(d => console.table(d))
```

---

## 🆘 Problemas Comunes

| Problema | Solución |
|----------|----------|
| Tabla vacía | Verificar BD tiene 8 registros |
| Errores en consola | Revisar que api.php existe |
| Fechas extrañas | Usar navegador moderno (Chrome/Firefox) |
| Sin colores | Revisar Estilos.css se cargó |

---

## 📚 Documentación Detallada

Para más información, ver:
- [RESUMEN_FINAL.md](RESUMEN_FINAL.md) - Visión general
- [GUIA_PRUEBAS.md](GUIA_PRUEBAS.md) - Cómo probar
- [CHECKLIST_VALIDACION.md](CHECKLIST_VALIDACION.md) - Validaciones
- [DIAGRAMA_INTEGRACION.md](DIAGRAMA_INTEGRACION.md) - Arquitectura

---

## ✅ Checklist de Verificación

- [ ] Base de datos tiene 8 tickets
- [ ] Menu principal.html se abre
- [ ] Tabla carga sin errores
- [ ] Se ven 8 filas de casos
- [ ] Fechas están formateadas
- [ ] Estados tienen colores
- [ ] Prioridades tienen colores
- [ ] Técnicos muestran avatares
- [ ] Sin errores en Consola (F12)

---

**¡Listo para usar!** 🚀

