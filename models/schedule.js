var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var scheduleSchema = new Schema({
    id: { type: String, hashKey: true },
    days: { type: [Object] }
});

module.exports = dynamoose.model('Schedule', scheduleSchema);
