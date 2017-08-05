var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var studentSchema = new Schema({
    //Account Data
    id: { type: String, hashKey: true },
    email: String,
    password: String,
    name: { type: String },
    lastName: { type: String },
    identification: String,

    // Personal Data
    cellPhone: String,
    phone: String,
    state: Number,
    city: String,
    neighborhood: String,
    address: String,
    school: Object,
    profession: Object,
    academicalLevel: Number
});

module.exports = dynamoose.model('Student', studentSchema);
