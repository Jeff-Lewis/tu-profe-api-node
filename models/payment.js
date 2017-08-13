var dynamoose = require('dynamoose'),
Schema = dynamoose.Schema;

var paymentSchema = new Schema({
id: { type: String, hashKey: true }
});

module.exports = dynamoose.model('Payment', paymentSchema);
