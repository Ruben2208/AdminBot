// ============================================
// storage.js - Gestión de sesión AdminBot
// ============================================

const STORAGE_KEY = 'usuario';

export function guardarUsuario(usuario) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

export function obtenerUsuario() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;  // ✅ Maneja null
}

export function cerrarSesion() {
    localStorage.removeItem(STORAGE_KEY);
}

export function estaAutenticado() {
    return obtenerUsuario() !== null;  // ✅ Retorna true/false
}

// Alias para compatibilidad (opcional)
export const eliminarUsuario = cerrarSesion;