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

const requireAdmin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Authorization is required!" });
    }

    const token = authorization.split(' ')[1];

    try {
        let authorized = false;
        // Déchiffrer le token et récupérer les informations utilisateur
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded Token:", decoded); // Ajout de log pour voir le contenu du token

        // Accéder directement aux rôles depuis le jeton décodé
        const roles = decoded.roles;

        if (!roles) {
            return res.status(403).json({ error: "User roles are required!" });
        }

        // Vérifier si le rôle administrateur (30) est présent
        if (roles.includes(30)) {
            authorized = true;
        }

        if (!authorized) {
            return res.status(403).json({ error: "Unauthorized access: Admins only!" });
        }

        // Attacher l'utilisateur à la requête
        req.user = decoded;  // Attacher toutes les informations utilisateur à la requête
        next();

    } catch (err) {
        console.error("Token error:", err.message); // Log de l'erreur pour plus d'infos
        return res.status(401).json({ error: "Invalid token: " + err.message });
    }
};




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
const authenticate = (req, res, next) => {
    // Vérifiez les headers ou le token pour authentifier l'utilisateur
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Décoder le token et obtenir l'utilisateur (exemple avec JWT)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded; // Ajoute l'utilisateur décodé à la requête
        next();
    });
};
const verifyToken = (req, res, next) => {
    const token = req?.headers['authorization']?.split(' ')[1];
  
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
       req.userId = decoded.userId;
   
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  };


module.exports = {requireAuth,requireAgent,requireAdmin,authMiddleware,authenticate,verifyToken}