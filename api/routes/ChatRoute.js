const express=require("express")
const router=express.Router()
const chatController = require('../controllers/chatController');
const tokenVerif = require('../../middleware/tokenVerification')


router.post('/group/create',tokenVerif.verifyToken, chatController.createGroup)

router.get('/group',tokenVerif.verifyToken,chatController.getListGroup)


router.delete('/group/:id',chatController.deleteGroup);

router.post('/participant',chatController.joinGroup);

router.delete('/participant/:id',chatController.leaveGroup);


router.get('/messages/:id',chatController.getlistMessageByGroupId);

router.post('/message',chatController.sendMessageInGroup);

// router.get('/getbyname/:name',chatController.getbyname);

// router.put('/update/:id',chatController.update);



module.exports = router;