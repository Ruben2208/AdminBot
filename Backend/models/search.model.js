import db from '../config/db.js';

export const globalSearch = async (query) => {

    const search = `%${query}%`;

    // ESTUDIANTES
    const [students] = await db.query(`
        SELECT
            id,
            first_name,
            last_name,
            student_code,
            'student' AS type
        FROM students
        WHERE
            first_name LIKE ?
            OR last_name LIKE ?
            OR document_number LIKE ?
    `, [search, search, search]);

    // ACUDIENTES
    const [guardians] = await db.query(`
        SELECT
            id,
            first_name,
            last_name,
            phone,
            'guardian' AS type
        FROM guardians
        WHERE
            first_name LIKE ?
            OR last_name LIKE ?
            OR phone LIKE ?
    `, [search, search, search]);

    // USUARIOS
    const [users] = await db.query(`
        SELECT
            id,
            first_name,
            last_name,
            email,
            role,
            'user' AS type
        FROM users
        WHERE
            first_name LIKE ?
            OR last_name LIKE ?
            OR email LIKE ?
    `, [search, search, search]);

    return {
        students,
        guardians,
        users
    };

};