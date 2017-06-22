var Consumer = require('sqs-consumer');
var Promise = require('promise');

var TeacheState = require('../models/enum/teacherState');
var AdvisoryServiceState = require('../models/enum/advisoryServiceState');

var config = require('../config');
var TeacherServices = require('../services/teacher');
var NotificationServices = require('../services/notification');
var AdvisoryServiceServices = require('../services/advisoryService');

var AssignService = {};

AssignService.validate = request => {
    return Promise.all([
            AdvisoryServiceServices.getAdvisoryServiceById(request.advisoryServiceId),
            TeacherServices.getTeacherById(request.teacherId)
        ])
            .then(values => {
                var advisoryService = values[0];
                var teacher = values[1];
    
                var teacherHasCourse = !teacher.courses.some(course => {
                    return course === advisoryService.course.id
                });
    
                if (teacherHasCourse) {
                    return Promise.reject('El profesor no dicta esta materia.')
                } else if (teacher.state !== TeacheState.ACTIVE.value) {
                    return Promise.reject('El profesor esta inactivo');
                } else if (advisoryService.state !== AdvisoryServiceState.AVAILABLE.value){
                    return Promise.reject('La asesoria no esta disponible');
                }
                
                request.teacher = teacher;
                request.advisoryService = advisoryService;
                
                return Promise.resolve(request);

            });
};

AssignService.assign = request => {
    request.advisoryService.state = AdvisoryServiceState.IN_PROCESS.value;
    request.advisoryService.teacher = {
        name: `${request.teacher.name} ${request.teacher.lastName}`,
        id: request.teacher.id
    };
    
    request.teacher.advisoryServices.push(request.advisoryService.id);
    
    return Promise.all([            
            AdvisoryServiceServices.updateAdvisoryService(request.advisoryService.id, request.advisoryService),
            TeacherServices.updateTeacher(request.teacher.id, request.teacher)
        ]);
};

AssignService.notify = (request, values, err) => {
    var notification = {};
    if(err) {
        console.log(`ERROR: ${err}`);
        notification.title = "Servicio NO Asignado";
        notification.text = `Lo sentimos, el servicio con ID: ${request.advisoryService.id} no ha podido ser asignado, motivo: ${err}`;
        notification.type = 1;
        notification.userId = request.teacher.id;
    } else {
        console.log(`SUCCESS`);
        notification.title = "Servicio Asignado";
        notification.text = "Felicitaciones, el servicio con ID: ${request.advisoryService.id} le ha sido asignado.";
        notification.type = 2;
        notification.userId = request.teacher.id;
    }
    
    return NotificationServices.createNotification(notification);
};

var app = Consumer.create({
    queueUrl: config.queues.assignAdvisoryService,
    batchSize: 10,
    handleMessage: (message, done) => {

        return new Promise((resolve, reject)=>{
            var request = JSON.parse(message.Body);
            console.log('--------------------------------------------------');
            console.log('Start Process');
            console.log(`Id: ${request.id} - teacherId: ${request.teacherId} - advisoryServiceId: ${request.advisoryServiceId}`);
            
            return AssignService.validate(request)
                .then(request => AssignService.assign(request))
                .then(values => AssignService.notify(request, values, null))
                .then(()=>{
                    done();
                    resolve();
                })
                .catch(err => {
                    AssignService.notify(request, null, err)
                    done();
                    reject();
                });
                        
        });

    }
});

app.on('error', function(err) {
    console.log(err);
});

app.start();
