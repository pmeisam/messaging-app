import tokenService from './services/tokenService';
const socket = window.io();
let chatPage = null;

function registerApp(app) {
    chatPage = app;
}
//------------------------click-submit----------------
function sendMessage({content, chatRoomId}) {
    const token = tokenService.getToken();
    socket.emit('send-message',{
        content,
        chatRoomId,
        token
    })
}
socket.on('send-message', function(chatRoom) {
    chatPage.setState({messages: chatRoom.messages})
});

function messageSeen({userId, messageId, chatRoomId}) {
    const token = tokenService.getToken();
    socket.emit('message-seen', {
        userId, messageId, chatRoomId, token
    })
}

//---------------------------------------------------

export default {
    registerApp,
    sendMessage,
    messageSeen
}