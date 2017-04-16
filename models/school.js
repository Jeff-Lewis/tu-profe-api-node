var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var schoolSchema = new Schema({
    id: { type: String, hashKey: true },
    address: { type: String },
    name: { type: String },
    type: { type: Number },
    city: { type: String },
    country: { type: String },
    countryCode: { type: String },
    zipcode: { type: String },
    formattedAddress: { type: String },
    latitude: { type: Number },
    longitude: { type: Number }
});

module.exports = dynamoose.model('School', schoolSchema);
