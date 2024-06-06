const express=require("express")
const router=express.Router()
const sinistreController = require('../controllers/sinistreControllers');
const tokenVerif = require('../../middleware/tokenVerification')
// Route pour consulter les contrats par code client
router.get('/getSinistreByCodeClient/:codeClient',sinistreController.getSinistreByCodeClient);
router.get('/getSinistreById/:id',sinistreController.getSinistreById);
module.exports = router;