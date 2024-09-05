const express=require("express")
const router=express.Router()
const quittanceController = require('../controllers/quittanceController');
const tokenVerif = require('../../middleware/tokenVerification')
// Route pour consulter les contrats par code client
router.get('/getQuittanceByCodeAgent/:codeAgent',quittanceController.getQuittanceByCodeAgent);
router.get('/getQuittanceById/:id',quittanceController.getQuittanceById);
router.get('/getAllQuittance',quittanceController.getAllQuittance); 
router.post('/AjouterQuittance', quittanceController.ajouterQuittance);
router.put('/ModifierQuittance/:id', quittanceController.modifierQuittance);
router.delete('/SupprimerQuittance/:id', quittanceController.supprimerQuittance);
router.put('/updateStatus', quittanceController.updateStatus);
module.exports = router;