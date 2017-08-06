var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var citySchema = new Schema({
    id: { type: String, hashKey: true },
    name: { type: String }
});

module.exports = dynamoose.model('City', citySchema);
