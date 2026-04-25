import { validarCorreo, limpiarError, mostrarError } from '../../shared/js/utils.js';
import { guardarUsuario } from '../../shared/js/storage.js';


// ============================================
// CONFIGURACIÓN DE ROLES
// ============================================

const roleConfig = {
    admin: {
        icon: 'fa-user-shield',
        title: 'Acceso Administrativo',
        description: 'Gestión completa del sistema',
        fields: `
            <div class="role-field">
                <h4><i class="fas fa-building"></i> Datos de Institución</h4>
                <div class="form-group" style="margin-top: 0.75rem;">
                    <label>Código de institución</label>
                    <div class="input-icon">
                        <i class="fas fa-school"></i>
                        <input type="text" name="institution_code" placeholder="INST-2024-001" required>
                    </div>
                </div>
                <div class="form-group" style="margin-top: 0.75rem;">
                    <label>Nivel de acceso</label>
                    <select name="access_level" style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 2px solid var(--gray-200);">
                        <option value="super">Super Administrador</option>
                        <option value="admin">Administrador</option>
                        <option value="coordinator">Coordinador</option>
                    </select>
                </div>
            </div>
        `
    },
    teacher: {
        icon: 'fa-chalkboard-teacher',
        title: 'Portal Docente',
        description: 'Gestión de clases y calificaciones',
        fields: `
            <div class="role-field">
                <h4><i class="fas fa-id-card"></i> Verificación Docente</h4>
                <div class="form-group" style="margin-top: 0.75rem;">
                    <label>Código de docente</label>
                    <div class="input-icon">
                        <i class="fas fa-hashtag"></i>
                        <input type="text" name="teacher_code" placeholder="DOC-12345" required>
                    </div>
                </div>
                <div class="form-group" style="margin-top: 0.75rem;">
                    <label>Área de enseñanza</label>
                    <select name="department" style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 2px solid var(--gray-200);">
                        <option value="">Selecciona un área...</option>
                        <option value="math">Matemáticas</option>
                        <option value="science">Ciencias Naturales</option>
                        <option value="language">Lenguaje y Literatura</option>
                        <option value="history">Historia y Sociales</option>
                        <option value="english">Inglés</option>
                        <option value="arts">Artes y Educación Física</option>
                    </select>
                </div>
            </div>
        `
    },
    student: {
        icon: 'fa-user-graduate',
        title: 'Portal Estudiantil',
        description: 'Consulta de notas y horarios',
        fields: `
            <div class="role-field">
                <h4><i class="fas fa-graduation-cap"></i> Información Académica</h4>
                <div class="form-group" style="margin-top: 0.75rem;">
                    <label>Número de matrícula</label>
                    <div class="input-icon">
                        <i class="fas fa-hashtag"></i>
                        <input type="text" name="student_id" placeholder="202400123" required>
                    </div>
                </div>
                <div class="form-group" style="margin-top: 0.75rem;">
                    <label>Grado actual</label>
                    <select name="grade" style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 2px solid var(--gray-200);">
                        <option value="">Selecciona tu grado...</option>
                        <option value="6">Sexto</option>
                        <option value="7">Séptimo</option>
                        <option value="8">Octavo</option>
                        <option value="9">Noveno</option>
                        <option value="10">Décimo</option>
                        <option value="11">Undécimo</option>
                    </select>
                </div>
            </div>
        `
    },
    parent: {
        icon: 'fa-user-friends',
        title: 'Portal Acudientes',
        description: 'Seguimiento del proceso académico',
        fields: `
            <div class="role-field">
                <h4><i class="fas fa-child"></i> Vinculación Estudiantil</h4>
                <div class="form-group" style="margin-top: 0.75rem;">
                    <label>Documento del acudiente</label>
                    <div class="input-icon">
                        <i class="fas fa-id-card"></i>
                        <input type="text" name="parent_id" placeholder="1234567890" required>
                    </div>
                </div>
                <div class="form-group" style="margin-top: 0.75rem;">
                    <label>Documento del estudiante</label>
                    <div class="input-icon">
                        <i class="fas fa-user"></i>
                        <input type="text" name="student_doc" placeholder="Documento del hijo/a" required>
                    </div>
                </div>
                <div class="form-group" style="margin-top: 0.75rem;">
                    <label>Parentesco</label>
                    <select name="relationship" style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 2px solid var(--gray-200);">
                        <option value="">Selecciona parentesco...</option>
                        <option value="father">Padre</option>
                        <option value="mother">Madre</option>
                        <option value="guardian">Tutor legal</option>
                        <option value="other">Otro</option>
                    </select>
                </div>
            </div>
        `
    }
};


// ============================================
// VARIABLES GLOBALES
// ============================================

let currentRole = 'admin';

const roleCards = document.querySelectorAll('.role-card');
const roleSpecificContainer = document.getElementById('roleSpecificFields');


// ============================================
// FUNCIONES DE ROLES
// ============================================

function updateRoleFields(role) {
    const config = roleConfig[role];
    if (config) {
        roleSpecificContainer.innerHTML = config.fields;
        roleSpecificContainer.classList.add('active');

        // Animación de entrada
        roleSpecificContainer.style.animation = 'none';
        setTimeout(() => {
            roleSpecificContainer.style.animation = 'slideDown 0.3s ease';
        }, 10);
    }
}

// Selección de rol por cards
roleCards.forEach(card => {
    card.addEventListener('click', () => {
        roleCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        currentRole = card.dataset.role;
        updateRoleFields(currentRole);
    });
});


// ============================================
// NOTIFICACIONES
// ============================================

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#4f46e5'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}


// ============================================
// INICIALIZACIÓN PRINCIPAL
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ========== PROTECCIÓN: Solo ejecutar en login ==========
    const loginForm = document.getElementById('loginForm');

    if (!loginForm) {
        // No es la página de login, salir silenciosamente
        return;
    }
    // ========================================================

    console.log('DOM cargado - Página de login detectada');

    const togglePasswordBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // 👁 Toggle contraseña
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            togglePasswordBtn.querySelector('i').classList.toggle('fa-eye');
            togglePasswordBtn.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // 🚀 Submit login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        console.log('Formulario enviado');

        // Limpiar errores previos
        limpiarError();

        // Obtener valores directamente de los inputs
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';

        // ========== VALIDACIONES FRONTEND ==========
        if (!email) {
            mostrarError(document.getElementById('error-email'), 'El correo es obligatorio');
            showNotification('El correo es obligatorio', 'error');
            return;
        }

        if (!validarCorreo(email)) {
            mostrarError(document.getElementById('error-email'), 'Correo inválido');
            showNotification('Ingresa un correo válido', 'error');
            return;
        }

        if (!password) {
            mostrarError(document.getElementById('error-password'), 'La contraseña es obligatoria');
            showNotification('La contraseña es obligatoria', 'error');
            return;
        }

        if (password.length < 6) {
            mostrarError(document.getElementById('error-password'), 'Mínimo 6 caracteres');
            showNotification('La contraseña debe tener mínimo 6 caracteres', 'error');
            return;
        }

        // ========== PREPARAR DATOS ==========
        const data = {
            role: currentRole,
            email: email,
            password: password
        };

        console.log('Datos a enviar:', data);

        // Botón de carga
        const btnSubmit = loginForm.querySelector('button[type="submit"]');
        const textoOriginal = btnSubmit ? btnSubmit.textContent : 'Ingresar';
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Ingresando...';
        }

        try {
            console.log('📤 DATOS ENVIADOS:', JSON.stringify(data, null, 2));

            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            console.log('📥 STATUS:', response.status);

            const contentType = response.headers.get('content-type');
            console.log('📥 CONTENT-TYPE:', contentType);

            let result;

            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
                console.log('📥 RESPUESTA JSON:', result);
            } else {
                const text = await response.text();
                console.log('📥 RESPUESTA TEXTO:', text);
                throw new Error('El servidor no devolvió JSON. ¿Está corriendo el backend?');
            }

            if (!response.ok) {
                console.error('❌ ERROR DEL SERVIDOR:', result);
                throw new Error(result.message || result.error || `Error ${response.status} del servidor`);
            }

            // ========== ÉXITO ==========
            guardarUsuario(result.user);
            showNotification('¡Bienvenido! Redirigiendo...', 'success');

            setTimeout(() => {
                window.location.href = '../../pages/dashboard/index.html';
            }, 1000);

        } catch (error) {
            console.error('❌ ERROR REAL:', error);
            showNotification(error.message || 'Error de conexión con el servidor', 'error');

        } finally {
            // Restaurar botón
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.textContent = textoOriginal;
            }
        }
    });
});


// ============================================
// ANIMACIONES CSS
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);