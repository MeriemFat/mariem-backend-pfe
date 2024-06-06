// create Node.js server application
const express = require("express");
const cors = require('cors'); 

const app = express();
app.use(cors());
// Middleware CORS
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(express.json());
app.listen(3001, () => {
  console.log("The server is active on port 3001");
});
app.get("/", (req, res) => {
  res.send("MongoDB Express ");
});

// Importation du fichier db.js pour gérer la connexion à la base de données
const connectDB = require('../Backend/config/db.js');
connectDB()

// Importation des schémas Mongoose
const sinistre = require("./Shema/Sinistre");
const catalogue = require("./Shema/Catalogue.js");
const codeParinage = require("./Shema/CodeParinage");
const demande = require("./Shema/Demande");
const contrat = require("./Shema/Contrat");
const formulaireProduit = require("./Shema/FormulaireProduit");
const produit = require("./Shema/Produit.js"); 
const quittance = require("./Shema/Quittance");
const user = require("./Shema/User");
const rolerequest = require ("./Shema/RoleRequest.js"); 
const chat = require("./Shema/Chat.js"); 
// Using schema to build Mongoose models
const mongoose = require("mongoose");
// Création des modèles Mongoose à partir des schémas

module.exports = {
  Sinistre: sinistre,
  Catalogue:catalogue, 
  CodeParinage: codeParinage,
  Demande: demande,
  FormulaireProduit: formulaireProduit,
  Produit: produit, 
  Quittance: quittance,
  User: user,
  Contrat: contrat,
  RoleRequest:rolerequest, 
  Chat:chat 
};
