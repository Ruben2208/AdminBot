import { obtenerUsuario, cerrarSesion } from '../../shared/js/storage.js';
const crypto = window.crypto;

console.log('✅ dashboard.js cargado');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('🟢 Conectado a sockets');
});


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


async function fetchDashboard() {

    try {

        const response = await fetch('http://localhost:3000/api/dashboard');

        const result = await response.json();

        if (!result.ok) {
            throw new Error('Error cargando dashboard');
        }

        return result.dashboard;

    } catch (error) {

        console.error(error);

    }

}


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


function renderRealMetrics(data) {

    const stats = [

        {
            icon:'fa-users',
            value:data.metrics.totalStudents,
            label:'Estudiantes',
            color:'#4f46e5'
        },

        {
            icon:'fa-money-bill-wave',
            value:data.metrics.pendingPayments,
            label:'Pagos pendientes',
            color:'#ef4444'
        },

        {
            icon:'fa-dollar-sign',
            value:`$${Number(
                data.metrics.monthlyPayments
            ).toLocaleString()}`,
            label:'Pagos del mes',
            color:'#10b981'
        },

        {
            icon:'fa-bell',
            value:data.metrics.notifications,
            label:'Notificaciones',
            color:'#f59e0b'
        }

    ];

    renderStats(stats);

};


async function loadDashboardData() {

    try {

        const response = await fetch('http://localhost:3000/api/dashboard');

        const data = await response.json();

        console.log('📊 Dashboard:', data);

        if (!data.ok) {
            console.error(data.message);
            return;
        }

        renderRealMetrics(data.dashboard);
        renderRecentPayments(data.dashboard.recentPayments);
        renderRecentActivity(data.dashboard);

    } catch (error) {

        console.error('❌ Error dashboard:', error);

    }

}



function renderRecentPayments(payments) {

    const container = document.getElementById('mainCardContent');

    if (!container) return;

    if (!payments.length) {

        container.innerHTML = `
            <p>No hay pagos recientes</p>
        `;

        return;

    }

    container.innerHTML = payments.map(payment => `

        <div class="payment-item">

            <div class="payment-info">

                <h4>${payment.student}</h4>

                <p>
                    ${new Date(payment.payment_date)
                        .toLocaleDateString()}
                </p>

            </div>

            <div class="payment-right">

                <span class="payment-amount">
                    $${payment.amount_paid}
                </span>

                <span class="payment-status ${payment.payment_method}">
                    ${payment.payment_method}
                </span>

            </div>

        </div>

    `).join('');

}


async function globalSearch(query) {

    try {

        const response = await fetch(
            `http://localhost:3000/api/search?q=${query}`
        );

        const result = await response.json();

        renderSearchResults(result.results);

    } catch (error) {

        console.error(error);

    }

}


function renderSearchResults(results) {

    const container =
        document.getElementById('searchResults');

    if (!container) return;

    const allResults = [
        ...results.students,
        ...results.guardians,
        ...results.users
    ];

    if (!allResults.length) {

        container.innerHTML = `
            <div class="search-empty">
                Sin resultados
            </div>
        `;

        return;

    }

    container.innerHTML = allResults.map(item => `

        <div class="search-item">

            <div>

                <h4>
                    ${item.first_name}
                    ${item.last_name}
                </h4>

                <p>${item.type}</p>

            </div>

        </div>

    `).join('');

}


function openStudentModal() {

    const modal =
        document.getElementById('studentModal');

    modal.classList.add('active');

}

function closeStudentModal() {

    const modal =
        document.getElementById('studentModal');

    modal.classList.remove('active');

}


async function createStudent(formData) {

    try {

        const response = await fetch(
            'http://localhost:3000/api/student',
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(formData)
            }
        );

        if (!response.ok) {
            throw new Error('Error creando estudiante');
        }

        alert('✅ Estudiante creado');

        closeStudentModal();

        loadDashboardData();

    } catch (error) {

        console.error(error);

    }

}



function openPaymentModal() {

    document
        .getElementById('paymentModal')
        .classList.add('active');

}

function closePaymentModal() {

    document
        .getElementById('paymentModal')
        .classList.remove('active');

}


function formatMySQLDate(date) {

    return date
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

}


async function createPayment(formData) {

    try {

        const payload = {

            id: crypto.randomUUID(),

            student_id: formData.student_id,

            account_receivable_id:
                crypto.randomUUID(),

            recorded_by_user_id: user.id,

            payment_date: formatMySQLDate(new Date()),

            amount_paid: formData.amount_paid,

            payment_method: formData.payment_method,

            reference: formData.reference,

            status: 'paid',

            created_at: formatMySQLDate(new Date())

        };

        console.log('📤 Payload:', payload);

        const response = await fetch(
            'http://localhost:3000/api/pago',
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(payload)
            }
        );

        const result = await response.json();

        console.log(result);

        if (!response.ok) {
            throw new Error(result.message || 'Error registrando pago');
        }

        alert('✅ Pago registrado');

        closePaymentModal();

        paymentForm.reset();

        loadDashboardData();

    } catch (error) {

        console.error(error);

    }

}



async function loadStudentsSelect() {

    try {

        const response = await fetch(
            'http://localhost:3000/api/student'
        );

        const students = await response.json();

        const select =
            document.getElementById(
                'paymentStudentSelect'
            );

        if (!select) return;

        select.innerHTML = `
            <option value="">
                Selecciona estudiante
            </option>
        `;

        students.forEach(student => {

            select.innerHTML += `
                <option value="${student.id}">
                    ${student.first_name}
                    ${student.last_name}
                </option>
            `;

        });

    } catch (error) {

        console.error(
            'Error cargando estudiantes',
            error
        );

    }

}


function renderRecentActivity(data) {

    const container =
        document.getElementById(
            'mainCardContent'
        );

    if (!container) return;

    const paymentsHTML =
        data.recentPayments.map(payment => `

            <div class="activity-item">

                <div class="activity-icon payment">
                    <i class="fas fa-dollar-sign"></i>
                </div>

                <div class="activity-info">

                    <h4>
                     ${payment.first_name}
                     ${payment.last_name}
                    </h4>
                    <p>
                      ${new Date(payment.created_at)
                     .toLocaleDateString()}
                    </p>

                </div>

                <span class="activity-amount">

                    $${Number(
                        payment.amount_paid
                    ).toLocaleString()}

                </span>

            </div>

        `).join('');

    const studentsHTML =
        data.newStudents.map(student => `

            <div class="activity-item">

                <div class="activity-icon student">
                    <i class="fas fa-user-graduate"></i>
                </div>

                <div class="activity-info">

                    <h4>
                        Nuevo estudiante
                    </h4>

                    <p>
                        ${student.first_name || 'Sin nombre'}
                        ${student.last_name || ''}
                    </p>

                </div>

                <span class="activity-grade">

                    ${student.grade || 'Sin grado'}

                </span>

            </div>

        `).join('');

    container.innerHTML =
        paymentsHTML + studentsHTML;

}


async function loadPendingPayments() {

    try {

        const response = await fetch(
            'http://localhost:3000/api/pago/pending'
        );

        const data = await response.json();

        renderPendingPayments(data);

    } catch (error) {

        console.error(error);

    }

}


function renderPendingPayments(payments) {

    const container =
        document.getElementById(
            'pendingPaymentsContainer'
        );

    if (!container) return;

    if (!payments.length) {

        container.innerHTML =
            `<p>No hay pagos pendientes</p>`;

        return;

    }

    container.innerHTML = payments.map(payment => `

        <div class="pending-item">

            <div>

                <h4>
                    ${payment.first_name}
                    ${payment.last_name}
                </h4>

                <p>
                    ${payment.guardian_phone}
                </p>

            </div>

            <div>

                <button
                    class="btn-whatsapp"
                    onclick="openWhatsapp(
                        '${payment.guardian_phone}',
                        '${payment.first_name}'
                    )"
                >

                    <i class="fab fa-whatsapp"></i>

                </button>

            </div>

        </div>

    `).join('');

}

window.openWhatsapp = (
    phone,
    student
) => {

    const message =
        `Hola, le recordamos el pago pendiente del estudiante ${student}.`;

    const url =
        `https://wa.me/57${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');

};


function renderAlerts(data) {

    const container =
        document.getElementById(
            'alertsContainer'
        );

    if (!container) return;

    container.innerHTML = `

        <div class="alert-card danger">

            <i class="fas fa-exclamation-circle"></i>

            <div>

                <h4>
                    ${data.overduePayments}
                    pagos vencidos
                </h4>

                <p>
                    Requieren atención inmediata
                </p>

            </div>

        </div>

        <div class="alert-card warning">

            <i class="fas fa-clock"></i>

            <div>

                <h4>
                    ${data.dueTomorrow}
                    pagos vencen mañana
                </h4>

                <p>
                    Recordatorio preventivo
                </p>

            </div>

        </div>

    `;

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

    //renderStats(config.stats);


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
    loadDashboardData();
    loadStudentsSelect();
    loadPendingPayments();


    const globalSearchInput =
    document.getElementById('globalSearch');

if (globalSearchInput) {

    globalSearchInput.addEventListener('input', (e) => {

        const value = e.target.value.trim();

        if (value.length < 2) return;

        globalSearch(value);

    });

}

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

    const btnOpenStudentModal =
    document.getElementById('btnOpenStudentModal');

const closeStudentBtn =
    document.getElementById('closeStudentModal');

const studentForm =
    document.getElementById('studentForm');

if (btnOpenStudentModal) {

    btnOpenStudentModal.addEventListener(
        'click',
        openStudentModal
    );

}

if (closeStudentBtn) {

    closeStudentBtn.addEventListener(
        'click',
        closeStudentModal
    );

}

if (studentForm) {

    studentForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        const formData =
            Object.fromEntries(
                new FormData(studentForm)
            );

        await createStudent(formData);

        studentForm.reset();

    });

}

const btnOpenPaymentModal =
    document.getElementById('btnOpenPaymentModal');

const closePaymentBtn =
    document.getElementById('closePaymentModal');

const paymentForm =
    document.getElementById('paymentForm');

if (btnOpenPaymentModal) {

    btnOpenPaymentModal.addEventListener(
        'click',
        openPaymentModal
    );

}

if (closePaymentBtn) {

    closePaymentBtn.addEventListener(
        'click',
        closePaymentModal
    );

}

if (paymentForm) {

    paymentForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        const formData = Object.fromEntries(
            new FormData(paymentForm)
        );

        await createPayment(formData);

        paymentForm.reset();

    });

}

});