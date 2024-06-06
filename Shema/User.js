const bcrypt = require("bcrypt");
const validator = require('validator');
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const Role = {
    Client: 10,
    ADMIN: 30,
    USER: 1,
    AGENT: 20
};
const TypePersonne = {
    Soc: 'Société',
    PERS: 'Personne physique'
}; 
const RequestedRole = {
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    PENDING: 'PENDING',
    NEW: 'NEW'
};

const User =  Schema({
   codeClient:String,
    codeAgent : String,
    Nom : String,
	prenom:String, 
    phone: String,
    adresse: String, 
    password:String , 
    email:String , 
    cin: String,
	typePerson:[{type:String , 
        enum:Object.values(TypePersonne), 
        default:TypePersonne.PERS
}] , 
	ville:String, 
	codePostal:String , 
	typeIdentifiant:String , 
    dateCreation: {
        type: Date,
        default: Date.now
    },
    dateDernierMiseAjour: {
        type: Date,
        default: Date.now
    },
	dateValidite: {type: Date,
    default: Date.now
    },
    roles: [{
        type: Number,
        enum: Object.values(Role),
        default: Role.USER
    }],
    requestedRole: {
        type: String,
        enum: Object.values(RequestedRole),
        default: RequestedRole.NEW
    },
    codeParent: String,
    avatar: {
        type: String,
        default: "http://localhost:3000/placeholder.webp"
    },
    identifiant: String,
    },
    
); 

User.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Incorrect email');
    }

    console.log("Stored hashed password:", user.password);
    console.log("Provided password:", password);

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect password');
    }

    return user;
};

User.statics.signup = async function(codeClient,codeAgent,Nom,prenom,phone,
	adresse,password,email,cin,typePerson,ville, codePostal,typrIdentifiant,
	dateCreation,dateDernierMiseAjour,dateValidite,codeParent,identifiant,TypePerson) {

    // if (!codeClient || !codeAgent || !Nom||!prenom||!phone) {
    //     throw new Error('All fields must be filled');
    // }
    if (!validator.isEmail(email)) {
        throw new Error('Email not valid');
    }

    const exists = await this.findOne({ email });
    if (exists) {
        throw new Error('Email already in use');
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const rls = [Role.USER];
    return await this.create({ codeClient,codeAgent,Nom,prenom,phone,
		adresse,password: hashedPassword,email,cin,typePerson,ville, codePostal,typrIdentifiant,
		dateCreation,dateDernierMiseAjour,dateValidite,roles: rls,codeParent,identifiant,TypePerson });
};

const user = mongoose.model('user', User);
module.exports = user;