var sendgrid = require('sendgrid');
var Promise = require('promise');

var SendGridServices = {};

SendGridServices.sendTemplateMail = (to, subject, templateId) => {

    return new Promise((resolve, reject) => {
        var helper = sendgrid.mail;
        
        var email = new sendgrid.Email({
            from: 'diego.prieto.torres@hotmail.com',
            to: to,
            html: '<p></p>',
            subject: subject
        });

        email.addSubstitution('%name%', 'John');

        email.addFilter('templates', 'enable', 1);
        email.addFilter('templates', 'template_id', templateId);

        confirm.log('here');

        sendgrid.send(email, (err, response) => {
            if (err) {
                console.log(err);
                resolve(err);
            } else {
                console.log('Yay! Our templated email has been sent');
                resolve(response);
            }
        })
    });
};

module.exports = SendGridServices;