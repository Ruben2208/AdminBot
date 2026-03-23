import express from 'express';
import { getUsuario, createUsuario } from '../controllers/usuario.controller.js';

const route = express.Router();

route.get('/usuario', getUsuario);
route.post('/usuario', createUsuario);

export default route;
