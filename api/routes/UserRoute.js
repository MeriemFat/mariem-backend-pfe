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
router.put('/toggle-block',UserController.toggleBlockUser); 
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
  router.get('/getbyemail', UserController.getByEmail);
  router.post('/request',tokenVerif.verifyToken,UserController.requestRole);
  router.get('/getAllusers', UserController.getAllUser);
  router.post('/checkEmail', UserController.checkemail);
  router.put('/profile',tokenVerif.authenticate,UserController.updateProfile);
  router.get('/getProfile',UserController.getProfile);
  router.get('/requests',UserController.getRoleRequests);
  router.put('/accept',tokenVerif.requireAdmin,UserController.acceptRoleRequest);
  router.put('/reject',tokenVerif.requireAdmin,UserController.rejectRoleRequest);
  router.get('/check-request',tokenVerif.verifyToken,UserController.getUserRoleRequest);
  router.get('/for-chat',tokenVerif.verifyToken,UserController.getUsersForChat); 
  router.post('/repondreAcceptParEmail/:_id',UserController.repondreAccepteParEmailByCodeAgent);
  router.get('/clients/parrainage', UserController.getClientsWithCodeParrainage);

module.exports = router;