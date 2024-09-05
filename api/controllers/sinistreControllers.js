const Contrat = require("../../Shema/Contrat");
const User = require("../../Shema/User");
const Sinistre = require("../../Shema/Sinistre"); 


// Get All Contrat by CodeClient 
const getSinistreByCodeClient = async (req, res) => {
    try {
        const codeClient = req.params.codeClient;

        // Vérifier si le codeClient est présent
        if (!codeClient) {
            return res.status(400).json({ error: "Le code client est requis" });
        }

        // Récupérer les contrats pour le code client spécifié
        const sinistre = await Sinistre.find({ codeClient }).exec();

        // Vérifier si des contrats ont été trouvés
        if (sinistre.length === 0) {
            return res.status(404).json({ error: "Aucun sinistre trouvé pour le code client donné" });
        }

        // Récupérer les détails du client associé à chaque contrat
        const sinistreAvecClient = await Promise.all(sinistre.map(async (sinistre) => {
            const client = await User.findOne({ codeClient: sinistre.codeClient }).exec();
            return { sinistre, client };
        }));

        // Retourner les contrats avec les détails du client
        res.json(sinistreAvecClient);
    } catch (error) {
        console.error("Erreur lors de la récupération des sinistres pour le code client :", error.message);
        res.status(500).json({ error: "Erreur lors de la récupération des sinistres pour le code client" });
    }
};

const getSinistreById = async (req, res) => {
    try {
      const sinistreId = req.params.id;
      const sinistre = await Sinistre.findById(sinistreId);
  
      if (!sinistre) {
        return res.status(404).json({ message: 'Sinistre not found' });
      }
  
      res.status(200).json(sinistre);
    } catch (error) {
      console.error('Error fetching Sinistre data:', error); // Log the error details
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllSinistres = async (req, res) => {
    try {
      const sinistre = await Sinistre.find();
      res.status(200).json(sinistre);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des sinistres', error });
    }
  };
  
  const AjouterSinistre = async (req, res) => {
      try {
          const { codeClient,numSinistre, numPolice, codeAgent, restRegler, etatSinistre, libellerMouvementSinistre} = req.body;
  
          // Créer une nouvelle instance de Sinistre
          const nouveauSinistre = new Sinistre({
            codeClient,  
            numSinistre,
            numPolice,
            codeAgent,
            restRegler,
            etatSinistre,
            libellerMouvementSinistre
          });
  
          // Sauvegarder le sinistre dans la base de données
          const sinistreSauvegarde = await nouveauSinistre.save();
  
          // Envoyer une réponse de succès avec les données du sinistre sauvegardé
          res.status(200).json({
              message: 'Sinistre ajouté avec succès',
              sinistre: sinistreSauvegarde
          });
      } catch (error) {
          // Gérer les erreurs et envoyer une réponse d'erreur
          res.status(500).json({
              message: 'Erreur lors de l\'ajout du sinistre',
              error: error.message
          });
      }
  };


  const UpdateSinistre = async (req, res) => {
      try {
          const sinistreId = req.params.id;
          const {codeClient,numSinistre, numPolice, codeAgent, restRegler, etatSinistre, libellerMouvementSinistre,contratId} = req.body;
  
          // Trouver le sinistre par ID et mettre à jour ses champs
          const sinistreMisAJour = await Sinistre.findByIdAndUpdate(
              sinistreId,
              {
                  codeClient,  
                  numSinistre,
                  numPolice,
                  codeAgent,
                  restRegler,
                  etatSinistre,
                  libellerMouvementSinistre,
                  contratId
              },
              { new: true, runValidators: true } // Options pour retourner le document mis à jour et exécuter les validateurs
          );
  
          if (!sinistreMisAJour) {
              return res.status(404).json({ message: 'Sinistre non trouvé' });
          }
  
          res.status(200).json(sinistreMisAJour);
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Erreur lors de la mise à jour du sinistre' });
      }
  };
  
  // Fonction pour supprimer un sinistre
const supprimerSinistre = async (req, res) => {
    try {
        const sinistreId = req.params.id;

        // Trouver et supprimer le sinistre par ID
        const sinistreSupprime = await Sinistre.findByIdAndDelete(sinistreId);

        if (!sinistreSupprime) {
            return res.status(404).json({ message: 'Sinistre non trouvé' });
        }

        res.status(200).json({ message: 'Sinistre supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression du sinistre' });
    }
};
module.exports = { 
     getSinistreByCodeClient ,
     getSinistreById ,
     getAllSinistres , 
     AjouterSinistre ,
     UpdateSinistre,
     supprimerSinistre
    };
