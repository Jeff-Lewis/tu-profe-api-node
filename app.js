var express = require('express'),
    bodyParser = require('body-parser'),
    uuidV4 = require('uuid/v4'),
    dynamoose = require('dynamoose')
multer = require('multer');

var School = require('./models/school'),
    Course = require('./models/course'),
    Profession = require('./models/profession'),
    Teacher = require('./models/teacher'),
    Student = require('./models/student'),
    Interview = require('./models/interview'),
    Training = require('./models/training'),
    AdvisoryService = require('./models/advisoryService');    

var app = express();
var port = process.env.PORT || 8080;

dynamoose.AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

sessionRouter = require('./routes/session')(Teacher, Student);
schoolRouter = require('./routes/school')(School);
courseRouter = require('./routes/course')(Course);
professionRouter = require('./routes/profession')(Profession);
teacherRouter = require('./routes/teacher')(Teacher);
interviewRouter = require('./routes/interview')(Interview);
trainingRoute = require('./routes/training')(Training),
advisoryServiceRoute = require('./routes/advisoryService')(AdvisoryService);

app.use('/api/session', sessionRouter);
app.use('/api/schools', schoolRouter);
app.use('/api/courses', courseRouter);
app.use('/api/professions', professionRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/interviews', interviewRouter);
app.use('/api/trainings', trainingRoute);
app.use('/api/advisory-services', advisoryServiceRoute);

app.listen(port, function () {
    console.log('App is running in port: ' + port);
});