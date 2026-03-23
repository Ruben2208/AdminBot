import db from '../config/db.js';

export const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM pagos');
  return rows;
};

export const create = async (data) => {
  const {
    id,
    cuenta_por_cobrar_id,
    registrado_por_id,
    fecha_pago,
    valor_pagado,
    metodo_pago,
    referencia,
    created_at
  } = data;

  const [result] = await db.query(
    `INSERT INTO pagos (id, cuenta_por_cobrar_id, registrado_por_id, fecha_pago, valor_pagado, metodo_pago, referencia, created_at)
     VALUES (?,?,?,?,?,?,?,?)`,
    [id, cuenta_por_cobrar_id, registrado_por_id, fecha_pago, valor_pagado, metodo_pago, referencia, created_at]
  );
};
