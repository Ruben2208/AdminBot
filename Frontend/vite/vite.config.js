// vite.config.js
export default {
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        login: 'src/pages/auth/login.html',
        dashboard: 'src/pages/dashboard/dashboard.html',
        estudiantes: 'src/pages/estudiantes/estudiantes.html', // ← Agrega esto
      }
    }
  }
}