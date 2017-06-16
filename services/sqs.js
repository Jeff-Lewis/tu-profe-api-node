var aws = require('aws-sdk');
var Promise = require('promise');

var sqs = new aws.SQS();
var SQS = {};

SQS.sendMessage = (queue, message, messageGroupId) => {
    return new Promise((resolve, reject) => {
        var params = {
            MessageBody: message,
            QueueUrl: queue,
            MessageGroupId: messageGroupId
        };
        sqs.sendMessage(params, function(err, data) {
            if (err) {
                reject(err);
            }
            else resolve(data);
        });
    });
};

module.exports = SQS;
