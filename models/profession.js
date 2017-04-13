var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var professionSchema = new Schema({
    id: { type: String, hashKey: true },    
    name: { type: String }
});

module.exports = dynamoose.model('Profession', professionSchema);
