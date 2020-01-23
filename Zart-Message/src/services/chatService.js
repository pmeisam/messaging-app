import tokenService from './tokenService';
import chat from '../components/Chat/Chat'
const BASE_URL = '/api/chats/';

export default {
    getAllChats,
    findChat,
    getChat
};
async function getChat(chatId) {
    return await fetch(BASE_URL + 'chatId/' + chatId, {
        method: 'GET',
        headers: {Authorization: 'Bearer ' + tokenService.getToken()}
    }).then(async res => await res.json());
}

async function findChat(userId) {
    return await fetch(BASE_URL + 'userId/' + userId, {
        method: 'GET',
        headers: {Authorization: 'Bearer ' + tokenService.getToken()}
    }).then(async res => await res.json());
}


async function getAllChats(user){
    return await fetch (BASE_URL + 'allChats', {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(user)
        }).then(res => {
            return res.json()
        }).then(data => {
            return data
        })
}

function findClickedChat(id){
    // console.log(id)
    return fetch (BASE_URL + 'chatSelected',{
        method: 'POST',
        header: new Headers({'Content-Type': 'application/json', 'Accept' : 'application/json'}),
        body: JSON.stringify(id)
    }).then(res => {
        return res.json()
    }).then(data => {
         chat.messageReciver(data)
    })
}
