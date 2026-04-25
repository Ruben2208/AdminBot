// ============================================
// MÓDULO DE ESTUDIANTES - AdminBot
// ============================================

// URL base del API (ajusta según tu configuración)
const API_URL = 'http://localhost:3000/api';

// Estado global
let estudiantes = [];
let estudiantesFiltrados = [];
let modoEdicion = false;

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
    cargarEstudiantes();
    configurarBusqueda();
    mostrarUsuario();
});

function verificarSesion() {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
        window.location.href = '../auth/login.html';
    }
}

function mostrarUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const nombre = usuario.nombres || usuario.correo || 'Usuario';
    document.getElementById('userName').textContent = nombre;
}

function cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = '../auth/login.html';
}

// ============================================
// CARGAR ESTUDIANTES
// ============================================

async function cargarEstudiantes() {
    try {
        mostrarCargando(true);
        const response = await fetch(`${API_URL}/student`);
        
        if (!response.ok) {
            throw new Error('Error al cargar estudiantes');
        }

        estudiantes = await response.json();
        estudiantesFiltrados = [...estudiantes];
        
        actualizarStats();
        renderizarTabla();
    } catch (error) {
        console.error('Error:', error);
        mostrarToast('Error al cargar estudiantes', 'error');
    } finally {
        mostrarCargando(false);
    }
}

function actualizarStats() {
    document.getElementById('totalEstudiantes').textContent = estudiantes.length;
    
    const gradosUnicos = new Set(estudiantes.map(e => e.grade));
    document.getElementById('totalGrados').textContent = gradosUnicos.size;
}

// ============================================
// RENDERIZAR TABLA
// ============================================

function renderizarTabla() {
    const tbody = document.getElementById('tablaEstudiantes');
    const emptyState = document.getElementById('emptyState');
    const resultsCount = document.getElementById('resultsCount');

    if (estudiantesFiltrados.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'flex';
        resultsCount.textContent = '0 resultados';
        return;
    }

    emptyState.style.display = 'none';
    resultsCount.textContent = `${estudiantesFiltrados.length} resultado${estudiantesFiltrados.length !== 1 ? 's' : ''}`;

    tbody.innerHTML = estudiantesFiltrados.map(est => `
        <tr>
            <td><span class="badge badge-code">${est.student_code || 'N/A'}</span></td>
            <td>
                <div class="student-info">
                    <div class="student-avatar">
                        ${(est.first_name?.[0] || '')}${(est.last_name?.[0] || '')}
                    </div>
                    <div class="student-details">
                        <span class="student-name">${est.first_name || ''} ${est.last_name || ''}</span>
                    </div>
                </div>
            </td>
            <td><span class="badge">${est.document_type || 'N/A'}</span></td>
            <td>${est.document_number || 'N/A'}</td>
            <td>${formatearFecha(est.birth_date)}</td>
            <td><span class="badge badge-grade">${est.grade || 'N/A'}</span></td>
            <td>${est.school_year || 'N/A'}</td>
            <td>
                <div class="actions">
                    <button class="btn-action btn-edit" onclick="editarEstudiante('${est.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="eliminarEstudiante('${est.id}')" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ============================================
// BÚSQUEDA / FILTRADO
// ============================================

function configurarBusqueda() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase().trim();
        
        if (termino === '') {
            estudiantesFiltrados = [...estudiantes];
        } else {
            estudiantesFiltrados = estudiantes.filter(est => {
                const nombreCompleto = `${est.first_name || ''} ${est.last_name || ''}`.toLowerCase();
                return nombreCompleto.includes(termino) ||
                       (est.document_number || '').toLowerCase().includes(termino) ||
                       (est.student_code || '').toLowerCase().includes(termino) ||
                       (est.grade || '').toLowerCase().includes(termino);
            });
        }
        
        renderizarTabla();
    });
}

// ============================================
// MODAL - AGREGAR / EDITAR
// ============================================

function abrirModal(id = null) {
    const modal = document.getElementById('modalOverlay');
    const form = document.getElementById('formEstudiante');
    const title = document.getElementById('modalTitle');
    const btnGuardar = document.getElementById('btnGuardar');

    form.reset();
    document.getElementById('studentId').value = '';

    if (id) {
        // Modo edición
        modoEdicion = true;
        const estudiante = estudiantes.find(e => e.id === id);
        if (!estudiante) return;

        title.innerHTML = '<i class="fas fa-edit"></i> Editar Estudiante';
        btnGuardar.innerHTML = '<i class="fas fa-save"></i> Actualizar';

        document.getElementById('studentId').value = estudiante.id;
        document.getElementById('student_code').value = estudiante.student_code || '';
        document.getElementById('first_name').value = estudiante.first_name || '';
        document.getElementById('last_name').value = estudiante.last_name || '';
        document.getElementById('document_type').value = estudiante.document_type || '';
        document.getElementById('document_number').value = estudiante.document_number || '';
        document.getElementById('birth_date').value = estudiante.birth_date ? estudiante.birth_date.split('T')[0] : '';
        document.getElementById('grade').value = estudiante.grade || '';
        document.getElementById('school_year').value = estudiante.school_year || '';
    } else {
        // Modo creación
        modoEdicion = false;
        title.innerHTML = '<i class="fas fa-user-plus"></i> Nuevo Estudiante';
        btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar';
    }

    modal.classList.add('active');
}

function cerrarModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.remove('active');
    document.getElementById('formEstudiante').reset();
    modoEdicion = false;
}

// Cerrar modal al hacer clic fuera
document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        cerrarModal();
    }
});

// ============================================
// GUARDAR ESTUDIANTE (CREAR / ACTUALIZAR)
// ============================================

async function guardarEstudiante(event) {
    event.preventDefault();

    const datos = {
        student_code: document.getElementById('student_code').value.trim(),
        first_name: document.getElementById('first_name').value.trim(),
        last_name: document.getElementById('last_name').value.trim(),
        document_type: document.getElementById('document_type').value,
        document_number: document.getElementById('document_number').value.trim(),
        birth_date: document.getElementById('birth_date').value,
        grade: document.getElementById('grade').value,
        school_year: parseInt(document.getElementById('school_year').value)
    };

    try {
        const btnGuardar = document.getElementById('btnGuardar');
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

        const response = await fetch(`${API_URL}/student`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error('Error al guardar');
        }

        const resultado = await response.json();
        
        mostrarToast(
            modoEdicion ? 'Estudiante actualizado correctamente' : 'Estudiante creado correctamente',
            'success'
        );

        cerrarModal();
        await cargarEstudiantes();

    } catch (error) {
        console.error('Error:', error);
        mostrarToast('Error al guardar el estudiante', 'error');
    } finally {
        const btnGuardar = document.getElementById('btnGuardar');
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = modoEdicion 
            ? '<i class="fas fa-save"></i> Actualizar' 
            : '<i class="fas fa-save"></i> Guardar';
    }
}

// ============================================
// EDITAR ESTUDIANTE
// ============================================

function editarEstudiante(id) {
    abrirModal(id);
}

// ============================================
// ELIMINAR ESTUDIANTE
// ============================================

async function eliminarEstudiante(id) {
    const estudiante = estudiantes.find(e => e.id === id);
    const nombre = estudiante ? `${estudiante.first_name} ${estudiante.last_name}` : 'este estudiante';

    if (!confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
        return;
    }

    try {
        // Nota: Tu backend no tiene endpoint DELETE aún, pero preparo la estructura
        // Cuando lo agregues, descomenta esto:
        
        /*
        const response = await fetch(`${API_URL}/student/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar');
        }
        */

        // Por ahora, simulamos la eliminación local
        mostrarToast('Función de eliminar pendiente - Agrega el endpoint DELETE en el backend', 'warning');
        
        // Cuando tengas el endpoint, usa esto:
        // mostrarToast('Estudiante eliminado correctamente', 'success');
        // await cargarEstudiantes();

    } catch (error) {
        console.error('Error:', error);
        mostrarToast('Error al eliminar el estudiante', 'error');
    }
}

// ============================================
// UTILIDADES
// ============================================

function mostrarCargando(mostrar) {
    const tbody = document.getElementById('tablaEstudiantes');
    if (mostrar) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="loading-cell">
                    <i class="fas fa-spinner fa-spin"></i>
                    Cargando estudiantes...
                </td>
            </tr>
        `;
    }
}

function mostrarToast(mensaje, tipo = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    
    const iconos = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <i class="fas ${iconos[tipo] || iconos.info}"></i>
        <span>${mensaje}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// EXPORTAR FUNCIONES GLOBALES (para HTML onclick)
// ============================================

window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;
window.guardarEstudiante = guardarEstudiante;
window.editarEstudiante = editarEstudiante;
window.eliminarEstudiante = eliminarEstudiante;
window.cerrarSesion = cerrarSesion;