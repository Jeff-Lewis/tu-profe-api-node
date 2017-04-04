var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var teacherSchema = new Schema({
    id: {
        type: String,
        hashKey: true
    },
    cellPhone: String,
    phone: String,
    email: String,
    password: String,
    name: String,
    lastName: String,
    identification: String,
    city: String,
    neighborhood: String,
    profileDescription: String,

    semester: Number,
    profession: String,
    gradeDate: Date,

    //acceptGameRules: Boolean,
    //cultureForm: Boolean,

    accountHolderIdentification: String,
    accountHolderName: String,
    accountNumber: String,
    accountType: String,
    bank: String,

    interview: String

});

module.exports = dynamoose.model('teacher', teacherSchema);
