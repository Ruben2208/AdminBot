import db from '../config/db.js';

export const FindUserByEmail = async (email) => {
    const [rows] = db.query ('SELECT id, frist_name, last_name, password_hash FROM users WHERE email = ?', [email])

    return rows[0];

}