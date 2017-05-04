var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var sessionServiceSchema = new Schema({
    id: { type: String, hashKey: true },
    advisoryService: { type: String },
    date: { type: Date },
    initTime: { type: String },
    duration: { type: Number },
    dayOfWeek: { type: Number }
});

module.exports = dynamoose.model('SessionService', sessionServiceSchema);
