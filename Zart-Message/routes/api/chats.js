var express = require('express')
var router = express.Router()
const chatCtrl = require('../../controller/chat')

router.use(require("../../config/auth"));
router.post('/allChats', chatCtrl.allChats);
router.get('/userId/:userId', chatCtrl.findChat);
router.get('/chatId/:chatId', chatCtrl.getChat);


module.exports = router;