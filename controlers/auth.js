const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async(req, res = response) => {

    // se obtiene el email del cuerpo de la peticion. Si no esta no siguie la ejecucion.
    const { email, password } = req.body;
    try {
        const existeEmail = await Usuario.findOne({ email }); // = {email: emial}
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ja esta registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        usuario.save();

        // Generar mi JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Hable con el administrador' });
    }

}

const login = async(req, res = response) => {
    const { email, password } = req.body;
    try {
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'email no encontrado'
            })
        }
        const validarPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validarPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }

        const token = await generarJWT(usuarioDB.id);
        return res.json({
            ok: true,
            usuarioDB,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const renewToken = async(req, res = response) => {

    // const uid
    const uid = req.id;
    //generar JWT
    const token = await generarJWT(uid);
    // Obtener el usuario por uid
    const usuario = await Usuario.findOne({ uid });

    return res.json({
        ok: true,
        usuario,
        token
    });
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}