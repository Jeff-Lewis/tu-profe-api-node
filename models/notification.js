var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var notificationSchema = new Schema({
    id: { type: String, hashKey: true },
    userId: { type: String, required: true },
    title: { type: String },
    text: { type: String },
    type: { type: Number },
    date: { type: Date, default: new Date() },
    read: { type: Boolean, default: false }
});

module.exports = dynamoose.model('Notification', notificationSchema);
