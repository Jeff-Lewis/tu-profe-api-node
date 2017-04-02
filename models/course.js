var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var courseSchema = new Schema({
    id: {
        type: String,
        hashKey: true
    },
    classification: {
        type: String
    },
    area: {
        type: String
    },
    courseName: {
        type: String
    }
});

module.exports = dynamoose.model('course', courseSchema);
