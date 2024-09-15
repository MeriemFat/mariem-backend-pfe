const mongoose = require('mongoose');

const messageSchema =  mongoose.Schema({
    participant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'participant', required: true },
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'group', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },

})

module.exports= mongoose.model('message', messageSchema); 
