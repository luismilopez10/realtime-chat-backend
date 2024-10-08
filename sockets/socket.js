const { io } = require('../index');
const { validateClientJWT } = require('../helpers/jwt');
const { connectedUser, disconnectedUser, saveMessage } = require('../controllers/socket');

io.on('connection', client => {
    console.log('Cliente conectado');

    const [validToken, uid] = validateClientJWT(client.handshake.headers['x-token']);

    // Se verifica la autenticación
    if (!validToken) {
        return client.disconnect();
    }

    // Cliente autenticado
    connectedUser(uid);
    console.log('Cliente autenticado');

    // Ingresar al usuario a una "sala privada"
    client.join(uid);

    // Escuchar del cliente el mensaje privado
    client.on('private-message', async (payload) => {
        const dbMessage = await saveMessage(payload);
        io.to(payload.to).emit('private-message', dbMessage);
        // io.to(payload.from).emit('private-message', dbMessage); //! Enviar un mensaje al Remitente de que su mensaje llegó al servidor
    });

    client.on('disconnect', () => {
        disconnectedUser(uid);
        console.log('Cliente desconectado');
    });
});