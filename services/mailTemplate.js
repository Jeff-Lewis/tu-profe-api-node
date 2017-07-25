var Promise = require('promise');

var MailTemplate = require('../models/mailTemplate');

var MailTemplateServices = {};

MailTemplateServices.getMailTemplateById = mailTemplateId => {
     return new Promise((resolve, reject) => {
        MailTemplate.get({ id: mailTemplateId }, (err, mailTemplate) => {
            if (err || mailTemplate === undefined) { reject('MailTemplate not found'); }
            else {
                resolve(mailTemplate);
            }
        });
    });
};

module.exports = MailTemplateServices;