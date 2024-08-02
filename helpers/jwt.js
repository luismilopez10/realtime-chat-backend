const jwt = require('jsonwebtoken');

const generateJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid }; // Pueden ir más propiedades como uid, name, email...

        jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: '12h' // Se indica como 1m, 2m, 12h, 24h, 48h...
        }, (err, token) => {
            if (err) {
                // No se pudo crear el token
                reject('No se pudo generar el JWT');
                return;
            }

            // Sí se creó en token
            resolve(token);
        })
    });
}

const validateClientJWT = (token = '') => {
    try {
        const { uid } = jwt.verify(token, process.env.JWT_KEY);
        return [true, uid];
    } catch (error) {
        return [false, null];
    }
}

module.exports = { generateJWT, validateClientJWT }