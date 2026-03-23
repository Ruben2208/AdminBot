import { getAll, create } from '../models/notificacion.model.js';
import { randomUUID } from 'crypto';

export const getNotificacion = async (req, res) => {
  try {
    const data = await getAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Ocurrió algo', err: error });
  }
};

export const createNotificacion = async (req, res) => {
  try {
    const nuevo = {
      id: randomUUID(),
      ...req.body
    };
    await create(nuevo);
    res.status(201).json({ message: 'Notificación creada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear', err: error });
  }
};
