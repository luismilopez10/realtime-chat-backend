const { response } = require('express');
const User = require('../models/user');

const getUsers = async (req, res = response) => {
    try {
        const from = Number(req.query.from) || 0;

        const dbUsers = await User
            .find({ _id: { $ne: req.uid } })
            .sort('-online')
            .skip(from)
            .limit(50);

        res.json({
            ok: true,
            from,
            users: dbUsers
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al consultar contactos, hable con el administrador'
        });
    }
}

module.exports = {
    getUsers,
}