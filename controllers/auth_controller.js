const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const emailAlreadyExist = await User.findOne({ email: email });
        if (emailAlreadyExist) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya se encuentra registrado'
            });
        }

        const user = new User(req.body);

        // Encriptar contraseña:
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        // Generar mi JWT
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user,
            token
            // body: req.body
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al intentar crear el usuario, hable con el administrador'
        });
    }
}

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const dbUser = await User.findOne({ email }); // Enviar solo el email es lo mismo que email: email
        if (!dbUser) {
            return res.status(404).json({
                ok: false,
                msg: 'El correo no se encuentra registrado'
            });
        }

        // Validar el password
        const validPassword = bcrypt.compareSync(password, dbUser.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es válida'
            });
        }

        // Generar el JWT
        const token = await generateJWT(dbUser.id);

        res.json({
            ok: true,
            user: dbUser,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al iniciar sesión, hable con el administrador'
        });
    }
}

const renewToken = async (req, res = response) => {
    const uid = req.uid;

    // Generar el JWT
    const token = await generateJWT(uid);

    const user = await User.findById(uid);

    res.json({
        ok: true,
        user: user,
        token
    });
}

module.exports = { createUser, login, renewToken }