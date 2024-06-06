const Quittance = require("../../Shema/Quittance");
const User = require("../../Shema/User");
// Get All Contrat by CodeClient 
const getQuittanceByCodeAgent = async (req, res) => {
    try {
        const codeAgent = req.params.codeAgent;

        // Vérifier si le codeClient est présent
        if (!codeAgent) {
            return res.status(400).json({ error: "Le code Agent est requis" });
        }

        // Récupérer les contrats pour le code client spécifié
        const quittance = await Quittance.find({ codeAgent }).exec();

        // Vérifier si des contrats ont été trouvés
        if (quittance.length === 0) {
            return res.status(404).json({ error: "Aucun quittance trouvé pour le code Agent donné" });
        }

        // Récupérer les détails du client associé à chaque contrat
        const quittanceAvecClient = await Promise.all(quittance.map(async (quittance) => {
            const client = await User.findOne({ codeAgent: quittance.codeAgent }).exec();
            return { quittance, client };
        }));

        // Retourner les contrats avec les détails du client
        res.json(quittanceAvecClient);
    } catch (error) {
        console.error("Erreur lors de la récupération des Quittances pour le code Agent :", error.message);
        res.status(500).json({ error: "Erreur lors de la récupération des Quittance pour le code Agent" });
    }
};

const getQuittanceById = async (req, res) => {
    try {
      const quittanceId = req.params.id;
      const quittance = await Quittance.findById(quittanceId);
  
      if (!quittance) {
        return res.status(404).json({ message: 'Quittance not found' });
      }
  
      res.status(200).json(quittance);
    } catch (error) {
      console.error('Error fetching Quittance data:', error); // Log the error details
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Exporter la fonction pour l'utiliser dans d'autres fichiers
module.exports = {
    getQuittanceByCodeAgent, 
    getQuittanceById
};
