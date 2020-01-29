import tokenService from './tokenService';
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