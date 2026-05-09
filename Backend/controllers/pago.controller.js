import {
  getAll,
  create,
  updateStatus,
  getPendingPayments
} from '../models/pago.model.js';

import { randomUUID } from 'crypto';

export const getPago = async (req, res) => {

  try {

    const data = await getAll();

    res.status(200).json(data);

  } catch (error) {

    res.status(500).json(error);

  }

};

export const createPago = async (req, res) => {

  try {

    const payment = {
      id: randomUUID(),
      ...req.body,
      created_at: new Date()
    };

    await create(payment);

    res.status(201).json({
      message:'Pago creado'
    });

  } catch (error) {

    res.status(500).json(error);

  }

};

export const updatePagoStatus = async (req, res) => {

  try {

    const { id } = req.params;

    const { status } = req.body;

    await updateStatus(id, status);

    res.status(200).json({
      message:'Pago actualizado'
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