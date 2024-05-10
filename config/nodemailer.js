const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "mail.takaful.tn",
    port: 465,
    secure: true,
    auth: {
        user: 'meriam.fathallah@takaful.tn', 
        pass: 'Pz833**06h20'
    },
});

module.exports = transporter