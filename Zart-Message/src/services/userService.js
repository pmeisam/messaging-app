import tokenService from'./tokenService';
const BASE_URL = '/api/users/';

export default {
  signup,
  getUser,
  logout,
  login,
  showUser,
  findUser,
};

async function findUser(query) {
  return await fetch(BASE_URL + 'findUser/' + query, {
      method: 'GET',
      headers: {Authorization: 'Bearer ' + tokenService.getToken()}
  }).then(async res => await res.json());
}

function showUser() {
  return fetch(BASE_URL + 'user', {
    method: 'GET',
    headers: {Authorization: 'Bearer ' + tokenService.getToken()}
  }).then(async res => {
    await res.json()
  }
  );
}

function login(creds) {
  return fetch(BASE_URL + 'login', {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json'}),
    body: JSON.stringify(creds)
  }).then(res => {
    if (res.ok) return res.json();
    throw new Error('Bad Credentials!');
  }).then(({token}) => tokenService.setToken(token))
}

function logout() {
  tokenService.removeToken();
}

function getUser() {
  return tokenService.getUserFromToken();
}

function signup(user) {
  return fetch(BASE_URL + 'signup', {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json'}),
    body: JSON.stringify(user)
  }).then(res => {
    if (res.ok) return res.json();
    // Probably a duplicate email
    // err
    throw new Error('Email already taken!');
  }).then(({token}) => tokenService.setToken(token));
}

