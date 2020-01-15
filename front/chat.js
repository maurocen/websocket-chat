const userColors = {};

function submitForm() {
    const messageInput = document.getElementById('text-input');
    const messageToSend = messageInput.value.replace('<', '&lt;').replace('>', '&gt;').trim();

    if (messageToSend) {
        appendMessage(messageToSend, null, 'YOU');
        messageInput.value = '';
        submitMessage(messageToSend);
    }
}

function appendMessage(message, messageId, sender) {
    const messagesContainer = document.getElementById('messages');
    const messageWrapper = document.createElement('div');
    const messageText = document.createElement('span');
    const messageLikes = document.createElement('div');
    const messageLikesHeart = document.createElement('span');
    const messageLikesCount = document.createElement('span');
    const date = new Date();
    const parsedDate = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    if (!messageId) {
        messageWrapper.className = 'own';
        messageText.style.color = userColors[userNick]; 
        messageLikes.style.color = userColors[userNick]; 
    }

    messageWrapper.id = messageId;
    messageLikesCount.id = 'message-likes:' + messageId;
    messageText.innerHTML = sender + ' (' + parsedDate + '): <i>' + message + '</i>';
    messageText.className = 'message-text'
    messageLikesCount.innerHTML = 0;
    messageLikesHeart.innerHTML = messageId ? '♡' : '❤️';
    messageLikes.appendChild(messageLikesHeart);
    messageLikes.appendChild(messageLikesCount);

    if (messageId) {
        messageLikesHeart.onclick = likeMessage(messageId);
        messageText.style.color = userColors[sender]; 
        messageLikes.style.color = userColors[sender]; 
    }

    messageWrapper.appendChild(messageText);
    messageWrapper.appendChild(messageLikes);
    messagesContainer.appendChild(messageWrapper);
    messagesContainer.scrollTo(0, messagesContainer.scrollTopMax);
}

function likeMessage(messageId) {
    return function() {
        addLikeToMessage(messageId);
        const likesCount = document.getElementById('message-likes:' + messageId);
        const likeHeart = likesCount.parentElement.firstChild;
        likeHeart.onclick = null;
        likeHeart.innerHTML = '❤️'
        submitLikeMessage(messageId);
    }
}

function addUserToChat(nick) {
    userColors[nick] = getRandomColor();
    const messagesContainer = document.getElementById('messages');
    const newUserMessage = document.createElement('div');

    newUserMessage.innerHTML = nick + ' has joined the conversation';
    newUserMessage.style.color = userColors[nick];
    newUserMessage.style.textAlign = 'center';
    newUserMessage.style.padding = '5px';
    newUserMessage.style.margin = '5px 0';
    newUserMessage.style.border = '1px solid ' + userColors[nick];
    messagesContainer.appendChild(newUserMessage);
}

function joinChat() {
    const nick = document.getElementById('nick').value;

    if (nick.trim()) {
        document.title = nick.trim();
        connectToChat(nick.trim());
        document.getElementById('chat').style = 'display: block;';
        document.body.removeChild(document.getElementById('join-chat'));
    }
}

function addLikeToMessage(messageId) {
    const likesCount = document.getElementById('message-likes:' + messageId);
    likesCount.innerHTML = parseInt(likesCount.innerText) + 1;
}

function setMessageId(message, messageId) {
    const ownMessages = [...document.getElementsByClassName('own')];
    const matchingMessages = ownMessages.filter(elem => elem.firstChild.innerText.match(message));
    const messageToSet = matchingMessages[0];
    messageToSet.className = '';
    messageToSet.children[1].children[1].id = 'message-likes:' + messageId;
}

function getRandomColor() {
    var letters = '0123456789AB';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 11)];
    }
    return color;
  }
  