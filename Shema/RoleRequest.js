const mongoose = require('mongoose');
const user = require('./User');
// Définition des énumérations pour les rôles demandés et les résultats
const RequestedRole = {
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    PENDING: 'PENDING',
};

const Role = {
    Client: 10,
    ADMIN: 30,
    USER: 1,
    AGENT: 20
};

// Définition du schéma RoleRequest
const RoleRequestSchema = mongoose.Schema({
      requestedRole: {
            type : Number,
            enum : Object.values(Role),
            default : Role.Client
        },
        result:{
            type : String,
            enum : Object.values(RequestedRole),
            default : RequestedRole.PENDING
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }, },{ timestamps: true });; // Ajoute les timestamps pour createdAt et updatedAt

// Création du modèle RoleRequest
const RoleRequest = mongoose.model('rolerequest', RoleRequestSchema);
module.exports = RoleRequest;
