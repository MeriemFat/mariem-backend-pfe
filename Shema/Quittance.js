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
   
    codeAgence: {
        type: String,
        required: true
    },
    dateMutDu: {
        type: Date,
        required: true
    },
    
    dateMutAu: {
        type: Number,
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
    }
});
const Quittance = mongoose.model('Quittance', quittance);
module.exports = Quittance;
