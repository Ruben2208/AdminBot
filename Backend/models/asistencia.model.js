import db from '../config/db.js';

export const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM asistencias');
  return rows;
};

export const create = async (data) => {
  const {
    id,
    estudiante_id,
    fecha,
    estado,
    hora_ingreso,
    hora_salida,
    observacion,
    registrado_por_id,
    created_at,
    updated_at
  } = data;

  const [result] = await db.query(
    `INSERT INTO asistencias (id, estudiante_id, fecha, estado, hora_ingreso, hora_salida, observacion, registrado_por_id, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [
      id,
      estudiante_id,
      fecha,
      estado,
      hora_ingreso,
      hora_salida,
      observacion,
      registrado_por_id,
      created_at,
      updated_at
    ]
  );
};
