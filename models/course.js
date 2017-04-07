var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var courseSchema = new Schema({
    id: {
        type: String,
        hashKey: true
    },
    name: {
        type: Number
    }
});

module.exports = dynamoose.model('Course', courseSchema);
