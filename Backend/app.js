import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";

// 👇 CONFIGURAR ENV
dotenv.config();

// 👇 CREAR APP (PRIMERO)
const app = express();

// 👇 MIDDLEWARES
app.use(cors());
app.use(express.json());

// 👇 IMPORTAR RUTAS
import studenRoutes from './routes/students.route.js';
import acudienteRoutes from './routes/acudientes.route.js';
import pagoRoutes from './routes/pagos.route.js';
import usuarioRoutes from './routes/usuarios.route.js';
import asistenciaRoutes from './routes/asistencias.route.js';
import notificacionRoutes from './routes/notificaciones.route.js';
import authRoutes from './routes/auth.route.js';
import dashboardRoutes from './routes/dashboard.route.js';
import whatsappRoutes from './modules/whatsapp/whatsapp.routes.js';

// 👇 USAR RUTAS
app.use('/api', studenRoutes);
app.use('/api', acudienteRoutes);
app.use('/api', pagoRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', asistenciaRoutes);
app.use('/api', notificacionRoutes);
app.use('/api', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', whatsappRoutes);

// 👇 RUTA BASE
app.get("/", (req, res) => {
    res.send("Api funcionando");
});

// 👇 PUERTO
const PORT = 3000;

// 👇 LEVANTAR SERVIDOR
app.listen(PORT, () => {
    console.log("Servidor corriendo LocalHost..." + PORT);
});