const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {
    // Leer el token: Normalmente se una 'Authorization' en los headers, pero en este caso usamos 'x-token', haciendo referencia a una propiedad personalizada
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    // Validar si el token existe
    try {
        const { uid } = jwt.verify(token, process.env.JWT_KEY);
        req.uid = uid;

        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

}

module.exports = { validateJWT }