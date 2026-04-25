export const authMiddleware = (req, res, next) => {

    const auth = req.headers['x-auth']

    if (!auth){
        return res.status(401).json({message: 'No autorizado'})
    }
    next();
};