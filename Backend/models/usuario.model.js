import db from '../config/db.js';

export const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM usuarios');
  return rows;
};

export const create = async (data) => {
  const {
    id,
    nombres,
    apellidos,
    correo,
    password_hash,
    telefono,
    rol,
    activo,
    created_at,
    updated_at
  } = data;

  const [result] = await db.query(
    `INSERT INTO usuarios (id, nombres, apellidos, correo, password_hash, telefono, rol, activo, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [id, nombres, apellidos, correo, password_hash, telefono, rol, activo, created_at, updated_at]
  );
};
