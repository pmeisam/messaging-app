const User = require('../models/user');
const Chat = require('../models/chat');


module.exports = {
    allChats,
    chatSelected,
    getChat,
    findChat
  };

  async function getChat(req, res) {
    const chat = await Chat.findById(req.params.chatId).populate('users').populate('messages').populate('messages.user');
    res.json(chat);
  }

  async function findChat(req, res) {
    const user1 = await User.findById(req.user._id);
    const user2 = await User.findById(req.params.userId);
    const chatId = findExistedChat(user1, user2);
    if (chatId === null) {
      const chat = {users: [user1, user2], lastViewedMessages: [{userId: req.params.userId}, {userId: req.user._id}]};
      const newChat = new Chat(chat);
      await newChat.save();
      user1.chats.push(newChat);
      user2.chats.push(newChat);
      await user1.save();
      await user2.save();
      res.json(chat);
    } else {
      const chat = await Chat.findById(chatId).populate("users").populate("messages");
      res.json(chat);
    }
  }

  function allChats(req , res){
    let chatNameAndId = []
    User.findById(req.body._id,  function(err , user){
      if(user.chats.length != null){
       user.chats.forEach( chatId =>{
         Chat.findById(chatId ,  function(err , chat){
          let result
           chat.users.indexOf(user._id) ? result = chat.users[0] : result = chat.users[1]
           User.findById(result ,  function(err , reciver){
             chatNameAndId.push({[reciver.name] : chatId})
            if(user.chats.length == chatNameAndId.length) return res.json(chatNameAndId)
          })
        })
      })
    }
    });
  }

function chatSelected(req,res){
  // console.log("chat ctrl",req)
  Chat.findById(req.chatId).populate('messages').exec( function(err , chatMessage){
    // return res.json(chatMessage.message)
  })
}

function findExistedChat(user1, user2) {
  let chatId = null;
  user1.chats.forEach( ch1 => {
    user2.chats.forEach( ch2 => {
      if (JSON.stringify(ch1) === JSON.stringify(ch2)) {
        chatId = ch1;
      }
    })
  })
  return chatId;
}