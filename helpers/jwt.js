const jwt = require("jsonwebtoken");
const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {

        const payload = { uid };
        jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                // no se creo el token
                reject('No se pudo generar el JWT');
            } else {
                // retorna el token
                console.log(token);
                resolve(token);
            }
        });

    });
}
const comprobarJWT = (token) => {

    try {

        const { uid, iat } = jwt.verify(token, process.env.JWT_KEY);
        console.log(iat);
        console.log(uid);
        return [true, uid];

    } catch (error) {
        return [false, null];
    }

}



module.exports = {
    generarJWT,
    comprobarJWT
}