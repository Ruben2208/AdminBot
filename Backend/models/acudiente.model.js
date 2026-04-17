import db from '../config/db.js';

export const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM acudientes');
  return rows;
};

export const create = async (data) => {
  const {
    id,
    frist_name,
    last_name,
    phone,
    email,
    address,
    whatsapp_active,
    created_at,
    updated_at
  } = data;

  const [result] = await db.query(
    `INSERT INTO acudientes (id, frist_name, last_name, phone, email, address, whatsapp_active, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [id, frist_name, last_name, phone, email, address, whatsapp_active, created_at, updated_at]
  );
};
