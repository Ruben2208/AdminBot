import { obtenerUsuario, cerrarSesion } from '../../shared/js/storage.js';

console.log('✅ dashboard.js cargado');


const user = obtenerUsuario();
console.log('🔍 Usuario en localStorage:', user);

if (!user) {
    console.log('❌ No hay usuario, redirigiendo a login...');
    window.location.href = '../../pages/auth/login.html';
    throw new Error('No autorizado');
}

console.log('✅ Usuario autenticado:', user.first_name, user.role);

const roleConfig = {
    admin: {
        menuId: 'menuAdmin',
        welcome: 'Panel Administrativo',
        stats: [
            { icon: 'fa-users', value: '1,245', label: 'Estudiantes', color: '#4f46e5' },
            { icon: 'fa-chalkboard-teacher', value: '86', label: 'Docentes', color: '#10b981' },
            { icon: 'fa-user-friends', value: '892', label: 'Acudientes', color: '#f59e0b' },
            { icon: 'fa-clipboard-check', value: '98%', label: 'Asistencia', color: '#ef4444' }
        ],
        mainCardTitle: 'Últimas Actividades'
    },
    teacher: {
        menuId: 'menuTeacher',
        welcome: 'Portal Docente',
        stats: [
            { icon: 'fa-book', value: '5', label: 'Mis Cursos', color: '#4f46e5' },
            { icon: 'fa-user-graduate', value: '142', label: 'Estudiantes', color: '#10b981' },
            { icon: 'fa-tasks', value: '12', label: 'Tareas Pendientes', color: '#f59e0b' },
            { icon: 'fa-star', value: '4.8', label: 'Promedio', color: '#ef4444' }
        ],
        mainCardTitle: 'Calificaciones Recientes'
    },
    student: {
        menuId: 'menuStudent',
        welcome: 'Portal Estudiantil',
        stats: [
            { icon: 'fa-book-open', value: '8', label: 'Materias', color: '#4f46e5' },
            { icon: 'fa-star', value: '4.2', label: 'Promedio', color: '#10b981' },
            { icon: 'fa-check-circle', value: '95%', label: 'Asistencia', color: '#f59e0b' },
            { icon: 'fa-clock', value: '2', label: 'Tareas Pendientes', color: '#ef4444' }
        ],
        mainCardTitle: 'Mis Calificaciones'
    },
    parent: {
        menuId: 'menuParent',
        welcome: 'Portal de Acudientes',
        stats: [
            { icon: 'fa-child', value: '1', label: 'Estudiante', color: '#4f46e5' },
            { icon: 'fa-chart-line', value: '4.2', label: 'Promedio', color: '#10b981' },
            { icon: 'fa-user-check', value: '95%', label: 'Asistencia', color: '#f59e0b' },
            { icon: 'fa-exclamation-circle', value: '0', label: 'Observaciones', color: '#ef4444' }
        ],
        mainCardTitle: 'Progreso Académico'
    }
};


function renderStats(stats) {
    const statsGrid = document.getElementById('statsGrid');
    if (!statsGrid) {
        console.error('❌ No se encontró statsGrid');
        return;
    }

    statsGrid.innerHTML = stats.map(stat => `
        <div class="stat-card" style="border-left: 4px solid ${stat.color}">
            <div class="stat-icon" style="background: ${stat.color}15; color: ${stat.color}">
                <i class="fas ${stat.icon}"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value">${stat.value}</span>
                <span class="stat-label">${stat.label}</span>
            </div>
        </div>
    `).join('');
    
    console.log('✅ Stats renderizados');
}

function initDashboard() {
    console.log('🔧 Inicializando dashboard para rol:', user.role);
    
    const config = roleConfig[user.role];

    if (!config) {
        console.error('❌ Rol no reconocido:', user.role);
        return;
    }

    // Mostrar menú correspondiente al rol
    const menu = document.getElementById(config.menuId);
    if (menu) {
        menu.style.display = 'block';
        console.log('✅ Menú mostrado:', config.menuId);
    } else {
        console.error('❌ No se encontró menú:', config.menuId);
    }

    const welcomeTitle = document.getElementById('welcomeTitle');
    const welcomeSubtitle = document.getElementById('welcomeSubtitle');
    const mainCardTitle = document.getElementById('mainCardTitle');

    if (welcomeTitle) {
        welcomeTitle.textContent = `${config.welcome}, ${user.first_name || 'Usuario'}`;
    }
    if (welcomeSubtitle) {
        welcomeSubtitle.textContent = `Aquí está el resumen de tu actividad como ${user.role}`;
    }
    if (mainCardTitle) {
        mainCardTitle.textContent = config.mainCardTitle;
    }

    renderStats(config.stats);


    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const userAvatar = document.getElementById('userAvatar');
    const headerUserName = document.getElementById('headerUserName');

    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();

    if (userName) userName.textContent = fullName || 'Usuario';
    if (userRole) userRole.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    if (userAvatar) userAvatar.textContent = (user.first_name || 'U').charAt(0).toUpperCase();
    if (headerUserName) headerUserName.textContent = user.first_name || 'Usuario';
    
    console.log('✅ Dashboard inicializado correctamente');
}

function logout() {
    cerrarSesion();
    window.location.href = '../../pages/auth/index.html';
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar) sidebar.classList.toggle('collapsed');
    if (mainContent) mainContent.classList.toggle('expanded');
}


document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOMContentLoaded ejecutado');
    
    initDashboard();

    const btnLogout = document.getElementById('btnLogout');
    const btnMenuToggle = document.getElementById('btnMenuToggle');

    if (btnLogout) {
        btnLogout.addEventListener('click', logout);
        console.log('✅ Evento logout asignado');
    }

    if (btnMenuToggle) {
        btnMenuToggle.addEventListener('click', toggleSidebar);
        console.log('✅ Evento toggleSidebar asignado');
    }
});