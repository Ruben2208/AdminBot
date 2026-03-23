import express from 'express';
import { getAsistencia, createAsistencia } from '../controllers/asistencia.controller.js';

const route = express.Router();

route.get('/asistencia', getAsistencia);
route.post('/asistencia', createAsistencia);

export default route;
