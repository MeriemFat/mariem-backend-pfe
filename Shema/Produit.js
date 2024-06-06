const mongoose = require("mongoose"); 

const Produit =  mongoose.Schema({ 
    codeBranche:{
        type: Number,
        required: true,
        ref: 'Catalogue' 
    },  
    code_sous_branche:String, 
    libelle_sous_branche:String, 
    description:String, 
   
}); 
const produit= mongoose.model('produit', Produit);
module.exports = produit; 