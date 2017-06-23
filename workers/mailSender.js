var Consumer = require('sqs-consumer');
var Promise = require('promise');

var config = require('../config');
var SendGridServices = require('../services/sendGrid');

var app = Consumer.create({
    queueUrl: config.queues.mailQueue,
    batchSize: 1,
    attributeNames: ['All'],
    messageAttributeNames: ['MailType'],
    handleMessage: (message, done) => {

        var request = JSON.parse(message.Body);
        console.log('--------------------------------------------------');
        console.log(`Start Process : ${new Date()}`);

        SendGridServices.sendTemplateMail(request.name, request.email, '3f43307c-ead4-4e56-844f-f3dd85029000')
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            });

        return done();

    }
});

app.on('error', function (err) {
    console.log(err);
});

app.start();
