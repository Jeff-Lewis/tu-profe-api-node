var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var studentSchema = new Schema({
    //Account Data
    id: { type: String, hashKey: true },
    email: String,
    name: { type: String },
    lastname: { type: String },
    identification: String,

    // Personal Data
    cellPhone: String,
    phone: String,
    state: Number,
    city: String,
    neighborhood: String,
    address: String,
});

module.exports = dynamoose.model('Student', studentSchema);