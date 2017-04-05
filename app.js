var express = require('express'),
    bodyParser = require('body-parser'),
    uuidV4 = require('uuid/v4'),
    dynamoose = require('dynamoose');

var School = require('./models/school'),
    Course = require('./models/course'),
    Teacher = require('./models/teacher');

var app = express();
var port = process.env.PORT || 8080;

dynamoose.AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

sessionRouter = require('./routes/session')(Teacher);
schoolRouter = require('./routes/school')(School);
courseRouter = require('./routes/course')(Course);
teacherRouter = require('./routes/teacher')(Teacher);

app.use('/api/session', sessionRouter);
app.use('/api/schools', schoolRouter);
app.use('/api/courses', courseRouter);
app.use('/api/teachers', teacherRouter);

app.listen(port, function () {
    console.log('App is running in port: ' + port);
});