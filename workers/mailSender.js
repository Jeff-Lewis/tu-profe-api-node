var Consumer = require('sqs-consumer');
var Promise = require('promise');

var config = require('../config');

var app = Consumer.create({
    queueUrl: config.queues.mailQueue,
    batchSize: 1,
    attributeNames: ['All'],
    messageAttributeNames: ['MailType'],
    handleMessage: (message, done) => {

        var request = JSON.parse(message.Body);
        console.log('--------------------------------------------------');
        console.log(`Start Process : ${new Date()}`);

        console.log(message);
        console.log(request);

        return done();

    }
});

app.on('error', function (err) {
    console.log(err);
});

app.start();
