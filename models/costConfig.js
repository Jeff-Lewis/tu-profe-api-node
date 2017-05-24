var dynamoose = require('dynamoose'),
    Schema = dynamoose.Schema;

var costConfigSchema = new Schema({
    id: { type: String, hashKey: true },
    advisoryServiceType: { type: Number },
    courseType: { type: String },
    greaterThanLimit: { type: Number },
    numStudents: { type: Number },
    config: { 
        type: 'Map',
        map:{
            A:Number,
            L:Number,
            M:Number
        }
    },
});

module.exports = dynamoose.model('CostConfig', costConfigSchema);
