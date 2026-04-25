export function validarCorreo(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function mostrarError(elemento, mensaje) {
    if (!elemento) return;
    elemento.textContent = mensaje;
    elemento.classList.add('visible');
    const formGroup = elemento.closest('.form-group');
    if (formGroup) formGroup.classList.add('has-error');
}

export function limpiarError() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.classList.remove('visible');
    });
    document.querySelectorAll('.form-group.has-error').forEach(el => {
        el.classList.remove('has-error');
    });
}