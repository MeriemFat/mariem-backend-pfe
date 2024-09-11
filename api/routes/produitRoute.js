const express=require("express")
const router=express.Router()
const produitController = require('../controllers/produitControllers');
// Définir la route pour récupérer tous les produits
router.get('/getAllProduits', async (req, res) => {
    try {
        // Appeler la fonction getAllProduits du contrôleur des produits
        const produits = await produitController.getAllProduits();
        // Renvoyer les produits en tant que réponse
        res.status(200).json(produits);
    } catch (error) {
        // En cas d'erreur, renvoyer un code d'erreur 500 avec un message d'erreur
        res.status(500).json({ message: error.message });
    }
}); 

// Route pour récupérer les produits par code de branche
router.get('/getProduitByCodeBranche/:codeBranche', produitController.getProduitByCatalogue);


module.exports = router;