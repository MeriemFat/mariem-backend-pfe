const User = require('../../Shema/User.js')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const mailer = require('../../config/nodemailer.js');
const bcrypt = require("bcrypt");
const asyncHandler = require('express-async-handler')
const templateMail = require('../../config/templateMail.js');
const RoleRequest = require('../../Shema/RoleRequest.js')
const twilio = require('twilio');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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

        // Send SMS
        await client.messages.create({
            body: `Hello ${user.fullname}, you have successfully logged in.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: user.phone
        });

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

        const refreshToken = jwt.sign(
            {
                "_id": user._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('jwt', refreshToken, {
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const signupUser = async (req, res) => {
    const {codeClient , codeAgent , Nom,prenom,phone,adresse,password, email,cin, typePerson , 
        ville, codePostal, typeIdentifiant,dateCreation, dateDernierMiseAjour, dateValidite, roles, codeParent , avatar, identifiant} = req.body;

    try {
        const user = await User.signup(codeClient , codeAgent , Nom,prenom,phone,adresse,password, email,cin, typePerson , 
            ville, codePostal, typeIdentifiant,dateCreation, dateDernierMiseAjour, dateValidite, roles, codeParent , avatar, identifiant);

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

        res.status(200).json({ accessToken });
    } catch (error) {
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
module.exports = {
    loginUser,
    signupUser,
    updateRoleUser,
    resetPassword,
    changePassword 
}