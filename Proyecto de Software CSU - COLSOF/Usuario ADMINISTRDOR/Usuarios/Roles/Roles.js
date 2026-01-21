let editingRole = null;

const roles = [
  { id: 1, nombre: 'Administrador', color: 'role-red', usuarios: 2 },
  { id: 2, nombre: 'Gestor', color: 'role-blue', usuarios: 3 },
  { id: 3, nombre: 'Técnico', color: 'role-purple', usuarios: 4 },
  { id: 4, nombre: 'Empleado', color: 'role-slate', usuarios: 12 }
];

const permisos = [
  { key: 'crear_usuarios', label: 'Crear usuarios', cat: 'Usuarios' },
  { key: 'editar_usuarios', label: 'Editar usuarios', cat: 'Usuarios' },
  { key: 'eliminar_usuarios', label: 'Eliminar usuarios', cat: 'Usuarios' },
  { key: 'gestionar_casos', label: 'Gestionar casos', cat: 'Casos' },
  { key: 'asignar_casos', label: 'Asignar casos', cat: 'Casos' },
  { key: 'resolver_casos', label: 'Resolver casos', cat: 'Casos' },
  { key: 'ver_reportes', label: 'Ver reportes', cat: 'Reportes' },
  { key: 'generar_reportes', label: 'Generar reportes', cat: 'Reportes' },
  { key: 'acceso_bd', label: 'Acceso BD', cat: 'Sistema' }
];

const matriz = {
  1: { crear_usuarios: true, editar_usuarios: true, eliminar_usuarios: true, gestionar_casos: true, asignar_casos: true, resolver_casos: true, ver_reportes: true, generar_reportes: true, acceso_bd: true },
  2: { crear_usuarios: false, editar_usuarios: false, eliminar_usuarios: false, gestionar_casos: true, asignar_casos: true, resolver_casos: true, ver_reportes: true, generar_reportes: true, acceso_bd: false },
  3: { crear_usuarios: false, editar_usuarios: false, eliminar_usuarios: false, gestionar_casos: false, asignar_casos: false, resolver_casos: true, ver_reportes: false, generar_reportes: false, acceso_bd: false },
  4: { crear_usuarios: false, editar_usuarios: false, eliminar_usuarios: false, gestionar_casos: false, asignar_casos: false, resolver_casos: false, ver_reportes: false, generar_reportes: false, acceso_bd: false }
};

function renderRoles() {
  const cont = document.getElementById('roles');
  cont.innerHTML = '';
  roles.forEach(r => {
    const perms = Object.values(matriz[r.id]).filter(Boolean).length;
    cont.insertAdjacentHTML('beforeend', `
      <div class="role-card">
        <div class="role-head ${r.color}">
          <div>
            <div class="role-name">${r.nombre}</div>
            <div class="role-users">${r.usuarios} usuarios</div>
          </div>
          <div class="role-actions">
            <button class="btn" data-role="${r.id}" aria-label="Editar rol">Editar</button>
          </div>
        </div>
        <div class="role-body">
          <div class="role-perms">${perms} permisos <small>activos</small></div>
        </div>
      </div>
    `);
  });

  cont.querySelectorAll('.role-actions .btn').forEach(btn => {
    btn.addEventListener('click', () => editar(Number(btn.dataset.role)));
  });
}

function editar(id) {
  editingRole = id;
  document.getElementById('editAlert').classList.remove('hidden');
  document.getElementById('acciones').classList.remove('hidden');
  renderPermisos();
}

function renderPermisos() {
  const cont = document.getElementById('permisos');
  cont.innerHTML = '<div class="card-header"><div><div class="card-title">Matriz de permisos</div><div class="card-subtitle">Activa o desactiva según el rol seleccionado</div></div></div>';

  const categorias = [...new Set(permisos.map(p => p.cat))];

  categorias.forEach(cat => {
    let html = `<h3>${cat}</h3><table><tr><th>Permiso</th>`;
    roles.forEach(r => html += `<th>${r.nombre}</th>`);
    html += `</tr>`;

    permisos.filter(p => p.cat === cat).forEach(p => {
      html += `<tr><td>${p.label}</td>`;
      roles.forEach(r => {
        const activo = matriz[r.id][p.key];
        html += `
          <td>
            <button class="perm ${editingRole!==r.id?'disabled':''}"
              onclick="togglePerm(${r.id},'${p.key}')">
              ${activo ? '✔️' : '❌'}
            </button>
          </td>`;
      });
      html += `</tr>`;
    });

    html += `</table>`;
    cont.insertAdjacentHTML('beforeend', html);
  });
}

function togglePerm(roleId, key) {
  if (editingRole !== roleId) return;
  matriz[roleId][key] = !matriz[roleId][key];
  renderPermisos();
}

function cancelar() {
  editingRole = null;
  document.getElementById('editAlert').classList.add('hidden');
  document.getElementById('acciones').classList.add('hidden');
  document.getElementById('permisos').innerHTML = '';
}

function guardar() {
  editingRole = null;
  alert('Permisos guardados correctamente');
  cancelar();
}

function activarCreacion() {
  alert('Crear rol personalizado');
}

function wireActions() {
  const btnCrear = document.getElementById('btnCrear');
  if (btnCrear) btnCrear.addEventListener('click', activarCreacion);
  const btnCancelar = document.getElementById('btnCancelar');
  if (btnCancelar) btnCancelar.addEventListener('click', cancelar);
  const btnGuardar = document.getElementById('btnGuardar');
  if (btnGuardar) btnGuardar.addEventListener('click', guardar);
}

renderRoles();
wireActions();
