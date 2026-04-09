// Configuración por rol
const dashboardConfig = {
    admin: {
        title: 'Panel de Administración',
        subtitle: 'Gestión integral de la institución educativa',
        avatar: 'A',
        menu: 'menuAdmin',
        stats: [
            { icon: 'fa-users', value: '1,234', label: 'Estudiantes activos', color: 'blue' },
            { icon: 'fa-chalkboard-teacher', value: '86', label: 'Docentes', color: 'green' },
            { icon: 'fa-user-friends', value: '892', label: 'Acudientes', color: 'yellow' },
            { icon: 'fa-graduation-cap', value: '42', label: 'Cursos', color: 'purple' }
        ],
        activities: [
            { icon: 'fa-user-plus', color: '#10b981', title: 'Nuevo estudiante registrado', desc: 'Juan Pérez - Grado 10°', time: 'Hace 5 minutos' },
            { icon: 'fa-file-alt', color: '#4f46e5', title: 'Reporte generado', desc: 'Informe de asistencia mensual', time: 'Hace 15 minutos' },
            { icon: 'fa-exclamation-triangle', color: '#f59e0b', title: 'Alerta de pago', desc: 'Vencimiento próximo - 12 estudiantes', time: 'Hace 1 hora' }
        ]
    },
    teacher: {
        title: 'Portal Docente',
        subtitle: 'Gestión de cursos y calificaciones',
        avatar: 'D',
        menu: 'menuTeacher',
        stats: [
            { icon: 'fa-book', value: '4', label: 'Cursos asignados', color: 'blue' },
            { icon: 'fa-users', value: '128', label: 'Estudiantes', color: 'green' },
            { icon: 'fa-clipboard-check', value: '85%', label: 'Calificaciones', color: 'yellow' },
            { icon: 'fa-clock', value: '24h', label: 'Horas semanales', color: 'purple' }
        ],
        activities: [
            { icon: 'fa-edit', color: '#4f46e5', title: 'Calificaciones actualizadas', desc: 'Matemáticas - Grado 10°B', time: 'Hace 10 minutos' },
            { icon: 'fa-user-times', color: '#ef4444', title: 'Falta registrada', desc: 'María García - Justificada', time: 'Hace 45 minutos' },
            { icon: 'fa-comments', color: '#06b6d4', title: 'Mensaje de acudiente', desc: 'Nueva observación recibida', time: 'Hace 2 horas' }
        ]
    },
    student: {
        title: 'Portal Estudiantil',
        subtitle: 'Consulta tu información académica',
        avatar: 'E',
        menu: 'menuStudent',
        stats: [
            { icon: 'fa-book-open', value: '8', label: 'Materias', color: 'blue' },
            { icon: 'fa-star', value: '4.2', label: 'Promedio', color: 'green' },
            { icon: 'fa-trophy', value: '3°', label: 'Ranking', color: 'yellow' },
            { icon: 'fa-percentage', value: '95%', label: 'Asistencia', color: 'purple' }
        ],
        activities: [
            { icon: 'fa-file-alt', color: '#4f46e5', title: 'Nueva calificación', desc: 'Matemáticas: 4.5/5.0', time: 'Hace 30 minutos' },
            { icon: 'fa-calendar', color: '#f59e0b', title: 'Tarea asignada', desc: 'Proyecto de Ciencias - Vence: 15/04', time: 'Hace 2 horas' },
            { icon: 'fa-bell', color: '#06b6d4', title: 'Anuncio importante', desc: 'Cambio de horario para mañana', time: 'Hace 4 horas' }
        ]
    },
    parent: {
        title: 'Portal de Acudientes',
        subtitle: 'Seguimiento del proceso educativo',
        avatar: 'Ac',
        menu: 'menuParent',
        stats: [
            { icon: 'fa-child', value: '2', label: 'Estudiantes', color: 'blue' },
            { icon: 'fa-chart-line', value: '4.1', label: 'Promedio general', color: 'green' },
            { icon: 'fa-money-bill', value: '$0', label: 'Pendiente de pago', color: 'yellow' },
            { icon: 'fa-comments', value: '3', label: 'Observaciones', color: 'purple' }
        ],
        activities: [
            { icon: 'fa-graduation-cap', color: '#4f46e5', title: 'Boletín disponible', desc: 'Período académico Q1 - Juan Pérez', time: 'Hace 1 hora' },
            { icon: 'fa-exclamation-circle', color: '#f59e0b', title: 'Llegada tarde', desc: 'Ana María - 15 minutos de retraso', time: 'Hace 3 horas' },
            { icon: 'fa-calendar-check', color: '#10b981', title: 'Reunión confirmada', desc: 'Profesora de Matemáticas - 15/04', time: 'Ayer' }
        ]
    }
};

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Obtener rol de URL o localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role') || localStorage.getItem('userRole') || 'admin';
    
    // Guardar rol
    localStorage.setItem('userRole', role);
    
    // Configurar dashboard
    configureDashboard(role);
});

function configureDashboard(role) {
    const config = dashboardConfig[role];
    if (!config) return;

    // Actualizar información del usuario
    document.getElementById('userName').textContent = getUserName(role);
    document.getElementById('userRole').textContent = role;
    document.getElementById('userAvatar').textContent = config.avatar;
    document.getElementById('headerUserName').textContent = getUserName(role);

    // Actualizar bienvenida
    document.getElementById('welcomeTitle').textContent = config.title;
    document.getElementById('welcomeSubtitle').textContent = config.subtitle;

    // Mostrar menú correspondiente
    document.querySelectorAll('.nav-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar menús principales y el específico del rol
    document.querySelectorAll('.nav-section').forEach((section, index) => {
        if (index === 0 || section.id === config.menu || index === document.querySelectorAll('.nav-section').length - 1) {
            section.style.display = 'block';
        }
    });

    // Generar estadísticas
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = config.stats.map(stat => `
        <div class="stat-card">
            <div class="stat-info">
                <h3>${stat.value}</h3>
                <p>${stat.label}</p>
            </div>
            <div class="stat-icon ${stat.color}">
                <i class="fas ${stat.icon}"></i>
            </div>
        </div>
    `).join('');

    // Generar actividades
    const mainCardContent = document.getElementById('mainCardContent');
    mainCardContent.innerHTML = `
        <div class="activity-list">
            ${config.activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon" style="background: ${activity.color}20; color: ${activity.color}">
                        <i class="fas ${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <h4>${activity.title}</h4>
                        <p>${activity.desc}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Actualizar título de tarjeta principal según rol
    const titles = {
        admin: 'Actividad del Sistema',
        teacher: 'Acciones Recientes',
        student: 'Mis Notificaciones',
        parent: 'Seguimiento de Hijos'
    };
    document.getElementById('mainCardTitle').textContent = titles[role];
}

function getUserName(role) {
    const names = {
        admin: 'Carlos Rodríguez',
        teacher: 'María González',
        student: 'Juan Pérez',
        parent: 'Ana Martínez'
    };
    return names[role] || 'Usuario';
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
}

function logout() {
    localStorage.removeItem('userRole');
    window.location.href = '/pages/auth/index.html';
}