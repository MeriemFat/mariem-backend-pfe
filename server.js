const path = require('path');
const express = require('express');
const { json } = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');
const connectDB = require('../Backend/config/db.js');
const userRouter = require("./api/routes/UserRoute.js");
//const agentRoute = require('../Backend/api/routes/AgentRoute.js');
const contratRoute = require("./api/routes/contratRoute.js"); 
//const sinistreRoute = require("./api/routes/SinistreRoute.js");
//const quittanceRoute = require("./api/routes/QuittanceRoute.js"); 
//const demandeRoute = require("./api/routes/DemandeRoute.js"); 
const colors = require('colors'); 
dotenv.config();

// Invoke connectDB
connectDB();

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// Mount routes to respective imports

app.use("/api/User", userRouter);

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
// test get route
app.get('/', (req, res) => {
    res.send('API is running...');
});
 
//_________________________________________________Contrat___________________________________________________________//
app.use('/api/contrat', contratRoute); 
//_____________________________________________Sinistre______________________________________________________________//
//app.use('/api/sinistres', sinistreRoute); 
//_____________________________________________Quittance___________________________________________________________//
//app.use('/api/quittance', quittanceRoute); 
//_____________________________________Demande__________________________//
//app.use('/api/demande',demandeRoute); 
// Error middleware for 404
app.use(notFound);

// Error handler middleware
app.use(errorHandler);

// Set port number
const PORT = process.env.PORT || 4000;

app.listen(
	PORT,
	console.log(
		colors.yellow.bold(`Server running on port ${PORT}`)
	)
);
