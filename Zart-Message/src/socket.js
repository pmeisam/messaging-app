import tokenService from './services/tokenService';
import userService from './services/userService';
// const socket = window.io();
import socketIOClient from 'socket.io-client'
export const socket = socketIOClient('http://127.0.0.1:3001')




// let chatWindow = null;
let chatRoom = null;
// function registerChatWindow(app) {
//     chatWindow = app;
// }
function registerChatRoom(app) {
    chatRoom = app;
}





function getChats({user}) {
    const token = tokenService.getToken();
    socket.emit('get-chats', {
        user,
        token
    })
}
socket.on('get-chats', function(latestChat) {
    chatRoom.setState({latestChat})
})


function sendMessage({content, chatRoomId}) {
    const token = tokenService.getToken();
    socket.emit('send-message',{
        content,
        chatRoomId,
        token
    })
}
// socket.on('send-message', function(chatRoom) {
//     chatWindow.setState({messages: chatRoom.messages})
// });



function findChat({userId}) {
    const token = tokenService.getToken();
    const loggedInUserId = userService.getUser()._id;
    socket.emit('find-chat', {
        userId,
        loggedInUserId,
        token
    });
}
socket.on('find-chat', function(chat) {
    chatRoom.setState({chat});
})

function messageSeen({userId, messageId, chatRoomId}) {
    const token = tokenService.getToken();
    socket.emit('message-seen', {
        userId, messageId, chatRoomId, token
    })
}








//---------------------------------------------------
export default {
    // registerChatWindow,
    registerChatRoom,
    sendMessage,
    findChat,
    messageSeen,
    getChats
}
