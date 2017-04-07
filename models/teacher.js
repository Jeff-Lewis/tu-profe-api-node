var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var teacherSchema = new Schema({
    id: {
        type: String,
        hashKey: true
    },
    state: Number,
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

    interview: String,
    
    //Exam Information
    exam: {
        type:'Map',
        map:{
            wrongAnswers: {type:String}
        }
    },
    
    //Bank Information
    bankAccount:{
        type:'Map',
        map:{
            holderIdentification: String,
            holderName: String,
            number: String,
            type: String,
            bank: String
        }
    }

});

module.exports = dynamoose.model('Teacher', teacherSchema);
