const mongoose = require("mongoose"); 

const Catalogue =  mongoose.Schema({ 
    codeBranche:String , 
    libellerBranche:String, 
    photo: {
        type: String,
        required: false
    }
}); 
const catalogue = mongoose.model("catalogue", Catalogue)
module.exports = catalogue; 