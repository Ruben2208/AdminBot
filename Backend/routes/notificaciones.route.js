import express from 'express';
import { getNotificacion, createNotificacion } from '../controllers/notificacion.controller.js';

const route = express.Router();

route.get('/notificacion', getNotificacion);
route.post('/notificacion', createNotificacion);

export default route;
