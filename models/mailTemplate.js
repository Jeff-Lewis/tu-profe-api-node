var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var mailTemplateSchema = new Schema({    
    id: { type: String, hashKey: true },
    subject: String,
    text: String
});

module.exports = dynamoose.model('MailTemplate', mailTemplateSchema);
