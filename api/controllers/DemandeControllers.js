const Demande = require("../../Shema/Demande"); 
const User =require("../../Shema/User"); 
const nodemailer = require('nodemailer');
const transporter = require('../../config/nodemailer');

const addDemandeByCodeClient = async (req, res) => {
    const codeClient = req.params.codeClient;
    const nouvelleDemande = req.body;
  
    try {
      // Recherche du client
      const user = await User.findOne({ codeClient }).exec();
  
      if (!user) {
        return res.status(404).json({ message: "Client non trouvé avec le code spécifié." });
      }
  
      // Création de la demande
      const demande = new Demande(nouvelleDemande);
  
      // Attribution du client à la demande
      demande.codeClient = codeClient;
  
      // Enregistrement de la demande dans la base de données
      const demandeEnregistree = await demande.save();
  
      res.status(201).json(demandeEnregistree);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la demande pour le code client", codeClient, ":", error.message);
      res.status(500).json({ message: "Erreur lors de l'ajout de la demande pour le code client " + codeClient });
    }
  };

const getAllDemande = async (req, res) => {
    try {
      const demandes = await Demande.find().exec();
      res.json(demandes);
    } catch (error) {
      console.error("Erreur lors de la récupération de toutes les demandes :", error.message);
      res.status(500).json({ message: "Erreur lors de la récupération de toutes les demandes." });
    }
  };

  const getDemandeByCodeClient = async (req, res) => {
    const codeClient = req.params.codeClient;
    try {
      const demandes = await Demande.find({ codeClient }).exec();
      res.json(demandes);
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes pour le code client", codeClient, ":", error.message);
      res.status(500).json({ message: "Erreur lors de la récupération des demandes pour le code client " + codeClient });
    }
  };

// Fonction pour répondre aux demandes par e-mail
const repondreDemandeParEmailByCodeClient = async (codeClient, reponse) => {
    try {
        // Récupérer la demande du code client spécifié
        const demande = await Demande.findOne({ codeClient: codeClient });

        if (!demande) {
            console.error('Demande non trouvée pour le code client:', codeClient);
            throw new Error('Demande non trouvée pour le code client: ' + codeClient);
        }

        // Paramètres de l'e-mail
        const mailOptions = {
            from: 'meriam.fathallah@takaful.tn',
            to: demande.email,
            subject: 'Réponse à votre demande',
            text: reponse 
        };

        // Envoyer l'e-mail
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
            } else {
                console.log('E-mail envoyé avec succès:', info.response);
            }
        });
    } catch (error) {
        console.error('Erreur lors de la réponse à la demande par e-mail:', error.message);
        throw new Error('Erreur lors de la réponse à la demande par e-mail');
    }
};

const addDemandeByCodeAgent = async (req, res) => {
  const codeAgent = req.params.codeAgent;
  const nouvelleDemande = req.body;

  try {
    // Recherche du client
    const user = await User.findOne({ codeAgent }).exec();

    if (!user) {
      return res.status(404).json({ message: "Client non trouvé avec le code spécifié." });
    }

    // Création de la demande
    const demande = new Demande(nouvelleDemande);

    // Attribution du client à la demande
    demande.codeAgent = codeAgent;

    // Enregistrement de la demande dans la base de données
    const demandeEnregistree = await demande.save();

    res.status(201).json(demandeEnregistree);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la demande pour le code Agent", codeAgent, ":", error.message);
    res.status(500).json({ message: "Erreur lors de l'ajout de la demande pour le code Agent " + codeAgent });
  }
};
const getAllDemandesByCodeClient = async (req, res) => {
  try {
    const { codeClient } = req.params;
    const demandes = await Demande.find({ codeClient });
    res.json(demandes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {addDemandeByCodeClient , getAllDemande , getDemandeByCodeClient , repondreDemandeParEmailByCodeClient , addDemandeByCodeAgent , getAllDemandesByCodeClient }
