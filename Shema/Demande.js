const mongoose = require("mongoose");

const demandeSchema = mongoose.Schema({
    etatDemande: {
        type: String,
        enum : ['Envoyer' , 'En Cours De Traitement'  ,'Traiter'], 
    }, 
    nom: {
        type: String,
        required: true,
        // Message d'erreur personnalisé (facultatif)
        required: [true, 'Le nom est requis.']
    },
    email: {
        type: String,
        required: true,
        // Message d'erreur personnalisé (facultatif)
        required: [true, 'L\'email est requis.']
    },
    description:{
        type: String,
        required: true
    }, 
    TypeDemande: { 
        type: String , 
        enum: ['Demande', 'Reclamation' , 'Modification' , 'Autre'], 
    }
});

const Demande = mongoose.model('Demande', demandeSchema);
module.exports = Demande;