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



module.exports = { getSinistreByCodeClient , getSinistreById};
