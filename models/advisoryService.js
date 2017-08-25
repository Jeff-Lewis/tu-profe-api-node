var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var advisoryService = new Schema({
    //General
    id: { type: String, hashKey: true },
    state: { type: Number },
    studentId: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    type: { type: Number, required: true },
    description: { type: String },
    numStudents: { type: Number, default: 1 },
    startDate: { type: Date, default: 1 },
    numberHours: { type: Number, default: 2 },
    sessions: { type: [Object], default: [] },
    cost: { type: Object },
    paid: { type: Boolean, required: true, default: false },
    course: { type: Object },
    courseId: { type: String },
    teacher: { type: String },
    address: { type: String },
    city: { type: Object },
    geoInfo: { type: Object },

    //Tutor 
    months: { type: Number, default: 1 },
    sessionsPerWeek: { type: Number, default: 1 },

    //Special    
    totalFilesSize: { type: Number, default: 0, validate: function (value) { return (value < 0 || value > 25000000) ? false : true } },
    files: { type: [String], default: [] },
});

module.exports = dynamoose.model('AdvisoryService', advisoryService);
