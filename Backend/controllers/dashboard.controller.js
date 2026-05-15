import { getDashboardData } from '../models/dashboard.model.js';

export const getDashboard = async (req, res) => {

    try {

        const data = await getDashboardData();

        return res.status(200).json({
            ok: true,
            dashboard: data
        });

    } catch (err) {

        console.error('❌ Error dashboard:', err);

        return res.status(500).json({
            ok: false,
            message: 'Error en el servidor',
            error: err.message
        });

    }

};