import { request} from '../../shared/js/api.js';
import {ValidarCorreo, limpiarError, mostrarError} from '../../shared/js/utils.js';
import {guardarUsuario} from '../../shared/js/storage.js';

const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const error = document.getElementById('errorMessage');
const boton = document.getElementById('button-primary');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    limpiarError();

    const correo = email.value.trim();
    const clave = password.value.trim();

    if (!ValidarCorreo(correo)) {
         mostrarError(error, 'correo invalido');
         return;
    }

    if(clave.length < 6){
       mostrarError(error, 'la contraseña debe tener minimo 6 caracteres');
    }

    try{}
    catch{}
    finally{}

 });


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


let currentRole = 'admin';

const roleCards = document.querySelectorAll('.role-card');
const roleSpecificContainer = document.getElementById('roleSpecificFields');
const loginForm = document.getElementById('loginForm');
const togglePasswordBtn = document.querySelector('.toggle-password');
const passwordInput = document.getElementById('password');


document.addEventListener('DOMContentLoaded', () => {
    updateRoleFields('admin');
});


roleCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remover active de todos
        roleCards.forEach(c => c.classList.remove('active'));
        // Agregar active al seleccionado
        card.classList.add('active');
        // Actualizar rol
        currentRole = card.dataset.role;
        updateRoleFields(currentRole);
    });
});


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


togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePasswordBtn.querySelector('i').classList.toggle('fa-eye');
    togglePasswordBtn.querySelector('i').classList.toggle('fa-eye-slash');
});


loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const data = {
        role: currentRole,
        email: formData.get('email'),
        password: formData.get('password'),
        remember: formData.get('remember') === 'on'
    };

    // Agregar campos específicos del rol
    const roleFields = roleSpecificContainer.querySelectorAll('input, select');
    roleFields.forEach(field => {
        data[field.name] = field.value;
    });

    
    if (!data.email || !data.password) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }

    
    const btn = loginForm.querySelector('.btn-login');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
    btn.disabled = true;

    try {
        // Aquí iría la llamada real al backend
        // const response = await fetch('/api/auth/login', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data),
        //     credentials: 'include'
        // });

        // Simulación de respuesta exitosa
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Redirección según rol
        const redirectUrls = {
            admin: '/pages/dashboard/index.html?role=admin',
            teacher: '/pages/dashboard/index.html?role=teacher',
            student: '/pages/dashboard/index.html?role=student',
            parent: '/pages/dashboard/index.html?role=parent'
        };

        showNotification('¡Bienvenido a AdminBot!', 'success');
        
        setTimeout(() => {
            window.location.href = redirectUrls[currentRole];
        }, 1000);

    } catch (error) {
        showNotification('Error al iniciar sesión. Verifica tus credenciales.', 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Remover notificación anterior si existe
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Estilos inline para la notificación
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

// Animaciones CSS adicionales
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