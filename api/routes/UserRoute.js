const express=require("express")
const router=express.Router()
const UserController=require('../controllers/UserController')
const tokenVerif = require('../../middleware/tokenVerification')
//Auth
router.post('/signup',UserController.signupUser);
router.post('/login',UserController.loginUser);
router.put('/updateRole/:userId', tokenVerif.requireAuth, UserController.updateRoleUser);
router.put('/reset',UserController.resetPassword);
router.put('/change-password',tokenVerif.requireAuth,UserController.changePassword);
module.exports = router;