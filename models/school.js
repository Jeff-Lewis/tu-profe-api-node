var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var schoolSchema = new Schema({
    id: {
        type: String,
        hashKey: true
    },
    address: {
        type: String
    },
    name: {
        type: String
    },
    type: {
        type: Number
    }
});

module.exports = dynamoose.model('School', schoolSchema);
