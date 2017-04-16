var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var trainingSchema = new Schema({
    id: { type: String, hashKey: true },
    passLimit: { type: Number },
    type: { type: String },
    questions: { type: [Object], default: [] }
});

module.exports = dynamoose.model('Training', trainingSchema);
