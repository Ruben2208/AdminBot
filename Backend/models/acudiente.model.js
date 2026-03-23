import db from '../config/db.js';

export const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM acudientes');
  return rows;
};

export const create = async (data) => {
  const {
    id,
    nombres,
    apellidos,
    telefono,
    correo,
    direccion,
    whatsapp_activo,
    created_at,
    updated_at
  } = data;

  const [result] = await db.query(
    `INSERT INTO acudientes (id, nombres, apellidos, telefono, correo, direccion, whatsapp_activo, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [id, nombres, apellidos, telefono, correo, direccion, whatsapp_activo, created_at, updated_at]
  );
};
