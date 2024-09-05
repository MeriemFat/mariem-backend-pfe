const mongoose = require("mongoose");

// Définir les valeurs possibles pour natureSinistre
const natureSinistreEnum = ['Recour', 'Defonce', 'corporelle'];
const etatRéglement=['ouvert','cloturer'];
// Définir le schéma de sinistre
const sinistre =  mongoose.Schema({
    codeClient: {
        type: String,
        required: true,
        ref: 'Contrat' 
    },
    numSinistre: {
        type:String,
        required:true
    },
    numPolice: {
        type:String,
        required:true
    },
     codeAgent:{
        type: String,
        required: true,
        ref: 'Contrat' 
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
    }, 
    contratId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contrat', // Nom du modèle référencé (Contrat)
       
    }
});
const Sinistre = mongoose.model("Sinistre", sinistre);
// Exporter le modèle Sinistre
module.exports = Sinistre;
