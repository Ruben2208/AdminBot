import { getAll, create } from '../models/student.model.js';
import { randomUUID } from 'crypto';

export const createStudent = async (req, res) => {

  try {

    const student = {
      id: randomUUID(),
      student_code: req.body.student_code || `ST-${Date.now()}`,
      ...req.body
    };

    await create(student);

    res.status(201).json(student);

  } catch (error) {

    res.status(500).json({
      message: 'Error al crear',
      err: error
    });

  }

};

export const getStudent = async (req, res) => {
  try {
    const data = await getAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Ocurrió algo', err: error });
  }
};


