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
        socket.on('send-message', async function({content, chatRoomId, token}) {
            console.log("------------------------------------- SENDING A MESSAGE --------------------------------");
            const user = await validateToken(token)
            if (!user) return;
            const chatRoom = await Chat.findById(chatRoomId).populate('message');
            const newMessage = new Message({
                user: user,
                content: content
            })
            await newMessage.save();
            chatRoom.message.push(newMessage);
            await chatRoom.save();
            socket.join(chatRoom._id, function() {
                io.to(chatRoom._id).emit("send-message", chatRoom);
            });
        })

       //-------------------------------------------------
       socket.on('chat-clicked', async function({ id, token }){
            console.log(id)
            const chat = await Chat.findById(id).populate("users");
            const user = await validateToken(token);
            if (!user) return;
            socket.join(chat._id, function() {
            io.to(chat._id).emit("chat-clicked", chat);
        });
      });

       //-------------------------------------------------
       //-------------------------------------------------
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