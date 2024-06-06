const Chat = require("../../Shema/Chat"); 
// l'agent peux ajouter des question reponse 
exports.addQA = async (req, res) => {
        const { question, reponse } = req.body;
        try {
          const newChat = new Chat({ question, reponse });
          await newChat.save();
          res.status(201).json({ message: 'Q&A added successfully', data: newChat });
        } catch (error) {
          res.status(500).json({ message: 'Error adding Q&A', error: error.message });
        }
      };
      // la chatbot de partie client 
 

      exports.getAnswer = async (req, res) => {
        const { question } = req.body;
      
        console.log('Received question:', question); // Log the received question
      
        try {
          const qa = await Chat.findOne({ question: new RegExp(question, 'i') });
      
          if (qa) {
            console.log('Found answer:', qa.reponse); // Log the found answer
            res.json({ response: qa.reponse });
          } else {
            console.log('No answer found for the question'); // Log if no answer is found
            res.json({ response: "Sorry, I don't know the answer to that question." });
          }
        } catch (error) {
          console.error('Error retrieving answer:', error.message); // Log the error
          res.status(500).json({ message: 'Error retrieving answer', error: error.message });
        }
      };