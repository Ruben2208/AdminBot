import db from '../config/db.js';
import { randomUUID } from 'crypto';

export const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM students');
  return rows;
};

export const create = async (data) => {
  console.log(data)
  const { id, student_code,
     first_name, last_name, document_type,
      document_number, birth_date, grade, school_year } =
    data;

  const [result] = await db.query(
    `INSERT INTO students (id, student_code,
     first_name, last_name, document_type,
      document_number, birth_date, grade, school_year) VALUES (?,?,?,?,?,?,?,?,?)`,
    [id, student_code,
     first_name, last_name, document_type,
      document_number, birth_date, grade, school_year]
  );
};
