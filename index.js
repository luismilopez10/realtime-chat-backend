const express = require('express');
const path = require('path');
require('dotenv').config();

const port = process.env.PORT;

// DB Config
require('./database/config').dbConnection();

// App de Express
const app = express();

// Lectura y parseo del body
app.use(express.json());

// Node Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket.js');

// Path público
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// Mis rutas
app.use('/api/login', require('./routes/auth_route.js'));
app.use('/api/users', require('./routes/users.js'));
app.use('/api/messages', require('./routes/messages.js'));

server.listen(port, (error) => {
    if (error) throw new Error(error);

    console.log('Servidor corriendo en el puerto: ', port)
});