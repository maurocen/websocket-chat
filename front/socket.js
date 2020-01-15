const socket = io.connect('http://localhost:3000');
let userNick = '';

function connectToChat(nick) {
    userNick = nick;
    window.userNick = nick;
    socket.emit('connected', { nick });

    socket.on('users-list', users => {
        console.log(users);
        users.filter(nick => nick !== userNick).forEach(addUserToChat);
    })

    socket.on('user-connected', ({ nick }) => {
        addUserToChat(nick);
    });

    socket.on('message-received', ({ message, nick, messageId }) => {
        if (nick !== userNick) {
            appendMessage(message, messageId, nick);
        } else {
            setMessageId(message, messageId)
        }
    });

    socket.on('like-received', ({ messageId, nick }) => {
        if (nick !== userNick) {
            addLikeToMessage(messageId);
        }
    });
}

function submitMessage(message) {
    console.log(userNick);
    socket.emit('message-sent', { message, nick: userNick });
}

function submitLikeMessage(messageId) {
    socket.emit('like-sent', { messageId, nick: userNick });
}