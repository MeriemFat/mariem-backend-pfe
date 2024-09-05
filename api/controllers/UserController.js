const User = require('../../Shema/User.js')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const mailer = require('../../config/nodemailer.js');
const bcrypt = require("bcrypt");
const asyncHandler = require('express-async-handler')
const templateMail = require('../../config/templateMail.js');
const RoleRequest = require('../../Shema/RoleRequest.js')

const RequestedRole = {
    ACCEPTED:'ACCEPTED',
    REJECTED:'REJECTED',
    PENDING:'PENDING',
    NEW:'NEW'
};
const Role = {
    10: "Client",
    30: "ADMIN",
    1: "USER",
    20: "AGENT"
};
//                  =================================================
//                  ===================== AUTH ======================
//                  =================================================
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Email:", email); // Vérification des données reçues
        console.log("Password:", password); // Vérification des données reçues

        const user = await User.login(email, password);

        console.log("User found:", user);

        const validRoles = ['ADMIN', 'Client', 'AGENT'];
        if (!validRoles.includes(Role[user.roles[0]])) {
            throw new Error('User does not have permission to login');
        }

        user.password = '';

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
                    identifiant: user.identifiant
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60m' }
        );

        const refreshToken = jwt.sign(
            {
                _id: user._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ accessToken,user });
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(400).json({ error: error.message });
    }
};

const signupUser = async (req, res) => {
    const {codeClient , codeAgent , Nom,prenom,phone,adresse,password, email,cin, typePerson , 
        ville, codePostal, typeIdentifiant,dateCreation, dateDernierMiseAjour, dateValidite, codeParent , avatar, identifiant} = req.body;

    try {
        const user = await User.signup(codeClient , codeAgent , Nom,prenom,phone,adresse,password, email,cin, typePerson , 
            ville, codePostal, typeIdentifiant,dateCreation, dateDernierMiseAjour, dateValidite, codeParent , avatar, identifiant);

        user.secret = '';

        const accessToken = jwt.sign(
            {
                user: {
                    codeClient: user.codeClient,
                    codeAgent: user.codeAgent,
                    Nom: user.Nom,
                    prenom: user.prenom, 
                    phone: user.phone,
                    adresse:user.adresse, 
                    password: user.password,
                    email: user.email, 
                    cin:user.cin, 
                    typePerson:user.typePerson, 
                    ville:user.ville, 
                    codePostal:user.codePostal, 
                    typeIdentifiant:user.typeIdentifiant, 
                    dateCreation:user.dateCreation, 
                    dateDernierMiseAjour:user.dateDernierMiseAjour,
                    dateValidite:user.dateValidite,  
                    roles:user.roles, 
                    codeParent:user.codeParent, 
                    avatar:user.avatar, 
                    identifiant:user.identifiant, 
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60m' }
        );

        // Create a refresh token
        const refreshToken = jwt.sign(
            {
                _id: user._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        // Create cookie with refresh token
        res.cookie('jwt', refreshToken, {
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
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
                identifiant: user.identifiant,
            },
            accessToken
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
            throw new Error('User not found');
        }

        const validRoleIds = Object.keys(Role).map(Number);
        if (!validRoleIds.includes(newRoleId)) {
            throw new Error('Invalid role ID');
        }

        const oldRoleId = user.roles[0];
        user.roles = [newRoleId];

        await user.save();

        const oldRoleName = Role[oldRoleId];
        const newRoleName = Role[newRoleId];

        if (oldRoleId === newRoleId) {
            await mailer.sendMail({
                from: 'meriam.fathallah@takaful.tn',
                to: user.email,
                subject: 'Your request to change your role has been refused',
                text: `Your request to change your role has been refused. 
                Please contact our support at support@gmail.com for more information.`
            });
        }else {
            await mailer.sendMail({
                from: 'meriam.fathallah@takaful.tn',
                to: user.email,
                subject: 'Your role has been updated',
                text: `Your role has been changed from ${oldRoleName} to ${newRoleName}. 
                If you are currently logged in, please make sure to log out and log back in to apply the changes.
                this is your email : ${user.email}.
                and this your password ${user.password}.
                `
            });
        }



        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const resetPassword = async (req, res) => {
    let Email = req.body.email
    const charset = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+';
    let password = '';

    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    const user = await User.findOne({email: Email.toString()});
    if (!user._id) {
        Error('Invalid email');
    }
    try {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(user._id, user);
        await mailer.sendMail({
            from: 'meriam.fathallah@takaful.tn',
            to: Email,
            subject: "Reset password request",
            html: "<p>Your password has been reset to: </p><b>" + password + "</b>",
        });
        res.status(200).json({message: "Password reset is sent to " + Email})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const changePassword = async (req, res) => {
    try {
        const {currentPassword, newPassword} = req.body;
        const match = await bcrypt.compare(currentPassword, req.user.password)
        if (!match) {
            res.status(401).json({error: "Old password is incorrect!"})
        }
        if (match) {
            const salt = await bcrypt.genSalt(10)
            req.user.password = await bcrypt.hash(newPassword, salt);
            await User.findByIdAndUpdate(req.user._id, req.user);
            res.status(200).json('Password changed successfully!')
        }
    } catch (e) {
        res.status(401).json({error: e.message})
    }
}

async function getByEmail(req, res) {
    const {email} = req.query;
    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        const {codeClient , codeAgent , Nom,prenom,phone,adresse,password, email,cin, typePerson , 
            ville, codePostal, typeIdentifiant,dateCreation, dateDernierMiseAjour, dateValidite, codeParent , avatar, identifiant} = user;
        res.status(200).json({
            codeClient ,
             codeAgent ,
              Nom,
              prenom,
              phone,
              adresse,
              password, 
              email,
              cin,
               typePerson , 
               ville,
              codePostal, 
              typeIdentifiant,
              dateCreation,
               dateDernierMiseAjour,
                dateValidite,
                 codeParent , 
                 avatar, 
                 identifiant

        });
    } catch (error) {
        console.error('Error fetching user by email:', error.message);
        res.status(500).json({error: 'Internal Server Error'});
    }
} 

const getUserByCodeAgent = async (req, res) => {
    const { codeAgent } = req.params;
    console.log('Received codeAgent:', codeAgent);
  
    try {
      const user = await User.findOne({ codeAgent: codeAgent });
      if (!user) {
        console.log('User not found for codeAgent:', codeAgent);
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('User found:', user);
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
 const  requestRole = async (req,res)=>{
    try{
        const user = req.user;
        const requestedRole = req.body.requestedRole;
        const roleRequest = await RoleRequest.create({
            user:user,
            requestedRole:requestedRole,
        });
        res.status(200).json(roleRequest);
    }catch(e){
        res.status(400).json({error:e.message})
    }
}; 
// Fonction pour récupérer tous les utilisateurs
const getAllUser = async (req, res) => {
    try {
        const users = await User.find().exec(); // Récupérer tous les utilisateurs
        res.json(users); // Envoyer la liste des utilisateurs en réponse
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error.message);
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs." });
    }
};

const checkemail =async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    const user = await User.findOne({ email });
    if (user) {
        return res.status(200).json({ exists: true });
    } else {
        return res.status(200).json({ exists: false });
    }
};
const toggleBlockUser =async(req, res) =>{
    try {
        const _id = req.body._id;
        const userToBlock = await User.findById(_id);

        userToBlock.isBlocked = !userToBlock.isBlocked;

        await User.findByIdAndUpdate(userToBlock._id, userToBlock);

        res.status(200).json({message: "Updated user status successfully!"})
    } catch (e) {
        res.status(401).json({error: e.message})
    }
}; 
const  updateUserProfile =async(req, res)  =>{
    try {
        const u = req.body.user;
        const usr = req.user;
        usr.codeClient = u.codeClient;
        usr.Nom = u.Nom;
        usr.prenom = u.prenom;
        usr.phone = u.phone;
        usr.adresse=u.adresse;
        usr.email=u.email;
        usr.cin=u.cin;
        usr.typePerson=u.typePerson;
        usr.ville=u.ville;
        usr.codePostal=u.codePostal;
        usr.typeIdentifiant=u.typeIdentifiant;
        usr.dateCreation=u.dateCreation;
        usr.dateDernierMiseAjour=u.dateDernierMiseAjour;
        usr.dateValidite=u.dateValidite;
        usr.roles=u.roles;
        usr.codeParent=u.codeParent;
        usr.avatar=u.avatar;
        usr.identifiant=u.identifiant;
        await User.findByIdAndUpdate(usr._id,usr)

        const user = await User.findById(usr._id);

        const accessToken = jwt.sign(
            {
                "user":
                    {
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
                        identifiant: user.identifiant,
                    }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '60m'}
        )
        // Create a refresh token
        const refreshToken = jwt.sign(
            {
                "_id": u._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '7d'}
        )
        res.cookie('jwt', refreshToken, {
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        await User.findByIdAndUpdate(u._id, u);
        res.status(200).json({accessToken})

    } catch (err) {
        res.status(401).json({error: err.message})
    }
}; 
const getProfileByCodeAgent = async (req, res) => {
    try {
        const { codeAgent } = req.query;

        // Chercher l'utilisateur par codeAgent
        const user = await User.findOne({ codeAgent });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Retourner les informations utilisateur
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Met à jour le profil de l'agent
const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { codeAgent } = req.user;
        const updateData = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { codeAgent },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getRoleRequests= async(req,res)=>{
    try{
        const requests = await RoleRequest.find({ result: 'PENDING' });
        let reqs = [];
        for(const request of requests){
            const user = await User.findById(request.user)
            const newRequest ={
                _id: request._id,
                requestedRole: request.requestedRole,
                result: request.result,
                user: user,
            }
            reqs.push(newRequest);
        }
        res.status(200).json(reqs);
    }catch(e){
        res.status(400).json({error:e.message})
    }
}; 
const acceptRoleRequest= async(req,res)=>{
    try{
        let roleRequest = req.body;
        roleRequest.result = RequestedRole.ACCEPTED;
        const user = await User.findById(roleRequest.user);
        user.roles.push(roleRequest.requestedRole);
        await User.findByIdAndUpdate(user._id,user);
        roleRequest.user=await User.findById(user._id);
        await RoleRequest.findByIdAndUpdate(roleRequest._id,roleRequest);
        const result = await RoleRequest.findById(roleRequest._id);
        res.status(200).json(result);
    }catch(e){
        res.status(400).json({error:e.message})
    }
}; 
const  rejectRoleRequest=async(req,res)=>{
    try{
        const roleRequest = req.body;
        roleRequest.result = RequestedRole.REJECTED;
        await RoleRequest.findByIdAndUpdate(roleRequest._id,roleRequest);
        const result = await RoleRequest.findById(roleRequest._id);
        res.status(200).json(result);
    }catch(e){
        console.log("Error: "+e.message);
        res.status(400).json({error:e.message})
    }
}; 
const  getUserRoleRequest=async(req, res)=> {
    try {
        const user = req.user;
        const requests = await RoleRequest.find();
        const userRequests = requests.filter(r => {
            return r.user.equals(user._id);
        });
        if (!requests) {
            res.status(200).json({ notfound: true });
            return;
        }

        if (userRequests.length > 0) {
            const request = userRequests.find(r => r.result === 'PENDING');
            if (request && (request.result === 'PENDING')) {
                res.status(200).json({ request });
            } else {
                res.status(200).json({ notfound: true });
            }
        } else {
            res.status(200).json({ notfound: true });
        }
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
}
module.exports = {
    loginUser,
    signupUser,
    updateRoleUser,
    resetPassword,
    changePassword , 
    getUserByCodeAgent, 
    getByEmail, 
    requestRole, 
    getAllUser, 
    checkemail, 
    toggleBlockUser, 
    updateUserProfile, 
    getProfileByCodeAgent, 
    updateProfile, getUserRoleRequest,
    getRoleRequests, acceptRoleRequest ,rejectRoleRequest
}