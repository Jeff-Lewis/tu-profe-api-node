var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var advisoryService = new Schema({
    id: { type: String, hashKey: true },
    numberStudents: { type: Number, default: 1 },
    numberHours: { type: Number, default: 2 },
    course: { type: Object },
    cost: {type:Object}
});

module.exports = dynamoose.model('AdvisoryService', advisoryService);
