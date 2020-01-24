import tokenService from './services/tokenService';
import uaerService from './services/userService';
const socket = window.io();
let chatPage = null;
let chatroomsPage = null;



function registerApp(app) {
    chatPage = app;
}
function registerChatrooms(app){
    chatroomsPage = app
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
    console.log('chatroom: in socket: ', chatRoom)
    chatPage.setState({messages: chatRoom.message})
});


//---------------------------------------------------

export default {
    registerApp,
    sendMessage,
    registerChatrooms,
}