var express = require('express'),
    bodyParser = require('body-parser'),
    uuidV4 = require('uuid/v4'),
    dynamoose = require('dynamoose');

var School = require('./models/school'),
    Course = require('./models/course');

var app = express();
var port = process.env.PORT || 8080;

dynamoose.AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

schoolRouter = require('./routes/school')(School);
courseRouter = require('./routes/course')(Course);

app.use('/api/schools', schoolRouter);
app.use('/api/courses', courseRouter);

app.listen(port, function () {
    console.log('App is running in port: ' + port);
});