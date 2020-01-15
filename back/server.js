const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');
let messageId = 0;
let users = [];

app.options('*', cors());
app.use(cors());

server.listen(3000, () => {
    console.log('Listening...')
});

io.on('connection', socket => {
    let userNick;

    socket.on('message-sent', ({ nick, message }) => {
        console.log(`${nick} said: ${message}`);
        messageId += 1;
        io.emit('message-received', { nick, message, messageId });
    });

    socket.on('like-sent', ({ nick, messageId }) => {
        io.emit('like-received', { nick, messageId });
    });

    socket.on('connected', ({ nick }) => {
        users.push(nick);
        userNick = nick;
        console.log(`+++ ${nick} connected +++`)
        io.emit('user-connected', { nick });
        socket.emit('users-list', users);
    });

    socket.on('disconnect', () => {
        console.log(`--- ${userNick} disconnected ---`)
        users = users.filter(nick => nick !== userNick);
    });
});