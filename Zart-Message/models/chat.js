const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema  = new Schema({
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    messages:[{
        type: Schema.Types.ObjectId,
        ref: "Message"
    }],
    lastViewedMessages: [{
        userId: String,
        messageId: String
    }]
    
},{
    timestamps: true
  });
module.exports = mongoose.model("Chat", chatSchema);
