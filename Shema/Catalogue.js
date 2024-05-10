const mongoose = require("mongoose"); 

const Catalogue =  mongoose.Schema({ 
    codeBranche:String , 
    libellerBranche:String, 
    TypeProduit:{ 
        type:String , 
        enum:['profesionnelle, particulier'], 
    }
}); 
const catalogue = mongoose.model("catalogue", Catalogue)
module.exports = catalogue; 