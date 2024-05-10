const Contrat = require("../../Shema/Contrat");
const User = require("../../Shema/User");

const getContratsByCodeClient = async (codeClient) => {
    try {
        // Récupérer les contrats du code client spécifié
        const contrats = await Contrat.find({ codeClient: codeClient }).exec();

        // Récupérer les détails du client associé à chaque contrat
        const contratsAvecClient = await Promise.all(contrats.map(async (contrat) => {
            const client = await User.findOne({ codeClient: contrat.codeClient }).exec();
            return { contrat, client };
        }));

        return contratsAvecClient;
    } catch (error) {
        console.error("Erreur lors de la récupération des contrats pour le code client", codeClient, ":", error.message);
        throw new Error("Erreur lors de la récupération des contrats pour le code client " + codeClient);
    }
}


const getAllContrats = async () => {
    try {
        const contrats = await Contrat.find({}).exec(); // Requête pour récupérer tous les contrats
        return contrats;
    } catch (error) {
        console.error("Erreur lors de la récupération des contrats :", error.message);
        throw new Error("Erreur lors de la récupération des contrats");
    }
}; 

module.exports = { getContratsByCodeClient , getAllContrats};
