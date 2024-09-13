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
const getAllQuittance = async (req, res) => {
    try {
        const quittance = await Quittance.find();
        res.status(200).json(quittance);
      } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des quittance', error });
      }
    };
// Supprimer une quittance
const supprimerQuittance = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuittance = await Quittance.findByIdAndDelete(id);
    if (!deletedQuittance) {
      return res.status(404).json({ message: 'Quittance non trouvée' });
    }
    res.status(200).json({ message: 'Quittance supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la quittance:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la quittance', error });
  }
};
// Ajouter une quittance
const ajouterQuittance = async (req, res) => {
  try {
    const { codeAgent, numPolice, numQuittance, dateMutDu, dateMutAu, primeTotal} = req.body;
    
    const newQuittance = new Quittance({
      codeAgent,
      numPolice,
      numQuittance,
      dateMutDu,
      dateMutAu,
      primeTotal
    });

    const quittance = await newQuittance.save();
    res.status(201).json(quittance);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la quittance:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la quittance', error });
  }
};

// Modifier une quittance
const modifierQuittance = async (req, res) => {
  try {
    const { codeAgent, numPolice, numQuittance, dateMutDu, dateMutAu, primeTotal } = req.body;
    const quittanceId = req.params.id;

    const updatedQuittance = await Quittance.findByIdAndUpdate(
      quittanceId,
      {
        codeAgent,
        numPolice,
        numQuittance,
        dateMutDu,
        dateMutAu,
        primeTotal
      },
      { new: true, runValidators: true }
    );

    if (!updatedQuittance) {
      return res.status(404).json({ message: 'Quittance non trouvée' });
    }

    res.status(200).json(updatedQuittance);
  } catch (error) {
    console.error('Erreur lors de la modification de la quittance:', error);
    res.status(500).json({ message: 'Erreur lors de la modification de la quittance', error });
  }
};

// Fonction pour mettre à jour l'état de la quittance
const updateStatus = async (req, res) => {
  const { quittanceId, newStatus } = req.body;

  // Vérifiez que le nouvel état est valide
  const validStatuses = ['Arriere', 'Accompte', 'Règlé'];
  if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ message: 'État de règlement invalide' });
  }

  try {
      // Trouver la quittance et mettre à jour son état
      const quittance = await Quittance.findByIdAndUpdate(
          quittanceId,
          { EtatMvt: newStatus },
          { new: true }
      );

      if (!quittance) {
          return res.status(404).json({ message: 'Quittance non trouvée' });
      }

      res.status(200).json({ message: 'État de règlement mis à jour', updatedQuittance: quittance });
  } catch (error) {
      console.error('Error updating quittance status:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'état de règlement' });
  }
};
const getClients = async (req, res) => {
  try {
    // Utilisez une condition pour filtrer les clients selon leurs rôles
    const clients = await User.find({ roles: { $in: [1, 10] } });
    res.status(200).json(clients);
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des clients', error });
  }
};
// Exporter la fonction pour l'utiliser dans d'autres fichiers
module.exports = {
    getQuittanceByCodeAgent, 
    getQuittanceById, 
    getAllQuittance , 
    supprimerQuittance , 
    ajouterQuittance , 
    modifierQuittance, 
    updateStatus, 
    getClients
};
