var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var interviewSchema = new Schema({
    id: {
        type: String,
        hashKey: true
    },
    startDateTime: {type: Number},
    capacity: {type: Number},
    duration: {type: Number},
    interviewed : {type:[String], default: []}
});

module.exports = dynamoose.model('Interview', interviewSchema);
