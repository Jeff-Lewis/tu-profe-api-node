var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var advisoryService = new Schema({
    //General
    id: { type: String, hashKey: true },
    studentId: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    description: { type: String },
    numStudents: { type: Number, default: 1 },
    startDate: { type: Date, default: 1 },
    numberHours: { type: Number, default: 2 },
    courses: { type: [String], default: [] },
    sessions: { type: [Object], default: [] },
    cost: { type: Object },

    //Tutor 
    months: { type: Number, default: 1 },
    sessionsPerWeek: { type: Number, default: 1 }
});

module.exports = dynamoose.model('AdvisoryService', advisoryService);
