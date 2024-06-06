const mongoose = require("mongoose"); 

const Chat =  mongoose.Schema({ 
    question:String , 
    reponse:String, 
}); 
const chat = mongoose.model("chat", Chat)
module.exports = chat; 