const mongoose = require("mongoose");

// Définir les valeurs possibles pour natureSinistre
const natureSinistreEnum = ['Recour', 'Defonce', 'corporelle'];
const etatRéglement=['ouvert','cloturer'];
// Définir le schéma de sinistre
const sinistre =  mongoose.Schema({
    numPolice: {
        type:String,
        required:true
    },
    numSinistre: {
        type:String,
        required:true
    },
    codeClient:{ 
        type:String, 
        required: true 
    },
    codeAgent: {
        type:String, 
        required: true 
    },
    restRegler: {
        type: Date ,
         require:true
        }, 
   
    etatSinistre:{
        type:String ,
         enum:etatRéglement
        }, 
    libellerMouvementSinistre: {
        type: String,
        enum: natureSinistreEnum // Valider les valeurs avec l'énumération
    }, 
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
const Sinistre = mongoose.model("Sinistre", sinistre);
// Exporter le modèle Sinistre
module.exports = Sinistre;
