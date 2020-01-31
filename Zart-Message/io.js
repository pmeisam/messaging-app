const atob    = require('atob');
const jwt     = require('jsonwebtoken');
const User    = require('./models/user');
const Chat    = require('./models/chat');
const Message = require('./models/message');


let io;

module.exports = {
    init,
}

// ------------------function for finding all the chats for the user-------


function init(http) {
    io = require('socket.io')(http);
    // Listen for new connections from clients (socket)
    io.on('connection', function (socket) {
        console.log('connected to io');
        //-------------------------------------------------
        socket.on('get-chats', async function({user, token}) {
            const validateUser = await validateToken(token);
            if (!validateUser) return;

            const foundUser = await User.findById(user._id).populate({
                path: 'chats',
                populate: {
                    path: 'users',
                    model: 'User'
                }
            })
            let users = [];
            foundUser.chats.forEach( c => {
                const u = c.users.filter( u => JSON.stringify(u._id) !== JSON.stringify(user._id))
                users.push(u[0])
            })
            socket.join(user._id, function() {
                io.to(user._id).emit('get-chats', users);
            })
        })


        socket.on('find-chat', async function({userId, loggedInUserId, token}) {
            console.log('------------------------------------- FINDING CHAT -------------------------------------')
            const user = await validateToken(token);
            if (!user) return;

            const user1 = await User.findById(loggedInUserId);
            const user2 = await User.findById(userId);
            const chatId = findExistedChat(user1, user2);
            let chat = null;
            if (chatId === null) {
                chat = {users: [user1, user2], lastViewedMessages: [{userId: userId}, {userId: loggedInUserId}]};
                const newChat = new Chat(chat);
                await newChat.save();
                user1.chats.push(newChat);
                user2.chats.push(newChat);
                await user1.save();
                await user2.save();
            } else {
                chat = await Chat.findById(chatId).populate("users").populate("messages");
            }
            socket.join(chat._id, function() {
                io.to(chat._id).emit("find-chat", chat);
            });
        })


        socket.on('message-seen', async function ({userId, messageId, chatRoomId, token}) {
            console.log('------------------------------------- MESSAGE SEEN BY USER ID -------------------------------------');
            const user = await validateToken(token);
            if (!user) return;

            const chat = await Chat.findById(chatRoomId)
                            .populate('users')
                            .populate('messages')
                            .populate('lastViewedMessages');
            const message = await Message.findById(messageId).populate('user');
            chat.lastViewedMessages.forEach( m => {
                if (m.userId !== userId) {
                    if (message.user._id !== m.userId) {
                        m.messageId = messageId;
                    }
                }
            })

            await chat.save()

            socket.join(chat._id, function() {
                io.to(chat._id).emit( 'message-seen', chat)
            });
        })

        socket.on('send-message', async function ({content, chatRoomId, token}) {
            console.log("------------------------------------- SENDING A MESSAGE -------------------------------------");
            
            try {
                const user = await validateToken(token)
                if (!user) return;
                const chatRoom = await Chat.findById(chatRoomId).populate('messages');
                const newMessage = new Message({
                    user: user,
                    content: content,
                    username: user.name
                })
                await newMessage.save();
                chatRoom.messages.push(newMessage);
                await chatRoom.save();
                socket.join(chatRoom._id, function() {
                    io.to(chatRoom._id).emit("send-message", chatRoom);
                });
                // io.emit('send-message', chatRoom)
            } catch (error) {
                throw new Error(error)
            }
        });



    });
}

function getIo() {
    return io;
}
  
function validateToken(token) {
    return new Promise(function(resolve) {
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) resolve(false);
        resolve(decoded.user);
        });
    });
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