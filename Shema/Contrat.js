const mongoose =require("mongoose"); 

// Shéma pour le shéma Contrat
const contrat = mongoose.Schema({ 
   numPolice:{
    type: String,
    required: true // Assure que ce champ est obligatoire
},
codeClient: {
    type: String,
    required: true,
    ref: 'User' 
},
 codeAgent:{
    type :String,
     required:true
}, 
 libelleBreanche:{
    type:String, 
    required:true
}, 
 libelleSousBranche:{
    type:Number, 
    required:true
}, 
dateEchanceProchaine:{
    type:Date, 
    required:true}, 
typePersonne:{
    type:Date ,
     required:true
    }
}); 
const Contrat = mongoose.model('Contrat', contrat);
module.exports = Contrat; 
