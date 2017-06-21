var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var teacherSchema = new Schema({

    //Account Data
    id: { type: String, hashKey: true },
    email: String,
    password: String,
    name: String,
    lastName: String,
    identification: String,

    // Personal Data
    cellPhone: String,
    phone: String,
    state: Number,
    city: String,
    neighborhood: String,
    address: String,
    profileDescription: String,

    //Academical Data
    university: String,
    profession: String,
    semester: Number,
    gradeDate: Date,

    //Tu Profe Info
    interview: String,
    courses: { type: [String], default: [] },
    advisoryServices: { type: [String], default: []},

    //Financial Data
    bankAccount: {
        type: 'Map',
        map: {
            holderIdentification: String,
            holderName: String,
            number: String,
            type: String,
            bank: String
        }
    },

    //Exam Information
    exam: {
        type: 'Map',
        map: {
            wrongAnswers: { type: String }
        }
    },

    //Auxiliar Variables
    acceptGameRules: { type: Boolean, default: false },
    validData: { type: Boolean, default: false },
    cultureForm: { type: Boolean, default: false },

});

module.exports = dynamoose.model('Teacher', teacherSchema);
