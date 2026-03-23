import { getAll, create } from '../models/pago.model.js';
import { randomUUID } from 'crypto';

export const getPago = async (req, res) => {
  try {
    const data = await getAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Ocurrió algo', err: error });
  }
};

export const createPago = async (req, res) => {
  try {
    const nuevo = {
      id: randomUUID(),
      ...req.body
    };
    await create(nuevo);
    res.status(201).json({ message: 'Pago creado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear', err: error });
  }
};
