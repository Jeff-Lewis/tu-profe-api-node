var express = require('express'),
    bodyParser = require('body-parser'),
    uuidV4 = require('uuid/v4'),
    dynamoose = require('dynamoose'),
    multer = require('multer'),
    morgan = require('morgan'),
    jwt = require('jsonwebtoken');

var config = require('./config');

var School = require('./models/school'),
    Course = require('./models/course'),
    Profession = require('./models/profession'),
    Teacher = require('./models/teacher'),
    Schedule = require('./models/schedule'),
    Student = require('./models/student'),
    Student = require('./models/student'),
    Admin = require('./models/admin'),
    Interview = require('./models/interview'),
    Training = require('./models/training'),
    Notification = require('./models/notification'),
    AdvisoryService = require('./models/advisoryService'),
    City = require('./models/city');    

var app = express();
var port = process.env.PORT || 8080;

dynamoose.AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, access_token');
    next();
});

sessionRouter = require('./routes/session')(Teacher, Student, Admin);
schoolRouter = require('./routes/school')(School);
courseRouter = require('./routes/course')(Course);
professionRouter = require('./routes/profession')(Profession);
teacherRouter = require('./routes/teacher')(Teacher);
scheduleRouter = require('./routes/schedule')(Schedule);
studentRouter = require('./routes/student')(Student);
adminRouter = require('./routes/admin')(Admin);
interviewRouter = require('./routes/interview')(Interview);
notificationRoute = require('./routes/notification')(Notification);
trainingRoute = require('./routes/training')(Training);
advisoryServiceRoute = require('./routes/advisoryService')(AdvisoryService);
cityRoute = require('./routes/city')(City);

app.use('/api/session', sessionRouter);
app.use('/api/schools', schoolRouter);
app.use('/api/courses', courseRouter);
app.use('/api/professions', professionRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/schedules', scheduleRouter);
app.use('/api/students', studentRouter);
app.use('/api/admins', adminRouter);
app.use('/api/interviews', interviewRouter);
app.use('/api/trainings', trainingRoute);
app.use('/api/notifications', notificationRoute);
app.use('/api/advisory-services', advisoryServiceRoute);
app.use('/api/cities', cityRoute);

app.listen(port, function () {
    console.log('App is running in port: ' + port);
});