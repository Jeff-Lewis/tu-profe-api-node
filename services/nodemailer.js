var nodemailer = require('nodemailer');

var NodemailerServices = {};

NodemailerServices.sendMail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        var transporter = getTransporter();
        transporter.sendMail(mailOptions, function (error, info) {
            if (err) {
                reject(err);
            } else {
                resolve(info);
            }
        });
    });
};

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
    return transporter;
};

module.exports = NodemailerServices;