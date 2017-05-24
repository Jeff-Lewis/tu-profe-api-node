var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var courseSchema = new Schema({
    id: { type: String, hashKey: true },
    courseName: { type: String },
    difficulty: { type: String }
});

module.exports = dynamoose.model('Course', courseSchema);
