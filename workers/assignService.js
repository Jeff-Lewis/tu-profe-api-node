var Consumer = require('sqs-consumer');
var Promise = require('promise');
var moment = require('moment');

var TeacheState = require('../models/enum/teacherState');
var AdvisoryServiceState = require('../models/enum/advisoryServiceState');

var config = require('../config');
var TeacherServices = require('../services/teacher');
var NotificationServices = require('../services/notification');
var AdvisoryServiceServices = require('../services/advisoryService');
var LogService = require("../services/log")(process.env.LOG_ENTRIES_WORKER_ASSIGN_SERVICE_TOKEN);

var AssignService = {};

/**
 * Validate if it's possible make the assignment
 */
AssignService.validate = request => {
    request.date = new Date();
    return Promise.all([
        AdvisoryServiceServices.getAdvisoryServiceById(request.advisoryServiceId),
        TeacherServices.getTeacherById(request.teacherId)
    ])
        .then(values => {
            var advisoryService = values[0];
            var teacher = values[1];
            console.log(advisoryService.files);
            var teacherNoHasCourse = !teacher.courses.some(course => {
                return course === advisoryService.course.id
            });

            if (teacherNoHasCourse) {
                return Promise.reject('El profesor no dicta esta materia.')
            } else if (teacher.state !== TeacheState.ACTIVE.value) {
                return Promise.reject('El profesor esta inactivo');
            } else if (advisoryService.state !== AdvisoryServiceState.AVAILABLE.value) {
                return Promise.reject('La asesoria no esta disponible');
            }

            request.teacher = teacher;
            request.advisoryService = advisoryService;

            return Promise.resolve(request);

        });
};

/**
 * Assign the advisory to the teacher and change the advisory state.
 */
AssignService.assign = request => {
    request.advisoryService.state = AdvisoryServiceState.IN_PROCESS.value;
    request.advisoryService.teacher = request.teacher.id;

    request.teacher.advisoryServices.push(request.advisoryService.id);
    
    return Promise.all([
        AdvisoryServiceServices.updateAdvisoryService(request.advisoryService.id, request.advisoryService),
        TeacherServices.updateTeacher(request.teacher.id, request.teacher)
    ]);
};

/**
 * Notify to:
 *  -   Teacher
 *  -   Student
 */
AssignService.notify = (request, values, err) => {
    request.dateToShow = moment(request.date).format('MMMM Do YYYY, h:mm:ss a');
    var notification = {};
    if (err) {
        console.log(`ERROR: ${err}`);
        notification.title = 'Servicio NO Asignado';
        notification.text = `La solicitud de asignación con ID: ${request.id} fue procesada a las ${request.dateToShow} y ha sido denegada, el motivo fue: ${err}. Si usted considera que es un error y debe ser revisado, por favor contacte con la oficina.`;
        notification.type = 1;
        notification.userId = request.teacherId;
    } else {
        console.log(`SUCCESS`);
        notification.title = 'Servicio Asignado';
        notification.text = `Felicitaciones, el servicio con ID: ${request.advisoryServiceId} le ha sido asignado.`;
        notification.type = 2;
        notification.userId = request.teacherId;
    }

    return NotificationServices.createNotification(notification);
};

var app = Consumer.create({
    queueUrl: config.queues.assignAdvisoryService,
    batchSize: 1,
    handleMessage: async (message, done) => {

        message.Body = JSON.parse(message.Body);
        var updatedObjects;
        var request = message.Body;
        console.log('--------------------------------------------------');
        console.log(`Start Process : ${new Date()}`);
        console.log(`Id: ${request.id} - teacherId: ${request.teacherId} - advisoryServiceId: ${request.advisoryServiceId}`);
        LogService.log("assignService","assign","Start Process", "info", message);

        try {
            request = await AssignService.validate(request);
            updatedObjects = await AssignService.assign(request);
            AssignService.notify(request, updatedObjects, null);
            LogService.log("assignService","assign","Success Process", "info", {teacherId:request.teacherId,advisoryServiceId:request.advisoryServiceId});
        } catch (err) {
            LogService.log("assignService","assign","Fail Process", "err", err);
            await AssignService.notify(request, null, err);
        } finally {
            console.log('--------------------------------------------------');
            return done();
        }
    }
});

app.on('error', function (err) {
    console.log(err);
});

app.start();
