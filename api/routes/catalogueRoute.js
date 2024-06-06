const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const catalogueController = require('../controllers/catalogueControllers');

// Configurer multer pour le stockage des images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads')); // Dossier où les images seront stockées
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Renommer le fichier pour éviter les doublons
    }
});
const upload = multer({ storage });

// Route pour récupérer tous les catalogues
router.get('/getAllCatalogues', catalogueController.getAllCatalogues);

// Route pour ajouter un nouveau catalogue avec photo
router.post('/addCatalogue', upload.single('photo'), catalogueController.addCatalogue);

module.exports = router;
