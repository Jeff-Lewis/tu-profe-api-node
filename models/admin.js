var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var adminSchema = new Schema({
    //Account Data
    id: { type: String, hashKey: true },
    email: String,
    name: { type: String },
    lastName: { type: String },
    identification: { type: String },

    //
    active: { type: Boolean, default: false }
});

module.exports = dynamoose.model('Admin', adminSchema);
