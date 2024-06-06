// Importer le modèle de produit
const Produit = require('../../Shema/Produit');
const Catalogue = require("../../Shema/Catalogue"); 


// Fonction pour récupérer tous les produits
const getAllProduits = async () => {
    try {
        // Récupérer tous les produits depuis la base de données
        const produits = await Produit.find();
        // Renvoyer les produits récupérés
        return produits;
    } catch (error) {
        // En cas d'erreur, l'enregistrer dans les logs et la renvoyer
        console.error("Erreur lors de la récupération de tous les produits :", error.message);
        throw new Error("Erreur lors de la récupération de tous les produits");
    }
};


const getProduitByCatalogue = async (req, res) => {
    try {
        const codeBranche = req.params.codeBranche;

        // Vérifier si le codeBranche est présent
        if (!codeBranche) {
            return res.status(400).json({ error: "Le code branche est requis" });
        }

        // Récupérer les produits pour le codeBranche spécifié
        const produits = await Produit.find({ codeBranche }).exec();
        // Vérifier si des produits ont été trouvés
     

        // Récupérer les détails du client associé à chaque produit
        const produitsAvecCataloque = await Promise.all(produits.map(async (produit) => {
            const catalogue = await Catalogue.findOne({ codeBranche: produit.codeBranche }).exec();
            return { produit};
        }));

        // Retourner les produits avec les détails du client
        res.json(produitsAvecCataloque);
    } catch (error) {
        console.error("Erreur lors de la récupération des produits pour le code branche :", error.message);
        res.status(500).json({ error: "Erreur lors de la récupération des produits pour le code branche" });
    }
};


module.exports = {
    getAllProduits,
    getProduitByCatalogue
};
