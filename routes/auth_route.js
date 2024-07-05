/*
    path: /api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { createUser, login } = require('../controllers/auth_controller');
const { validateFields } = require('../middlewares/validar_campos');

const router = Router();

router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], createUser);

router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], login);

module.exports = router;