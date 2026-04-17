import db from '../config/db.js';

export const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM asistencias');
  return rows;
};

export const create = async (data) => {
  const {
    id,
    student_id,
    attendance_date,
    status,
    check_in_time,
    check_out_time,
    observation,
    recorded_by_user_id,
    created_at,
    updated_at
  } = data;

  const [result] = await db.query(
    `INSERT INTO asistencias (id, student_id, attendance_date, status, check_in_time, check_out_time, observation, recorded_by_user_id, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [
      id,
      student_id,
      attendance_date,
      status,
      check_in_time,
      check_out_time,
      observation,
      recorded_by_user_id,
      created_at,
      updated_at
    ]
  );
};
