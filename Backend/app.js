import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";

// 👇 SOCKET.IO
import http from "http";
import { Server } from "socket.io";

// 👇 CONFIGURAR ENV
dotenv.config();

// 👇 CREAR APP
const app = express();

// 👇 CREAR SERVIDOR HTTP
const server = http.createServer(app);

// 👇 SOCKET SERVER
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// 👇 GUARDAR SOCKET GLOBALMENTE
app.set('io', io);

// 👇 EVENTOS SOCKET
io.on('connection', (socket) => {

    console.log('🟢 Cliente conectado:', socket.id);

    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado');
    });

});

// 👇 MIDDLEWARES
app.use(cors());
app.use(express.json());

// 👇 IMPORTAR RUTAS
import studenRoutes from './routes/students.route.js';
import acudienteRoutes from './routes/acudientes.route.js';
import pagoRoutes from './routes/pagos.route.js';
import usuarioRoutes from './routes/usuarios.route.js';
import asistenciaRoutes from './routes/asistencias.route.js';
import notificacionRoutes from './routes/notificacion.route.js';
import authRoutes from './routes/auth.route.js';
import dashboardRoutes from './routes/dashboard.route.js';
import whatsappRoutes from './modules/whatsapp/whatsapp.routes.js';
import searchRoutes from './routes/search.route.js';

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
app.use('/api', searchRoutes);

// 👇 RUTA BASE
app.get("/", (req, res) => {
    res.send("Api funcionando");
});

// 👇 PUERTO
const PORT = 3000;

// 👇 LEVANTAR SERVIDOR
server.listen(PORT, () => {
    console.log("🚀 Servidor corriendo en localhost:" + PORT);
});