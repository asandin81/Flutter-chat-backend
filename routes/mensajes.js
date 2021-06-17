// Path: /api/mensajes/{uid}

const { Router, response } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { obtenerChat } = require('../controlers/mensajes');

const router = Router();

router.get('/:de', validarJWT, obtenerChat);

module.exports = router;