import db from '../config/db.js';

export const FindUserByEmail = async (email) => {
    const [rows] = db.query ('SELECT id, nombres, apellidos, password_hash FROM usuarios WHERE correro = ?', [correro])

    return rows[0];

}