const { respones } = require('express');
const Usuario = require('../models/usuario');


const getUsuarios = async(req, res = 'response') => {

    const desde = Number(req.query.desde) || 0;


    const usuarios = await Usuario.find({ _id: { $ne: req.uid } }) // Obtinen todos menos mi id
        .sort('-online') //Ordena primero los conectados
        .skip(desde) // Paginacion
        .limit(20); // Muestra maximo 20 registros por pagina.

    res.json({
        ok: true,
        usuarios,
        desde
    });
}

module.exports = {
    getUsuarios
}