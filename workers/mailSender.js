var Consumer = require('sqs-consumer');
var Promise = require('promise');

var TeacheState = require('../models/enum/teacherState');
var AdvisoryServiceState = require('../models/enum/advisoryServiceState');

var config = require('../config');
var TeacherServices = require('../services/teacher');
var NotificationServices = require('../services/notification');
var AdvisoryServiceServices = require('../services/advisoryService');

var app = Consumer.create({
    queueUrl: config.queues.mailQueue,
    batchSize: 1,
    attributeNames: ['All'],
    messageAttributeNames: ['MailType'],
    handleMessage: (message, done) => {

        var request = JSON.parse(message.Body);
        console.log('--------------------------------------------------');
        console.log(`Start Process : ${new Date()}`);
        console.log(JSON.stringify(message));

        done();

    }
});

app.on('error', function (err) {
    console.log('here');
    console.log(err);
});

app.start();
