const Chat = require("../../Shema/Chat.js"); 
const User = require('../../Shema/User.js')
// l'agent peux ajouter des question reponse 
async function createNewChat(req, res) {
  try {
      const user = req.user;
      let chat = req.body;
      chat.owner = user.email;

      if (chat.type) {
          chat.type = chat.type.toLowerCase() === 'single' ? 'Single' : 'Group';
      } else {
          chat.type = 'Group';
      }

      let participantsById = [];
      for (const p of chat.participants) {
          if (p) {
              const u = await User.findOne({ email: p });
              if (u) {
                  participantsById.push(u._id);
              } else {
                  console.log(`User not found for email: ${p}`);
              }
          }
      }
      participantsById.push(user._id);

      chat.participants = participantsById;

      const c = await Chat.create(chat);
      res.status(200).json(c);
  } catch (e) {
      console.log(e.message);
      res.status(400).json({ error: e.message });
  }
}

async function toggleSelected(chat,chats) {
  try {
      const ch = chats.find((c) => c.selected);
      if(ch){
          ch.selected = false;
          await Chat.findByIdAndUpdate(ch._id, ch);
      }

      chat.selected = true;
      await Chat.findByIdAndUpdate(chat._id, chat);
  }catch (e){
      console.log("ToggleSelected has an error :  ",e.message);
  }

}

async function getUserChats(req, res) {
  try {
      const user = req.user;
      const allChats = await Chat.find().populate('participants', 'avatar email').populate('messages.sender', 'avatar email');
      const chats = allChats.filter(chat => chat.participants.some(participant => participant.equals(user._id)));
      chats.sort((a, b) => {
          if (a.messages.length !== 0 && b.messages.length !== 0) {
              const lastMessageA = a.messages[a.messages.length - 1];
              const lastMessageB = b.messages[b.messages.length - 1];
              return new Date(lastMessageB.timestamp) - new Date(lastMessageA.timestamp);
          } else {
              return false;
          }
      });
      res.status(200).json(chats);
  } catch (e) {
      res.status(400).json({ error: e.message });
  }
}


async function sendMessage (io,data){
  try{
      const {message,chat,senderEmail,timestamp,avatar}=data;
      const user = await User.findOne({email:senderEmail});
      const chatToUpdate = await Chat.findById(chat);
      const sender = user._id;
      const newMessage = {
          message : message,
          sender:sender,
          senderEmail:senderEmail,
          timestamp:timestamp,
          avatar: avatar,
      }
      chatToUpdate.messages.push(newMessage);
      chatToUpdate.selected = true;
      await Chat.findByIdAndUpdate(chat,chatToUpdate);
      const final = await Chat.findById(chat);
      io.emit('received',final);
  } catch (err){
      console.log('error:',err.message)
  }
}
async function test (io){
  try{
      io.emit('sent','Hello again!')
  } catch (err){
      console.log('error:',err.message)
  }
}


// ====================================================================================
//  ===================================== CRUD =======================================
// ====================================================================================

async function add (req,res){
  try{
  const chat= new Chat(req.body)
  await chat.save();
  res.status(200).send("Add");
  } catch (err){
      res.status(400).json({error:err})
  }
}

async function getall(req, res) {
  try {
      const chats = await Chat.find().populate('participants', 'avatar email').populate('messages.sender', 'avatar email');
      res.status(200).json(chats);
  } catch (error) {
      console.error('Error fetching chats:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getbyid (req,res){
  try{
      const data = await Chat.findById(req.params.id)
      res.status(200).send(data)


  }catch(err){
      res.status(400).json({error:err});


  }

}

async function getbyname (req,res){
  try{
      let name=req.params.nameClass
      //toujours avec {} pour connaitre les parametres seulement l id le connait
      const data = await Chat.findOne({name});
      res.status(200).send(data)


  }catch(err){
      res.status(400).json({error:err});


  }

}


async function update (req,res){
  try{
      await Chat.findByIdAndUpdate(req.params.id,req.body)
      res.status(200).send('updated')

  }catch(err){
      res.status(400).json({error:err});


  }

}

async function deletechat (req,res){
  try{
      await Chat.findByIdAndDelete(req.params.id)
      res.status(200).send('deleted')

  }catch(err){
      res.status(400).json({error:err});


  }

}

module.exports={add,getall,getbyid,getbyname,update,deletechat,test,createNewChat,getUserChats,sendMessage}