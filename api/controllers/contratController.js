const Contrat = require("../../Shema/Contrat");
const User = require("../../Shema/User");
const Sinistre = require("../../Shema/Sinistre"); 
const Quittance = require("../../Shema/Quittance");

// Get All Contrat by CodeClient 
const getContratsByCodeClient = async (req, res) => {
    try {
        const codeClient = req.params.codeClient;

        // Vérifier si le codeClient est présent
        if (!codeClient) {
            return res.status(400).json({ error: "Le code client est requis" });
        }

        // Récupérer les contrats pour le code client spécifié
        const contrats = await Contrat.find({ codeClient }).exec();

        // Vérifier si des contrats ont été trouvés
        if (contrats.length === 0) {
            return res.status(404).json({ error: "Aucun contrat trouvé pour le code client donné" });
        }

        // Récupérer les détails du client associé à chaque contrat
        const contratsAvecClient = await Promise.all(contrats.map(async (contrat) => {
            const client = await User.findOne({ codeClient: contrat.codeClient }).exec();
            return { contrat, client };
        }));

        // Retourner les contrats avec les détails du client
        res.json(contratsAvecClient);
    } catch (error) {
        console.error("Erreur lors de la récupération des contrats pour le code client :", error.message);
        res.status(500).json({ error: "Erreur lors de la récupération des contrats pour le code client" });
    }
};



const getContratsByCodeClientVariable = async (req, res) => {
    try {
        const codeClient = req.params.codeClient;

        // Vérifier si le codeClient est présent
        if (!codeClient) {
            return res.status(400).json({ error: "Le code client est requis" });
        }

        // Récupérer les contrats pour le code client spécifié
        const contrats = await Contrat.find({ codeClient }).exec();

        // Vérifier si des contrats ont été trouvés
        if (contrats.length === 0) {
            return res.status(404).json({ error: "Aucun contrat trouvé pour le code client donné" });
        }

        // Extraire uniquement numPolice et codeClient des contrats
        const contratsSimplifies = contrats.map(contrat => ({
            numPolice: contrat.numPolice,
            codeClient: contrat.codeClient
        }));

        // Retourner les contrats simplifiés
        res.json(contratsSimplifies);
    } catch (error) {
        console.error("Erreur lors de la récupération des contrats pour le code client :", error.message);
        res.status(500).json({ error: "Erreur lors de la récupération des contrats pour le code client" });
    }
};


// Get All Contrats 

const getAllContrats = async () => {
    try {
        const contrats = await Contrat.find({}).exec(); // Requête pour récupérer tous les contrats
        return contrats;
    } catch (error) {
        console.error("Erreur lors de la récupération des contrats :", error.message);
        throw new Error("Erreur lors de la récupération des contrats");
    }
}; 

//Get Contrat By Agent 

const getContractByCodeAgent = async (req, res) => {
    const { codeAgent } = req.params; 
    
    try {
      const contracts = await Contrat.find({ codeAgent });
      res.status(200).json(contracts);
    } catch (error) {
      console.error('Erreur lors de la récupération des contrats par code agent :', error);
      res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des contrats.' });
    }
};

// Get All Contrat and sinistre By CodeClient 

    const getAllContratsAndSinistresByCodeClient = async (codeClient) => {
        try {        
    const sinistre = await Sinistre.find({codeClient:codeClient}).exec(); 
            // Récupérer les détails du client associé à chaque contrat
            const contratsAvecSinistre = await Promise.all(sinistre.map(async (sinistre) => {
                const contrats = await Sinistre.findOne({ codeClient: sinistre.codeClient }).exec();
                return {sinistre };
            }));
    
            return contratsAvecSinistre;
        } catch (error) {
            console.error("Erreur lors de la récupération des contrats pour le code client", codeClient, ":", error.message);
            throw new Error("Erreur lors de la récupération des contrats pour le code client " + codeClient);
        }
    };

// Get All Contrat and Quittance By codeClient 

    const getAllContratsAndQuittanceByCodeClient = async (codeAgent) => {
        try {        
    const quittance = await Quittance.find({codeAgent:codeAgent}).exec(); 
            // Récupérer les détails du client associé à chaque contrat
            const contratsAvecQuittance = await Promise.all(quittance.map(async (quittance) => {
                const contrats = await Quittance.findOne({ codeAgent: quittance.codeAgent }).exec();
                return {quittance, contrats};
            }));
            return contratsAvecQuittance;
        } catch (error) {
            console.error("Erreur lors de la récupération des contrats pour le code Agent", codeAgent, ":", error.message);
            throw new Error("Erreur lors de la récupération des contrats pour le code Agent " + codeAgent);
        }
    };

    const getContratById = async (req, res) => {
        try {
          const contratId = req.params.id;
          const contrat = await Contrat.findById(contratId);
      
          if (!contrat) {
            return res.status(404).json({ message: 'Contrat not found' });
          }
      
          res.status(200).json(contrat);
        } catch (error) {
          console.error('Error fetching contract data:', error); // Log the error details
          res.status(500).json({ message: 'Server error', error: error.message });
        }
    };

module.exports = { getContratsByCodeClient , getAllContrats , getContractByCodeAgent , getAllContratsAndSinistresByCodeClient, getAllContratsAndQuittanceByCodeClient, getContratsByCodeClientVariable , getContratById};
