import db from '../config/db.js';

export const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM notificaciones_whatsapp');
  return rows;
};

export const create = async (data) => {
  const {
    id,
    estudiante_id,
    acudiente_id,
    cuenta_por_cobrar_id,
    telefono_destino,
    mensaje,
    fecha_envio,
    estado_envio,
    created_at
  } = data;

  const [result] = await db.query(
    `INSERT INTO notificaciones_whatsapp (id, estudiante_id, acudiente_id, cuenta_por_cobrar_id, telefono_destino, mensaje, fecha_envio, estado_envio, created_at)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [
      id,
      estudiante_id,
      acudiente_id,
      cuenta_por_cobrar_id,
      telefono_destino,
      mensaje,
      fecha_envio,
      estado_envio,
      created_at
    ]
  );
};
