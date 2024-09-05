const mongoose =require("mongoose"); 

// Shéma pour le shéma Contrat
const contrat = mongoose.Schema({ 
   numPolice:{
    type: String,
     // Assure que ce champ est obligatoire
},
codeClient: {
    type: String,
    required: true,
    ref: 'User' 
},
 codeAgent:{
  type: String,
    required: true,
    ref: 'User' 
}, 
libelle_branche:{
    type:String, 
    required:true
}, 
libelle_sous_branche:{
    type:String, 
    required:true
}, 
date_echeance_prochaine:{
    type:Date, 
    required:true}, 
type_personne:{
    type:String,
     required:true
    }, 
    numSinistre: {
        type: String,
        ref: 'Sinistre' // Référence au modèle Sinistre
    }, 
    numContrat: {
        type: String
    }
}); 
const Contrat = mongoose.model('Contrat', contrat);
module.exports = Contrat; 
