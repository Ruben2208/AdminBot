import express from 'express';
import { getAcudiente, createAcudiente } from '../controllers/acudiente.controller.js';

const route = express.Router();

route.get('/acudiente', getAcudiente);
route.post('/acudiente', createAcudiente);

export default route;
