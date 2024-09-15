const mongoose = require('mongoose');

const chatSchema =  mongoose.Schema({
    label:{type:String,unique:true},
    owner:{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  
});

const Chat = mongoose.model('group', chatSchema); 
module.exports= Chat