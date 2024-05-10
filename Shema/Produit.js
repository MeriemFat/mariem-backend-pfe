const mongoose = require("mongoose"); 

const Produit =  mongoose.Schema({ 
    codeBranche:String , 
    CodeSouBranche:String, 
    libellerSouBranche:String, 
    TypeProduit:{ 
        type:String , 
        enum:['profesionnelle, particulier'], 
    }
}); 
const produit= mongoose.model('produit', Produit);
module.exports = produit; 