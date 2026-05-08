import { getAll, create } from '../models/notificacion.model.js';
import { randomUUID } from 'crypto';


export const sendWhatsappReminder = async (req, res) => {

  try {

    const {
      phone,
      student
    } = req.body;

    const message =
    `Hola, le recordamos que el pago del estudiante ${student} se encuentra pendiente.`;

    const url =
    `https://wa.me/57${phone}?text=${encodeURIComponent(message)}`;

    res.status(200).json({
      url
    });

  } catch (error) {
    res.status(500).json(error);
  }

};

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
