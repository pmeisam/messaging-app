var express = require('express')
var router = express.Router()
const usersCtrl = require('../../controller/user');
const chatCtrl = require('../../controller/chat')

router.use(require("../../config/auth"));
router.post('/signup', usersCtrl.signup);
router.post('/login', usersCtrl.login);
router.get('/findUser/:user', usersCtrl.findUser);
router.put('/editUser', usersCtrl.editUser);
router.get('/user', usersCtrl.getUser);
router.post('/search' , usersCtrl.searchUser);
router.post('/allChats' , chatCtrl.allChats);
router.post('/chatSelected' , chatCtrl.chatSelected);

module.exports = router;