import tokenService from './services/tokenService';
// const socket = window.io();
import socketIOClient from 'socket.io-client'

export const socket = socketIOClient('http://127.0.0.1:3001')



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
// socket.on('send-message', function(chatRoom) {
//     console.log(chatRoom)
//     chatPage.setState({messages: chatRoom.messages})
// });

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