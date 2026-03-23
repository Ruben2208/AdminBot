import express from 'express';
import { getPago, createPago } from '../controllers/pago.controller.js';

const route = express.Router();

route.get('/pago', getPago);
route.post('/pago', createPago);

export default route;
