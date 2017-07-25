var nodemailer = require('nodemailer');

var NodemailerServices = {};

var getTransporter = () => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
            user: 'diego.alfonso.prieto.torres@gmail.com',
            pass: process.env.TU_PROFE_GMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

module.exports = NodemailerServices;