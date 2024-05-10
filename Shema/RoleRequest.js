const mongoose = require('mongoose');
const Schema = mongoose.Schema

const RequestedRole = {
    ACCEPTED:'ACCEPTED',
    REJECTED:'REJECTED',
    PENDING:'PENDING',
    NEW:'NEW'
};

const Role = {
    Client: 10,
    ADMIN: 30,
    USER: 1,
    AGENT: 20
};

const RoleRequest =  Schema({
    requestedRole: {
        type : Number,
        enum : Object.values(Role),
        default : Role.USER
    },
    result:{
        type : String,
        enum : Object.values(RequestedRole),
        default : RequestedRole.PENDING
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})
const rolerequest = mongoose.model('rolerequest', RoleRequest);
module.exports = rolerequest;

