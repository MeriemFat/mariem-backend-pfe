const jwt = require("jsonwebtoken");
require("dotenv").config();
const getUserIdAfterVerifyToken= async (request)=>{
    const authHeader = request?.headers['authorization'];
    const bearer = authHeader && authHeader.split(' ')[1];
    return jwt.verify(bearer,process.env.ACCESS_TOKEN_SECRET);
}

module.exports={getUserIdAfterVerifyToken}