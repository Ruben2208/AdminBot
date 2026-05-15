import { globalSearch } from '../models/search.model.js';

export const searchData = async (req, res) => {

    try {

        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                ok: false,
                message: 'Query requerida'
            });
        }

        const results = await globalSearch(q);

        return res.status(200).json({
            ok: true,
            results
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            message: 'Error en búsqueda'
        });

    }

};