const jwt = require('jsonwebtoken')
const User = require('../Shema/User')

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({error: 'Authorization token required'})
    }
    const token = authorization.split(' ')[1]
    try {
        const { user } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = await User.findOne({email : user.email})
        next()

    } catch (error) {
        res.status(401).json({error: error.message})
    }
}

const requireAdmin = async (req,res,next) => {
    const { authorization } = req.headers

    if (!authorization) {
        res.status(401).json({error: "Authorization is required!"})
   }

    const token = authorization.split(' ')[1]
    try{
        let authorized=false;
        const  {user}  = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // const user = await User.findById(u._id);
        user.roles.forEach(role=>{
            if(role === 30){
                authorized = true;
            }
        })
        if(!authorized){
            res.status(403).json({error:"Unauthorized"});
        }else{
            req.user = user;
            next()
        }
    }catch(err){
        res.status(401).json({error : err.message});
    }
}


const requireAgent = async (req,res,next) =>{
    const { authorization } = req.headers

    if (!authorization) {
        res.status(401).json({error: "Authorization is required!"})
    }

    const token = authorization.split(' ')[1]
    try{
        let authorized=false;
        const { _id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(_id);
        user.roles.forEach(role=>{
            if(role === 20){
                authorized = true;
            }
        })
        if(!authorized){
            res.status(403).json({error:"Unauthorized"});
        }else{
            req.user = user;
            next()
        }
    }catch(err){
        res.status(401).json({error : err.message});
    }
}

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        console.log("Authenticated user:", user); // Ajoutez un log ici
        req.user = user;
        next();
    });
};



module.exports = {requireAuth,requireAgent,requireAdmin,authMiddleware}