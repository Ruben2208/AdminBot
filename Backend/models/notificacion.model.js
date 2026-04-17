import db from '../config/db.js';

export const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM notificaciones_whatsapp');
  return rows;
};

export const create = async (data) => {
  const {
    id,
    student_id,
    guardian_id,
    account_receivable_id,
    destination_phone,
    message,
    sent_at,
    delivery_status,
    created_at
  } = data;

  const [result] = await db.query(
    `INSERT INTO notificaciones_whatsapp (id, student_id, guardian_id, account_receivable_id, destination_phone, message, sent_at, delivery_status, created_at)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [
      id,
      student_id,
      guardian_id,
      account_receivable_id,
      destination_phone,
      message,
      sent_at,
      delivery_status,
      created_at
    ]
  );
};
