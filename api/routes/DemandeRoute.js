// Importation des modules nécessaires
const express = require('express');
const router = express.Router();
const demandeController = require('../../api/controllers/DemandeControllers');

// Route pour ajouter une demande pour un client spécifique
router.post('/addDemande/:codeClient', demandeController.addDemandeByCodeClient);
  
// Route pour récupérer toutes les demandes
router.get('/getAllDemande', demandeController.getAllDemande); 

// Route pour récupérer les demandes par code client
router.get('/getDemandesByCodeClient/:codeClient', demandeController.getDemandeByCodeClient); 
 
router.post('/addDemandesByCodeAgent/:codeAgent', demandeController.addDemandeByCodeAgent); 

router.post('/repondreDemandeParEmail/:codeClient',demandeController.repondreDemandeParEmailByCodeClient);

router.get('/getAllDemandesByCodeClient/:codeClient',demandeController. getAllDemandesByCodeClient);



module.exports = router;