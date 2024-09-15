const User = require("../../Shema/User.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailer = require("../../config/nodemailer.js");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const templateMail = require("../../config/templateMail.js");
const RoleRequest = require("../../Shema/RoleRequest.js");
const transporter = require('../../config/nodemailer');
const mongoose = require("mongoose"); // Importez mongoose
const RequestedRole = {
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  PENDING: "PENDING",
  NEW: "NEW",
};
const Role = {
  10: "Client",
  30: "ADMIN",
  1: "USER",
  20: "AGENT",
};
//                  =================================================
//                  ===================== AUTH ======================
//                  =================================================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {


    const user = await User.login(email, password);


    const validRoles = ["ADMIN", "Client", "AGENT"];
    if (!validRoles.includes(Role[user.roles[0]])) {
      throw new Error("User does not have permission to login");
    }

    user.password = "";

    const accessToken = jwt.sign(
      {
        _id: user._id,
        codeClient: user.codeClient,
        codeAgent: user.codeAgent,
        Nom: user.Nom,
        prenom: user.prenom,
        phone: user.phone,
        adresse: user.adresse,
        email: user.email,
        cin: user.cin,
        typePerson: user.typePerson,
        ville: user.ville,
        codePostal: user.codePostal,
        typeIdentifiant: user.typeIdentifiant,
        dateCreation: user.dateCreation,
        dateDernierMiseAjour: user.dateDernierMiseAjour,
        dateValidite: user.dateValidite,
        roles: user.roles,
        codeParent: user.codeParent,
        avatar: user.avatar,
        isBlocked: user.isBlocked,
        codeParinage: user.codeParinage, 
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ accessToken, user });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const {
    codeClient,
    codeAgent,
    Nom,
    prenom,
    phone,
    adresse,
    password,
    email,
    cin,
    typePerson,
    ville,
    codePostal,
    typeIdentifiant,
    dateCreation,
    dateDernierMiseAjour,
    dateValidite,
    codeParent,
    avatar,
    isBlocked,
    codeParinage,
  } = req.body;

  try {
    const user = await User.signup(
      codeClient,
      codeAgent,
      Nom,
      prenom,
      phone,
      adresse,
      password,
      email,
      cin,
      typePerson,
      ville,
      codePostal,
      typeIdentifiant,
      dateCreation,
      dateDernierMiseAjour,
      dateValidite,
      codeParent,
      avatar,
      isBlocked, codeParinage
    );

    user.secret = "";

    const accessToken = jwt.sign(
      {
        user: {
          codeClient: user.codeClient,
          codeAgent: user.codeAgent,
          Nom: user.Nom,
          prenom: user.prenom,
          phone: user.phone,
          adresse: user.adresse,
          password: user.password,
          email: user.email,
          cin: user.cin,
          typePerson: user.typePerson,
          ville: user.ville,
          codePostal: user.codePostal,
          typeIdentifiant: user.typeIdentifiant,
          dateCreation: user.dateCreation,
          dateDernierMiseAjour: user.dateDernierMiseAjour,
          dateValidite: user.dateValidite,
          roles: user.roles,
          codeParent: user.codeParent,
          avatar: user.avatar,
          isBlocked: user.isBlocked,
          codeParinage: user.codeParinage,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );

    // Create a refresh token
    const refreshToken = jwt.sign(
      {
        _id: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Create cookie with refresh token
    res.cookie("jwt", refreshToken, {
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // Envoyer les informations de l'utilisateur et le token d'accès dans la réponse
    res.status(200).json({
      user: {
        codeClient: user.codeClient,
        codeAgent: user.codeAgent,
        Nom: user.Nom,
        prenom: user.prenom,
        phone: user.phone,
        adresse: user.adresse,
        email: user.email,
        cin: user.cin,
        typePerson: user.typePerson,
        ville: user.ville,
        codePostal: user.codePostal,
        typeIdentifiant: user.typeIdentifiant,
        dateCreation: user.dateCreation,
        dateDernierMiseAjour: user.dateDernierMiseAjour,
        dateValidite: user.dateValidite,
        roles: user.roles,
        codeParent: user.codeParent,
        avatar: user.avatar,
        isBlocked: user.isBlocked,
        codeParinage: user.codeParinage, 
      },
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const updateRoleUser = async (req, res) => {
  const userId = req.params.userId;
  const RoleId = req.body.roles;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const validRoleIds = Object.keys(Role).map(Number);
    if (!validRoleIds.includes(newRoleId)) {
      throw new Error("Invalid role ID");
    }

    const oldRoleId = user.roles[0];
    user.roles = [newRoleId];

    await user.save();

    const oldRoleName = Role[oldRoleId];
    const newRoleName = Role[newRoleId];

    if (oldRoleId === newRoleId) {
      await mailer.sendMail({
        from: "meriam.fathallah@takaful.tn",
        to: user.email,
        subject: "Your request to change your role has been refused",
        text: `Your request to change your role has been refused. 
                Please contact our support at support@gmail.com for more information.`,
      });
    } else {
      await mailer.sendMail({
        from: "meriam.fathallah@takaful.tn",
        to: user.email,
        subject: "Your role has been updated",
        text: `Your role has been changed from ${oldRoleName} to ${newRoleName}. 
                If you are currently logged in, please make sure to log out and log back in to apply the changes.
                this is your email : ${user.email}.
                and this your password ${user.password}.
                `,
      });
    }

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const email = req.body.email;
  const charset =
    "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+";
  let password = "";

  // Génération du nouveau mot de passe
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  try {
    // Vérification de l'existence de l'utilisateur avec cet e-mail
    const user = await User.findOne({ email: email.toString() });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé avec cet e-mail" });
    }

    // Hashage du nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Mise à jour du mot de passe de l'utilisateur
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    // Envoi de l'e-mail avec le nouveau mot de passe
    await mailer.sendMail({
      from: "meriam.fathallah@takaful.tn",
      to: email,
      subject: "Demande de réinitialisation du mot de passe",
      html: `<p>Votre mot de passe a été réinitialisé. Votre nouveau mot de passe est : </p><b>${password}</b>`,
    });

    // Réponse en cas de succès
    res.status(200).json({ message: "Le mot de passe a été réinitialisé et envoyé à " + email });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    res.status(500).json({ error: "Erreur lors de la réinitialisation du mot de passe" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const match = await bcrypt.compare(currentPassword, req.user.password);
    if (!match) {
      res.status(401).json({ error: "Old password is incorrect!" });
    }
    if (match) {
      const salt = await bcrypt.genSalt(10);
      req.user.password = await bcrypt.hash(newPassword, salt);
      await User.findByIdAndUpdate(req.user._id, req.user);
      res.status(200).json("Password changed successfully!");
    }
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
};

async function getByEmail(req, res) {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const {
      codeClient,
      codeAgent,
      Nom,
      prenom,
      phone,
      adresse,
      password,
      email,
      cin,
      typePerson,
      ville,
      codePostal,
      typeIdentifiant,
      dateCreation,
      dateDernierMiseAjour,
      dateValidite,
      codeParent,
      avatar,
      isBlocked,
      codeParinage
    } = user;
    res.status(200).json({
      codeClient,
      codeAgent,
      Nom,
      prenom,
      phone,
      adresse,
      password,
      email,
      cin,
      typePerson,
      ville,
      codePostal,
      typeIdentifiant,
      dateCreation,
      dateDernierMiseAjour,
      dateValidite,
      codeParent,
      avatar,
      isBlocked,
      codeParinage,
    });
  } catch (error) {
    console.error("Error fetching user by email:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const getUserByCodeAgent = async (req, res) => {
  const { codeAgent } = req.params;
  console.log("Received codeAgent:", codeAgent);

  try {
    const user = await User.findOne({ codeAgent: codeAgent });
    if (!user) {
      console.log("User not found for codeAgent:", codeAgent);
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User found:", user);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserIdAfterVerifyToken= async (request)=>{
    const authHeader = request?.headers['authorization'];
    const bearer = authHeader && authHeader.split(' ')[1];
    return jwt.verify(bearer,process.env.ACCESS_TOKEN_SECRET);
}
async function requestRole(req, res) {
  try {
    const user = await getUserIdAfterVerifyToken(req)
    const userId=user._id
    const requestedRole = req.body.requestedRole;
    const roleRequest = await RoleRequest.create({
      user: userId,
      requestedRole: requestedRole,
    });
    res.status(200).json(roleRequest);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// Fonction pour récupérer tous les utilisateurs
const getAllUser = async (req, res) => {
  try {
    const users = await User.find().exec(); // Récupérer tous les utilisateurs
    res.json(users); // Envoyer la liste des utilisateurs en réponse
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des utilisateurs :",
      error.message
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des utilisateurs." });
  }
};

const checkemail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(200).json({ exists: true });
  } else {
    return res.status(200).json({ exists: false });
  }
};
async function toggleBlockUser(req, res) {
  try {
    const _id = req.body._id;
    const userToBlock = await User.findById(_id);

    userToBlock.isBlocked = !userToBlock.isBlocked;

    await User.findByIdAndUpdate(userToBlock._id, userToBlock);

    res.status(200).json({ message: "Updated user status successfully!" });
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
}
const updateUserProfile = async (req, res) => {
  try {
    const u = req.body.user;
    const usr = req.user;
    usr.codeClient = u.codeClient;
    usr.Nom = u.Nom;
    usr.prenom = u.prenom;
    usr.phone = u.phone;
    usr.adresse = u.adresse;
    usr.email = u.email;
    usr.cin = u.cin;
    usr.typePerson = u.typePerson;
    usr.ville = u.ville;
    usr.codePostal = u.codePostal;
    usr.typeIdentifiant = u.typeIdentifiant;
    usr.dateCreation = u.dateCreation;
    usr.dateDernierMiseAjour = u.dateDernierMiseAjour;
    usr.dateValidite = u.dateValidite;
    usr.roles = u.roles;
    usr.codeParent = u.codeParent;
    usr.avatar = u.avatar;
    usr.isBlocked = u.isBlocked;
    usr.codeParinage = u.codeParinage; 
    await User.findByIdAndUpdate(usr._id, usr);

    const user = await User.findById(usr._id);

    const accessToken = jwt.sign(
      {
        user: {
          codeClient: user.codeClient,
          codeAgent: user.codeAgent,
          Nom: user.Nom,
          prenom: user.prenom,
          phone: user.phone,
          adresse: user.adresse,
          email: user.email,
          cin: user.cin,
          typePerson: user.typePerson,
          ville: user.ville,
          codePostal: user.codePostal,
          typeIdentifiant: user.typeIdentifiant,
          dateCreation: user.dateCreation,
          dateDernierMiseAjour: user.dateDernierMiseAjour,
          dateValidite: user.dateValidite,
          roles: user.roles,
          codeParent: user.codeParent,
          avatar: user.avatar,
          isBlocked: user.isBlocked,
          codeParinage : user.codeParinage, 
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );
    // Create a refresh token
    const refreshToken = jwt.sign(
      {
        _id: u._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("jwt", refreshToken, {
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    await User.findByIdAndUpdate(u._id, u);
    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
const getProfileByCodeAgent = async (req, res) => {
  try {
    const { codeAgent } = req.query;

    // Chercher l'utilisateur par codeAgent
    const user = await User.findOne({ codeAgent });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retourner les informations utilisateur
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// Met à jour le profil de l'agent
const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { codeAgent } = req.user;
    const updateData = req.body;

    const updatedUser = await User.findOneAndUpdate({ codeAgent }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
async function getRoleRequests(req,res){
    try{
        const requests = await RoleRequest.find({ result: 'PENDING' }).populate('user').exec();
        // let reqs = [];
        // for(const request of requests){
        //     const user = await User.findById(request.user)
        //     const newRequest ={
        //         _id: request._id,
        //         requestedRole: request.requestedRole,
        //         result: request.result,
        //         user: user,
        //     }
        //     reqs.push(newRequest);
        // }
        res.status(200).json(requests);

    } catch (e) {
        res.status(400).json({ error: e.message });
      }
}
// async function getRoleRequests(req, res) {
//   try {
//     // Récupérer les demandes en attente
//     const requests = await RoleRequest.find({ result: "PENDING" });
//     console.log('requests',requests)
//     let reqs = [];

//     for (const request of requests) {
//       let user = null; // Initialisez l'objet user comme null par défaut

//       // Vérifiez si l'ID utilisateur est défini
//       if (request.user) {
//         try {
//           const foundUser = await User.findById(request.user);

//           // Vérifiez si l'utilisateur a été trouvé
//           if (foundUser) {
//             user = {
//               _id: foundUser._id,
//               codeClient: foundUser.codeClient,
//               codeAgent: foundUser.codeAgent,
//               Nom: foundUser.Nom,
//               prenom: foundUser.prenom,
//               phone: foundUser.phone,
//               adresse: foundUser.adresse,
//               email: foundUser.email,
//               cin: foundUser.cin,
//               typePerson: foundUser.typePerson,
//               ville: foundUser.ville,
//               codePostal: foundUser.codePostal,
//               typeIdentifiant: foundUser.typeIdentifiant,
//               dateCreation: foundUser.dateCreation,
//               dateDernierMiseAjour: foundUser.dateDernierMiseAjour,
//               dateValidite: foundUser.dateValidite,
//               roles: foundUser.roles,
//               codeParent: foundUser.codeParent,
//               avatar: foundUser.avatar,
//               identifiant: foundUser.identifiant,
//               // Ajoutez d'autres champs de `foundUser` ici si nécessaire
//             };
//           } else {
//             console.warn(`User with ID ${request.user} not found.`);
//           }
//         } catch (err) {
//           console.error(
//             `Error fetching user with ID ${request.user}:`,
//             err.message
//           );
//         }
//       } else {
//         console.warn(`Request ${request._id} has no user ID.`);
//       }

//       // Création de l'objet newRequest
//       const newRequest = {
//         _id: request._id,
//         requestedRole: request.requestedRole,
//         result: request.result,
//         user: user, // Renvoie l'objet user avec des valeurs récupérées ou null
//       };

//       reqs.push(newRequest);
//     }

//     res.status(200).json(reqs);
//   } catch (e) {
//     res.status(400).json({ error: e.message });
//   }
// }

async function rejectRoleRequest(req, res) {
  try {
    const roleRequest = req.body;
    roleRequest.result = RequestedRole.REJECTED;
    await RoleRequest.findByIdAndUpdate(roleRequest._id, roleRequest);
    const result = await RoleRequest.findById(roleRequest._id);
    res.status(200).json(result);
  } catch (e) {
    console.log("Error: " + e.message);
    res.status(400).json({ error: e.message });
  }
}

async function acceptRoleRequest(req, res) {
  try {
    const { user: userId, _id: roleRequestId, requestedRole } = req.body;

    if (!userId || !roleRequestId || !requestedRole) {
      return res.status(400).json({ error: "Informations manquantes" });
    }

    // Trouver l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Supposons que le rôle à remplacer est le dernier rôle dans le tableau roles
    const oldRole = user.roles[user.roles.length - 1]; // Exemple pour prendre le dernier rôle ajouté

    // Retirer l'ancien rôle
    user.roles = user.roles.filter(role => role !== oldRole);

    // Ajouter le nouveau rôle si ce n'est pas déjà le même
    if (!user.roles.includes(requestedRole)) {
      user.roles.push(requestedRole);
    } else {
      return res.status(400).json({ error: "L'utilisateur a déjà ce rôle" });
    }

    // Mettre à jour l'utilisateur avec les nouveaux rôles
    await User.findByIdAndUpdate(user._id, { roles: user.roles }, { new: true });

    // Mettre à jour la demande de rôle
    await RoleRequest.findByIdAndUpdate(roleRequestId, { result: RequestedRole.ACCEPTED, user: user._id }, { new: true });

    // Renvoyer la demande de rôle mise à jour
    const result = await RoleRequest.findById(roleRequestId);

    res.status(200).json(result);
  } catch (e) {
    console.error("Error:", e.message);
    res.status(500).json({ error: e.message });
  }
}



async function rejectRoleRequest(req, res) {
  try {
    const roleRequest = req.body;
    roleRequest.result = RequestedRole.REJECTED;
    await RoleRequest.findByIdAndUpdate(roleRequest._id, roleRequest);
    const result = await RoleRequest.findById(roleRequest._id);
    res.status(200).json(result);
  } catch (e) {
    console.log("Error: " + e.message);
    res.status(400).json({ error: e.message });
  }
}

// Assurez-vous que mongoose est importé

async function getUserRoleRequest(req, res) {
  try {
    const user = await getUserIdAfterVerifyToken(req)


    if (!user || !user._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const userId=user._id

    const requests = await RoleRequest.find({ user: userId });


    return res.status(200).json({request:requests?.length>0} );

    
  } catch (e) {

    res.status(500).json({ error: "An unexpected error occurred" });
  }
}
async function getUsersForChat(req, res) {
  try {
    const current = req.user;
    const users = await User.find();
    const resp = users
      .filter((user) => user._id !== current._id)
      .map((user) => ({
        email: user.email,
        fullname: user.fullname,
      }));

    res.status(200).json({ data: resp });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}
const repondreAccepteParEmailByCodeAgent = async (req, res) => {
  const { _id } = req.params; // Utilise l'ID pour identifier l'utilisateur
  console.log("ID reçu :", _id); // Vérifie que l'ID est bien reçu

  try {
      // Récupérer l'utilisateur par son ID
      const user = await User.findById(_id).exec();
      console.log("Utilisateur trouvé :", user); // Affiche l'utilisateur trouvé

      if (!user) {
          console.error('Utilisateur non trouvé pour l\'ID:', _id);
          return res.status(404).json({ message: 'Utilisateur non trouvé pour l\'ID: ' + _id });
      }

      const mailOptions = {
        from: 'meriam.fathallah@takaful.tn',
        to: user.email,
        subject: 'Réponse à votre demande',
        text: 'Votre demande a reçu la réponse suivante'
    };

    console.log('Envoi de l\'e-mail à :', user.email);

    // Envoyer l'e-mail
    await transporter.sendMail(mailOptions);

      // Répondre avec un message de succès
      res.status(200).json({ message: 'E-mail envoyé avec succès à ' + user.email });

  } catch (error) {
      console.error('Erreur lors de la réponse à la demande par e-mail:', error.message);
      res.status(500).json({ message: 'Erreur lors de la réponse à la demande par e-mail: ' + error.message });
  }
};
const getClientsWithCodeParrainage = async (req, res) => {
  try {
    // Rechercher tous les clients dont le champ `codeParrainage` n'est pas vide ou nul
    const clients = await User.find({ codeParrainage: { $ne: "" } }).exec();

    // Vérifier si des clients ont été trouvés
    if (!clients || clients.length === 0) {
      return res.status(404).json({ message: 'Aucun client avec un code de parrainage trouvé.' });
    }

    // Retourner la liste des clients
    res.status(200).json(clients);
  } catch (error) {
    console.error("Erreur lors de la récupération des clients avec un code de parrainage:", error.message);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des clients.' });
  }
};




module.exports = {
  loginUser,
  signupUser,
  updateRoleUser,
  resetPassword,
  changePassword,
  getUserByCodeAgent,
  getByEmail,
  requestRole,
  getAllUser,
  checkemail,
  toggleBlockUser,
  updateUserProfile,
  getProfileByCodeAgent,
  updateProfile,
  getUserRoleRequest,
  getRoleRequests,
  acceptRoleRequest,
  rejectRoleRequest,
  getUsersForChat,
  repondreAccepteParEmailByCodeAgent, 
  getClientsWithCodeParrainage
};
