const express=require("express")
const router=express.Router()
const chatController = require('../controllers/chatController');
const tokenVerif = require('../../middleware/tokenVerification')


router.post('/create',tokenVerif.requireAuth, chatController.createNewChat)

router.get('/',tokenVerif.requireAuth,chatController.getUserChats)

router.post('/add',chatController.add);

router.get('/getall',chatController.getall);

router.get('/getbyid/:id',chatController.getbyid);

router.get('/getbyname/:name',chatController.getbyname);

router.put('/update/:id',chatController.update);

router.delete('/delete/:id',chatController.deletechat);

module.exports = router;