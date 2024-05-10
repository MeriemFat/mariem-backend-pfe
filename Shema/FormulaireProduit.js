const mongoose =require("mongoose"); 
const FormulaireProduit =  mongoose.Schema({ 
    _id:String , 
    Nom:String, 
    prénom:String, 
    Description : String, 
    Adresse :String, 
    Num_Cin : String, 
    }); 
const formulaireProduit = mongoose.model('formulaireProduit', FormulaireProduit);
module.exports= formulaireProduit; 
