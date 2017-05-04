var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var advisoryService = new Schema({
    id: { type: String, hashKey: true },
    description: { type: String },
    numberStudents: { type: Number, default: 1 },
    numberHours: { type: Number, default: 2 },
    courses: { type: [String], default: [] },
    sessions: { type: [String], default: [] },
    cost: { type: Object }
});

module.exports = dynamoose.model('AdvisoryService', advisoryService);
