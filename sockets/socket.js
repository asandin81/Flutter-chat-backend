const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controlers/socket');
const { isValidObjectId } = require('mongoose');


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token'])

    console.log(valido, uid);

    // Verifica autentificacion
    if (!valido) { return client.disconnect; }

    // cliente autentificado.
    usuarioConectado(uid);

    // Ingresar al usuario en una sala
    // Sala Global, Sala por id -> client.id, sala por id de MongoDb
    client.join(uid);

    //
    client.on('mensaje-personal', async(payload) => {
        await grabarMensaje(payload)
        io.to(payload.para).emit('mensaje-personal', payload);
    });


    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje', payload);

        io.emit('mensaje', { admin: 'Nuevo mensaje' });

    });


});