var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var courseSchema = new Schema({
    id: { type: String, hashKey: true },
    courseName: { type: String },
    classification: { type: String },
    area: { type: String }
});

module.exports = dynamoose.model('Course', courseSchema);
