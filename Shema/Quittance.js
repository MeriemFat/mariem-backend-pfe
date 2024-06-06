const mongoose = require("mongoose");

const etatReglementQuittance = ['Arriere', 'Accompte', 'Règlé'];
// Définir le schéma de quittance
const quittance =  mongoose.Schema({
    numPolice: {
        type: String,
        required: true
    },
    numQuittance: {
        type: String,
        unique: true,
        required: true
    },
    codeAgent:{
        type: String,
        required: true,
        ref: 'Contrat' 
    },  
    dateMutDu: {
        type: Date,
        required: true
    },
    
    dateMutAu: {
        type: Date,
        required: true
    },
    primeTotal: {
        type: Number,
        required: true
    },
    EtatMvt: {
        type: String,
        required: true,
        enum: etatReglementQuittance // Utiliser enum pour valider les valeurs
    }, 
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 
    contratId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contrat', // Nom du modèle référencé (Contrat)
        required: true
    }
});
const Quittance = mongoose.model('Quittance', quittance);
module.exports = Quittance;
