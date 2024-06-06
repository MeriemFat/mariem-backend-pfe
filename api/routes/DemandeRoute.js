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

router.post('/repondreDemandeParEmail/:codeClient', async (req, res) => {
    const codeClient = req.params.codeClient;
    const reponse = req.body.reponse;

    try {
        await demandeController.repondreDemandeParEmailByCodeClient(codeClient, reponse);
        res.status(200).json({ message: 'E-mail envoyé avec succès en réponse à la demande du client.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/getAllDemandesByCodeClient/:codeClient',demandeController. getAllDemandesByCodeClient);



module.exports = router;