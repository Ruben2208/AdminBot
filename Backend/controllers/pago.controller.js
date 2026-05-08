import { getAll, create, getPendingPayments } from '../models/pago.model.js';
import { randomUUID } from 'crypto';
import db from '../config/db.js';
import { updateStatus } from '../models/pago.model.js';


export const getPendingStudents = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
        s.id,
        s.first_name,
        s.last_name,
        s.guardian_phone,
        p.status
      FROM students s
      LEFT JOIN pagos p
        ON s.id = p.student_id
      WHERE p.status IS NULL
      OR p.status = 'pending'
    `);

    res.status(200).json(rows);

  } catch (error) {
    res.status(500).json(error);
  }

};

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

export const updatePagoStatus = async (req, res) => {

  try {

    const { id } = req.params;
    const { status } = req.body;

    await updateStatus(id, status);

    res.status(200).json({
      message:'Estado actualizado'
    });

  } catch (error) {
    res.status(500).json(error);
  }

};

export const getPendientes = async (req, res) => {

  try {

    const data = await getPendingPayments();

    res.status(200).json(data);

  } catch (error) {

    res.status(500).json(error);

  }

};