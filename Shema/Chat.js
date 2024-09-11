const mongoose = require('mongoose');

const chatSchema =  mongoose.Schema({

    label:{type:String},
    owner:{type: String},
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }],
    type: { type: String, required: true, enum: ['Single', 'Group'] },
    messages: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        senderEmail: { type: String},
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        avatar:{type:String,default:"http://localhost:3000/uploads/avatar/placeholder.webp"}
    }],
    selected:{type:Boolean,default:false}
});

const Chat = mongoose.model('Chat', chatSchema); 
module.exports= Chat