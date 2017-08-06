var Consumer = require('sqs-consumer');
var Promise = require('promise');

var config = require('../config');
var MailTemplateServices = require('../services/mailTemplate');
var NodemailerServices = require('../services/nodemailer');
var UtilsServices = require('../services/utils');

var app = Consumer.create({
    queueUrl: config.queues.mailQueue,
    batchSize: 1,
    attributeNames: ['All'],
    messageAttributeNames: ['MailType', 'Mail'],
    handleMessage: (message, done) => {

        var data = JSON.parse(message.Body);
        console.log('--------------------------------------------------');
        console.log(`Start Process : ${new Date()}`);

        Promise.all([
            UtilsServices.readFile(`${__dirname}/../mailTemplates/${message.MessageAttributes.MailType.StringValue}.html`),
            MailTemplateServices.getMailTemplateById(message.MessageAttributes.MailType.StringValue)
        ])
            .then(values => {
                htmlContent = values[0];
                mailTemplate = values[1];
                htmlContent = eval('`' + htmlContent + '`');

                var mailOptions = {
                    from: 'TuProfeNoReply <tu-profe-noreply@gmail.com>',
                    to: message.MessageAttributes.Mail.StringValue,
                    subject: mailTemplate.subject,
                    html: htmlContent
                };
                return NodemailerServices.sendMail(mailOptions);
            })
            .catch(err => console.log(err));

        return done();

    }
});

app.on('error', function (err) {
    console.log(err);
});

app.start();
