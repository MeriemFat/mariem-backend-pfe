const express=require("express")
const router=express.Router()
const contratController = require('../controllers/contratController');
const tokenVerif = require('../../middleware/tokenVerification')
// Route pour consulter les contrats par code client
router.get('/getContratByCodeClient/:codeClient',contratController.getContratsByCodeClient);
router.get('/getContratById/:id',contratController.getContratById);
router.get('/getContratByCodeClientbyvariable/:codeClient',contratController.getContratsByCodeClientVariable); 
// Route pour consulter tous les contrats
router.get('/getAllContrats',contratController.getAllContrats);

// Route pour consulter les contrats par agent
router.get('/contrats/code-agent/:codeAgent',contratController.getContractByCodeAgent);

router.get('/getAllContratsAndSinistresByCodeClient/:codeClient', async (req, res) => {
    const codeClient = req.params.codeClient;
    try {
        // Appel de la fonction du contrôleur pour récupérer tous les contrats avec leurs sinistres associés
        const contratsAvecSinistres = await contratController.getAllContratsAndSinistresByCodeClient(codeClient);
        
        // Envoi de la réponse JSON contenant les contrats avec leurs sinistres associés
        res.status(200).json(contratsAvecSinistres);
    } catch (error) {
        // En cas d'erreur, renvoyer une réponse d'erreur avec le message d'erreur
        res.status(500).json({ message: error.message });
    }
});
 

router.get('/getAllContratsAndQuittanceByCodeClient/:codeAgent', async (req, res) => {
    const codeAgent = req.params.codeAgent;
    try {
        // Appel de la fonction du contrôleur pour récupérer tous les contrats avec leurs sinistres associés
        const contratsAvecQuittance = await contratController.getAllContratsAndQuittanceByCodeClient(codeAgent);
        
        // Envoi de la réponse JSON contenant les contrats avec leurs sinistres associés
        res.status(200).json(contratsAvecQuittance);
    } catch (error) {
        // En cas d'erreur, renvoyer une réponse d'erreur avec le message d'erreur
        res.status(500).json({ message: error.message });
    }
});

router.post('/AjouterContrat' , contratController.AjouterContrat); 
router.put('/ModifierContrat/:id', contratController.updateContrat); 
router.delete('/supprimerContrat/:id', contratController.deleteContrat); 
module.exports = router;
