const Catalogue = require("../../Shema/Catalogue");

const addCatalogue = async (req, res) => {
    try {
        const { codeBranche, libellerBranche, TypeProduit } = req.body;
        const photo = req.file ? `/uploads/${req.file.filename}` : '';

        const newCatalogue = new Catalogue({
            codeBranche,
            libellerBranche,
            TypeProduit, 
            photo
        });

        await newCatalogue.save();
        res.status(201).json({ message: "Catalogue ajouté avec succès", catalogue: newCatalogue });
    } catch (error) {
        console.error("Erreur lors de l'ajout du catalogue :", error.message);
        res.status(500).json({ message: "Erreur lors de l'ajout du catalogue" });
    }
};


// Fonction pour récupérer tous les catalogues
const getAllCatalogues = async (req, res) => {
    try {
        const catalogues = await Catalogue.find();

        // Ajouter le chemin complet pour chaque photo
        const cataloguesWithPhotos = catalogues.map(catalogue => ({
            ...catalogue.toObject(), // Convertir le document Mongoose en objet JS
            photo: catalogue.photo ? `${req.protocol}://${req.get('host')}${catalogue.photo}` : null
        }));

        res.status(200).json(cataloguesWithPhotos);
    } catch (error) {
        console.error("Erreur lors de la récupération des catalogues :", error.message);
        res.status(500).json({ message: "Erreur lors de la récupération des catalogues" });
    }
};


module.exports = { addCatalogue, getAllCatalogues };
