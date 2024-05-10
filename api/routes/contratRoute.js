const express=require("express")
const router=express.Router()
const contratController = require('../controllers/contratController');


// Route pour consulter les contrats par code client
router.get('/getContratByCodeClient/:CodeClient', async (req, res) => {
    const codeClient = req.params.CodeClient;
    try {
        const contratsAvecClient = await contratController.getContratsByCodeClient(codeClient);
        console.log("Contrats récupérés pour le code client", codeClient, ":", contratsAvecClient); // Ajoutez ce journal pour afficher les contrats récupérés
        res.status(200).json(contratsAvecClient);
    } catch (error) {
        console.error("Erreur lors de la récupération des contrats pour le code client", codeClient, ":", error.message);
        res.status(500).json({ error: "Erreur lors de la récupération des contrats pour le code client " + codeClient });
    }
});

module.exports = router;


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

module.exports = router;
