const express=require("express")
const router=express.Router()
const sinistreController = require('../controllers/sinistreControllers');
const tokenVerif = require('../../middleware/tokenVerification')
// Route pour consulter les contrats par code client
router.get('/getSinistreByCodeClient/:codeClient',sinistreController.getSinistreByCodeClient);
router.get('/getSinistreById/:id',sinistreController.getSinistreById);
router.get('/getAllSinistre',sinistreController.getAllSinistres); 
router.post('/AjouterSinistre', sinistreController.AjouterSinistre);
router.put('/updateSinistre/:id', sinistreController.UpdateSinistre);
router.delete('/supprimerSinistre/:id', sinistreController.supprimerSinistre);
router.get('/clients', sinistreController.getClients);
module.exports = router;