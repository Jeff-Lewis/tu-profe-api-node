var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var courseSchema = new Schema({
    Placa: {
        type: String,
        hashKey: true
    },
    TurnOn: {
        type: Number
    }
});

module.exports = dynamoose.model('Auto', courseSchema);
