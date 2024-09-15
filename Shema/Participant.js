const mongoose = require('mongoose');

const participantSchema =  mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'group', required: true },

})
module.exports= mongoose.model('participant', participantSchema); 
