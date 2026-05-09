import express from 'express';
import {
  getPago,
  createPago,
  updatePagoStatus,
  getPendientes
} from '../controllers/pago.controller.js';


const route = express.Router();

route.get('/pago', getPago);
route.post('/pago', createPago);
route.put('/pago/:id', updatePagoStatus);
route.get('/pagos/pendientes', getPendientes);

export default route;
