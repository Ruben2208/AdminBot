# AdminBot: Gestión de Asistencia y Pagos

Solución para centros educativos que centraliza asistencia, cobros y pagos de estudiantes, con notificaciones a acudientes vía WhatsApp. Backend en Node.js/Express con arquitectura MVC y MySQL.

## Características

- Registro de asistencias y estados diarios.
- Gestión de cuentas por cobrar y pagos.
- Notificaciones automáticas a acudientes.
- API REST modular por entidad.

## Arquitectura y Stack

- Node.js (ES Modules), Express 5, mysql2 (pool), cors, nodemon.
- Patrón MVC por entidad: models, controllers, routes separados.
- Base de datos MySQL compatible con el esquema suministrado.

## Estructura del Proyecto

- Configuración: Backend/config/db.js.
- Modelos: estudiantes, usuarios, acudientes, pagos, asistencias, notificaciones.
- Controladores: lógica HTTP por entidad.
- Rutas: endpoints REST por entidad.
- Entrada: Backend/app.js.

## Configuración Rápida

- Requisitos: Node.js 18+ y un servidor MySQL.
- Instalación: en carpeta Backend ejecutar npm install.
- Conexión: completar credenciales en Backend/config/db.js (host, user, password, database).
- Base de datos: crear tablas según el esquema SQL del proyecto.
- Arranque: en Backend ejecutar npm run dev.

## Endpoints Principales

- Base: /api
- Estudiantes: GET/POST /student.
- Usuarios: GET/POST /usuario.
- Acudientes: GET/POST /acudiente.
- Pagos: GET/POST /pago.
- Asistencias: GET/POST /asistencia.
- Notificaciones: GET/POST /notificacion.

## Buenas Prácticas

- Validar entrada y estados antes de insertar.
- Manejo uniforme de errores y respuestas.
- Transacciones para operaciones financieras.
- Timestamps consistentes y auditables.

## Estado

- db.js requiere credenciales reales de MySQL.
- app.js debe montar middlewares y rutas para exponer la API.
