import db from '../config/db.js';

export const getAll = async () => {
  const [rows] = await db.query(`
    SELECT 
      p.*,
      s.first_name,
      s.last_name
    FROM payments p
    LEFT JOIN students s
      ON s.id = p.student_id
  `);

  return rows;
};

export const create = async (data) => {

  const {
    id,
    student_id,
    account_receivable_id,
    recorded_by_user_id,
    payment_date,
    amount_paid,
    payment_method,
    reference,
    status,
    created_at
  } = data;

  await db.query(
    `
    INSERT INTO payments
    (
      id,
      student_id,
      account_receivable_id,
      recorded_by_user_id,
      payment_date,
      amount_paid,
      payment_method,
      reference,
      status,
      created_at
    )
    VALUES (?,?,?,?,?,?,?,?,?,?)
    `,
    [
      id,
      student_id,
      account_receivable_id,
      recorded_by_user_id,
      payment_date,
      amount_paid,
      payment_method,
      reference,
      status,
      created_at
    ]
  );
};

export const updateStatus = async (id, status) => {

  await db.query(
    `
    UPDATE payments
    SET status = ?
    WHERE id = ?
    `,
    [status, id]
  );

};

export const getPendingPayments = async () => {

  const [rows] = await db.query(`
    SELECT 
      p.*,
      s.first_name,
      s.last_name,
      s.guardian_phone
    FROM payments p
    LEFT JOIN students s
      ON s.id = p.student_id
    WHERE p.status = 'pending'
  `);

  return rows;
};