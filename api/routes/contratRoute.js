const express=require("express")
const router=express.Router()
const contratController = require('../controllers/contratController');
const tokenVerif = require('../../middleware/tokenVerification')
// Route pour consulter les contrats par code client
router.get('/getContratByCodeClient/:codeClient',contratController.getContratsByCodeClient);
router.get('/getContratById/:id',contratController.getContratById);
router.get('/getContratByCodeClientbyvariable/:codeClient',contratController.getContratsByCodeClientVariable); 
// Route pour consulter tous les contrats
router.get('/getAllContrats', async (req, res) => {
    try {
        const contrats = await contratController.getAllContrats();
        console.log("Contrats récupérés :", contrats); // Affichez les contrats récupérés dans la console
        res.status(200).json(contrats);
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les contrats :", error.message);
        res.status(500).json({ error: "Erreur lors de la récupération de tous les contrats" });
    }
});

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

module.exports = router;
