var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var advisoryService = new Schema({
    //General
    id: { type: String, hashKey: true },
    studentId: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    type: { type: Number, required: true },
    description: { type: String },
    numStudents: { type: Number, default: 1 },
    startDate: { type: Date, default: 1 },
    numberHours: { type: Number, default: 2 },
    courses: { type: [String], default: [] },
    sessions: { type: [Object], default: [] },
    cost: { type: Object },
    paid: { type: Boolean, required: true, default: false },

    //Tutor 
    months: { type: Number, default: 1 },
    sessionsPerWeek: { type: Number, default: 1 },

    //Special
    course: { type: Object },
    totalFilesSize: { type: Number, default: 0, validate: function (value) { return (value < 0 || value > 25000000) ? false : true } }
});

module.exports = dynamoose.model('AdvisoryService', advisoryService);
