var Consumer = require('sqs-consumer');
var Promise = require('promise');

var config = require('../config');
var MailTemplateServices = require('../services/mailTemplate');
var NodemailerServices = require('../services/nodemailer');
var UtilsServices = require('../services/utils');
var LogService = require("../services/log")(process.env.LOG_ENTRIES_WORKER_MAIL_SENDER_TOKEN);

var app = Consumer.create({
    queueUrl: config.queues.mailQueue,
    batchSize: 1,
    attributeNames: ['All'],
    messageAttributeNames: ['MailType', 'Mail'],
    handleMessage: (message, done) => {
        
        message.Body = JSON.parse(message.Body);
        var data = message.Body;
        console.log('--------------------------------------------------');
        console.log(`Start Process : ${new Date()}`);
        console.log(`MailType : ${message.MessageAttributes.MailType.StringValue}`);
        LogService.log("mailSender","send","Start Process", "info", message);

        Promise.all([
            UtilsServices.readFile(`${__dirname}/../mailTemplates/${message.MessageAttributes.MailType.StringValue}.html`),
            MailTemplateServices.getMailTemplateById(message.MessageAttributes.MailType.StringValue)
        ])
            .then(values => {
                var htmlContent = values[0];
                var mailTemplate = values[1];
                
                htmlContent = eval('`' + htmlContent + '`');

                var mailOptions = {
                    from: 'TuProfeNoReply <tu-profe-noreply@gmail.com>',
                    to: message.MessageAttributes.Mail.StringValue,
                    subject: mailTemplate.subject,
                    html: htmlContent
                };
                return NodemailerServices.sendMail(mailOptions);
            })
            .then(()=>LogService.log("mailSender","send","Finish Process Success", "info", {}))
            .catch(err => LogService.log("mailSender","send","Finish Process Error", "err", err));

        return //done();

    }
});

app.on('error', function (err) {
    console.log(err);
});

app.start();

