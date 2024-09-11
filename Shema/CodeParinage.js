const mongoose = require("mongoose"); 

const CodeParinage =  mongoose.Schema({ 
    _id:String , 
    code:String, 
}); 

const codeParinage = mongoose.model('codeParinage', CodeParinage);
module.exports = codeParinage; 