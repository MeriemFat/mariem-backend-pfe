const express=require("express")
const router=express.Router()
const User = require('../../Shema/User'); 
const UserController=require('../controllers/UserController')
const tokenVerif = require('../../middleware/tokenVerification')
//Auth
router.post('/signup', UserController.signupUser);
router.post('/login',UserController.loginUser);
router.put('/updateRole/:userId', tokenVerif.requireAuth, UserController.updateRoleUser);
router.put('/reset',UserController.resetPassword);
router.put('/change-password',tokenVerif.requireAuth,UserController.changePassword);
// Route pour obtenir un utilisateur par codeClient
router.get('/getUserByCodeClient/:codeClient', async (req, res) => {
    try {
      const user = await User.findOne({ codeClient: req.params.codeClient });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  router.get('/getUserByCodeAgent/:codeAgent',UserController.getUserByCodeAgent);
module.exports = router;