const fs = require('fs');
const path = require('path');
const express = require('express');
const { json } = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');
const connectDB = require('./config/db.js');
const userRouter = require("./api/routes/UserRoute.js");
const catalogueRoute = require ('./api/routes/catalogueRoute.js'); 
const contratRoute = require("./api/routes/contratRoute.js"); 
const produitRoute = require("./api/routes/produitRoute.js"); 
const sinistreRoute = require("./api/routes/SinistreRoute.js");
const quittanceRoute = require("./api/routes/QuittanceRoute.js"); 
const demandeRoute = require("./api/routes/DemandeRoute.js"); 
const chatRoute=require("./api/routes/ChatRoute.js"); 
const colors = require('colors'); 
dotenv.config();

connectDB();

const app = express();

app.use(morgan('dev'));
app.use(express.json());




app.use("/api/User", userRouter);

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.get('/', (req, res) => {
    res.send('API is running...');
});
 
app.use('/api/contrat', contratRoute); 
app.use('/api/demande',demandeRoute); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/categorie',catalogueRoute); 
app.use('/api/produit',produitRoute)
app.use('/api/sinistres', sinistreRoute); 
app.use('/api/quittance', quittanceRoute); 
app.use('/api/chat', chatRoute); 
app.get('/share', (req, res) => {
const client = req.query.Client;

const agent = req.query.Agent;


// Render an HTML response

res.send(`

<html>

<head>

<title>Client and Agent Info</title>

</head>

<body>

<h1>Client: ${client}</h1>

<h1>Agent: ${agent}</h1>

</body>

</html>

`);

});




app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5100;

app.listen(
	PORT,
	console.log(
		colors.yellow.bold(`Server running on port ${PORT}`)
	)
);



