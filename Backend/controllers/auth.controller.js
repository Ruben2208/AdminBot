import bcrypt from 'bcrypt';
import { FindUserByEmail } from '../models/auth.model.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                message: 'Datos incompletos'
            });
        }

        const user = await FindUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({
                ok: false,
                message: 'Contraseña incorrecta'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Login exitoso',
            user: {
                id: user.id,
                first_name: user.first_name,   // ← TU columna
                last_name: user.last_name,       // ← TU columna
                email: user.email,
                role: user.role                 // ← TU columna (no 'rol')
            }
        });

    } catch (err) {
        console.error('Error en login:', err);
        return res.status(500).json({
            ok: false,
            message: 'Error del servidor',
            error: err.message
        });
    }
};