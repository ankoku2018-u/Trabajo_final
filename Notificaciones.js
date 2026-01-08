let filter = 'all';

let notifications = [
  { id: 1, type: 'urgente', title: 'Caso urgente', message: 'Caso marcado como urgente', time: 'Hace 5 min', read: false },
  { id: 2, type: 'asignacion', title: 'Nuevo caso asignado', message: 'Caso de HARDWARE asignado', time: 'Hace 15 min', read: false },
  { id: 3, type: 'completado', title: 'Caso completado', message: 'Caso cerrado correctamente', time: 'Hace 1 hora', read: true },
  { id: 4, type: 'sistema', title: 'Mantenimiento', message: 'Sistema en mantenimiento', time: 'Hace 1 día', read: true }
];

const list = document.getElementById('notificationList');
const badge = document.getElementById('unreadBadge');
const subtitle = document.getElementById('subtitle');

function render() {
  list.innerHTML = '';

  const unreadCount = notifications.filter(n => !n.read).length;
  subtitle.textContent = unreadCount > 0
    ? `Tienes ${unreadCount} notificaciones sin leer`
    : 'No tienes notificaciones pendientes';

  if (badge) {
    badge.style.display = unreadCount > 0 ? 'inline' : 'none';
    badge.textContent = unreadCount;
  }

  let filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  if (filtered.length === 0) {
    list.innerHTML = '<p>No hay notificaciones</p>';
    return;
  }

  filtered.forEach(n => {
    const div = document.createElement('div');
    div.className = `notification ${!n.read ? 'unread' : ''}`;

    div.innerHTML = `
      <h3>${n.title}</h3>
      <p>${n.message}</p>
      <small>${n.time}</small>
      <div class="actions">
        ${!n.read ? `<button class="read" onclick="markRead(${n.id})">Marcar leída</button>` : ''}
        <button class="delete" onclick="removeNotification(${n.id})">Eliminar</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function markRead(id) {
  notifications = notifications.map(n =>
    n.id === id ? { ...n, read: true } : n
  );
  render();
}

function removeNotification(id) {
  notifications = notifications.filter(n => n.id !== id);
  render();
}

document.getElementById('markAllBtn').onclick = () => {
  notifications = notifications.map(n => ({ ...n, read: true }));
  render();
};

document.querySelectorAll('.filters button').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    render();
  };
});

render();
