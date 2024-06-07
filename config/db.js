const mongoose = require('mongoose');

const connectDB = async () => {
    //const database = 'Attakafoulia';
   // const port = '27017';  // le port MongoDB par défaut

    try {
        await mongoose.connect(`mongodb+srv://menm4671:1234@cluster0.5vefyxj.mongodb.net/Attakafoulia?retryWrites=true&w=majority&appName=Cluster0`, {
        });
        console.log("Database connected successfully");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
