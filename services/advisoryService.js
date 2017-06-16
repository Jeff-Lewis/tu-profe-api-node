var uuidV4 = require('uuid/v4');
var Promise = require('promise');
var moment = require('moment');
var config = require('../config');

var AdvisoryService = require('../models/advisoryService');
var AdvisoryServiceType = require('../models/enum/advisoryServiceType');
var AdvisoryServiceState = require('../models/enum/advisoryServiceState');
var SessionState = require('../models/enum/sessionState');
var TeacheState = require('../models/enum/teacherState');

var CostConfigServices = require('../services/costConfig');
var NotificationServices = require('../services/notification');
var UtilsServices = require('../services/utils');
var ScheduleServices = require('../services/schedule');
var TeacherService = require('../services/teacher');
var S3Services = require('../services/s3');
var SQSServices = require('../services/sqs');
var AdvisoryServiceServices = {};

/**
 * Create advisory Service
 */
AdvisoryServiceServices.createAdvisoryService = advisoryService => {
    return AdvisoryServiceServices.validate(advisoryService)
        .then(advisoryService => AdvisoryServiceServices.calculate(advisoryService))
        .then(advisoryService => {
            return new Promise((resolve, reject) => {
                advisoryService.status = AdvisoryServiceState.CREATED.value;
                advisoryService.id = uuidV4();
                advisoryService.paid = false;
                advisoryService.sessions = advisoryService.sessions.map((session, index) => {
                    var startTime = session.startTime.split(':');
                    var startDate = moment(session.startDate);
                    startDate.set({
                        hour: parseInt(startTime[0]),
                        minute: parseInt(startTime[1])
                    });

                    var endDate = moment(startDate);
                    endDate.add(session.duration, 'm');

                    return {
                        id: index + 1,
                        startDate: session.startDate,
                        startTime: session.startTime,
                        endTime: endDate.format('HH:mm'),
                        duration: session.duration,
                        dayOfWeek: new Date(session.startDate).getDay(),
                        state: SessionState.PENDING.value
                    };
                });
                AdvisoryService.create(advisoryService, function(err, newAdvisoryService) {
                    if (err) reject(err);
                    else {
                        AdvisoryServiceServices.sendNotification(newAdvisoryService);
                        resolve(newAdvisoryService);
                    }
                });
            });
        });
};

/**
 * Get Student By Id
 */
AdvisoryServiceServices.getAdvisoryServiceById = advisoryServiceId => {
    return new Promise((resolve, reject) => {
        AdvisoryService.get({
            id: advisoryServiceId
        }, (err, advisoryService) => {
            if (err || advisoryService === undefined) {
                reject('Advisory Service not found');
            }
            else {
                resolve(advisoryService);
            }
        });
    });
};

/**
 * Get multiple Advisry Services that match with the params
 */
AdvisoryServiceServices.filterByParams = params => {
    console.log(params);
    return new Promise((resolve, reject) => {
        AdvisoryService.scan(params, function(err, advisoryServices) {
            if (err) reject(err);
            else resolve(advisoryServices);
        });
    });
};

/**
 * Update advisory Service
 */
AdvisoryServiceServices.updateAdvisoryService = (advisoryServiceId, advisoryServiceUpdated) => {
    return AdvisoryServiceServices.getAdvisoryServiceById(advisoryServiceId)
        .then(advisoryService => {
            return new Promise((resolve, reject) => {
                advisoryService = new AdvisoryService(advisoryServiceUpdated);
                advisoryService.save(err => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(advisoryService)
                    }
                });
            });
        });
};

/**
 * Calculate advisory Service cost
 */
AdvisoryServiceServices.calculate = advisoryService => {
    return AdvisoryServiceServices.validate(advisoryService)
        .then(advisoryService => {
            return new Promise((resolve, reject) => {
                var cost = {};
                var h = 0;

                var costParams = {
                    advisoryServiceType: advisoryService.type,
                    numStudents: advisoryService.numStudents
                };

                var tutorFunction = (L, M, N, D, O, G, F, E, h) => {
                    return ((L * h + M + (N * h + O) * (advisoryService.numStudents - 1)) / D * h + E) / F * G * 4
                };

                var costFunction = (L, M, A, D, C, G, F, E, h) => {
                    return ((L * h + M + (A - C * (h - 8) / 2) / D) * 2 + E) / F * G / 2;
                };

                if (advisoryService.type === 1) {
                    CostConfigServices.getCostConfigById('eb1f04cd-5991-4350-b050-4a435f516b47')
                        .then(costConfig => {
                            costConfig = costConfig.config;
                            costConfig.E = 600 * 1.19;
                            costConfig.F = 1 - 0.0299 * 1.19;
                            h = 2 * advisoryService.sessionsPerWeek;
                            cost.costPerMonth = tutorFunction(costConfig.L, costConfig.M, costConfig.N, costConfig.D, costConfig.O, costConfig.G, costConfig.F, costConfig.E, h)
                            cost.costPerMonth = UtilsServices.ceil10(cost.costPerMonth, 2);
                            cost.total = cost.costPerMonth * advisoryService.months;

                            advisoryService.cost = cost;
                            resolve(advisoryService);
                        });
                }
                else if (advisoryService.type === 2) {
                    h = advisoryService.timePerSession * advisoryService.numSessions;
                    costParams.courseType = advisoryService.course.difficulty;
                    if (advisoryService.course.difficulty === 'Regular') {
                        if (h < 8) {
                            costParams.greaterThanLimit = 0;
                        }
                        else {
                            costParams.greaterThanLimit = 1;
                        }
                    }
                    else if (advisoryService.course.difficulty === 'Especializado') {
                        if (h < 8) {
                            costParams.greaterThanLimit = 0;
                        }
                        else {
                            costParams.greaterThanLimit = 1;
                        }
                    }

                    CostConfigServices.getCostConfig(costParams.advisoryServiceType, costParams.courseType, costParams.greaterThanLimit, costParams.numStudents)
                        .then(costConfig => {
                            costConfig = costConfig.config;
                            costConfig.E = 600 * 1.19;
                            costConfig.F = 1 - 0.0299 * 1.19;

                            cost.costPerHour = costFunction(costConfig.L, costConfig.M, costConfig.A, costConfig.D, costConfig.C, costConfig.G, costConfig.F, costConfig.E, h)
                            cost.costPerHour = UtilsServices.ceil10(cost.costPerHour, 2);
                            cost.total = cost.costPerHour * h;

                            advisoryService.cost = cost;
                            resolve(advisoryService);
                        });
                }
                else {
                    reject('No es posible calcular el valor a este tipo de servicio.');
                }

            });
        });
};

/**
 * Validate the data into advisory service.
 */
AdvisoryServiceServices.validate = advisoryService => {
    return new Promise((resolve, reject) => {
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!advisoryService.description) {
            reject('La descripción no puede estar vacia.');
        }
        else if (advisoryService.sessions.length <= 0) {
            reject('Las sesiones no pueden estar vacias.');
        }

        advisoryService.sessions.forEach((session, index) => {
            var startTime = session.startTime.split(':');
            if (new Date(session.startDate) < today) {
                reject('La fecha de inicio de una sesión no puede ser menor a hoy');
            }
            else if (!(6 <= parseInt(startTime[0]) && parseInt(startTime[0]) <= 20)) {
                reject(`La hora de inicio de la sesión ${index + 1} no se encuentra en los rangos permitidos`);
            }
        });

        if (advisoryService.type === AdvisoryServiceType.TUTOR.value) {
            if (!(1 <= advisoryService.months && advisoryService.months <= 12)) {
                reject('La cantidad de meses debe estar entre 1 y 12.');
            }
            else if (!(2 <= advisoryService.sessionsPerWeek && advisoryService.sessionsPerWeek <= 5)) {
                reject('La cantidad de sesiones por semana debe estar entre 2 y 5.');
            }
            else if (new Date(advisoryService.startDate) < today) {
                reject('La fecha de inicio del servicio no puede ser menor a hoy');
            }
        }
        else if (advisoryService.type === AdvisoryServiceType.SPECIFIC_TOPIC.value) {
            if (advisoryService.course === undefined) {
                reject('Un servicio especializado debe tener por lo menos una materia asignada.');
            }
        }
        else {
            reject('Tipo de servicio no definido.');
        }

        resolve(advisoryService);
    });
};

AdvisoryServiceServices.getAllByStudentId = studentId => {
    return new Promise((resolve, reject) => {
        AdvisoryService.scan('studentId').eq(studentId).exec((err, services) => {
            if (err) reject(err);
            else {
                resolve(services);
            }
        });
    });
};

AdvisoryServiceServices.sendNotification = (advisoryService) => {
    var notification = {
        title: "Servicio Creado",
        text: "Su servicio ha sido creado con éxito",
        type: 2,
        userId: advisoryService.studentId
    };
    NotificationServices.createNotification(notification);
};

AdvisoryServiceServices.uploadFile = (advisoryServiceId, file) => {
    var bucketName = 'tu-profe/advisory-services/' + advisoryServiceId;
    var key = uuidV4() + '.' + file.originalname.split('.').pop();

    return AdvisoryServiceServices.getAdvisoryServiceById(advisoryServiceId)
        .then(advisoryService => {
            advisoryService.totalFilesSize += file.size;
            if (advisoryService.totalFilesSize > 25000000) {
                return Promise.reject('El limite de tamaño de archivos ha sido excedido.');
            }
            else {
                S3Services.uploadFile(bucketName, key, file);
                return Promise.resolve(advisoryService);
            }
        })
        .then(advisoryService => {
            AdvisoryServiceServices.updateAdvisoryService(advisoryServiceId, advisoryService)
        });
};

AdvisoryServiceServices.assign = (advisoryServiceId, teacherId) => {
    console.log(advisoryServiceId, teacherId);
    return Promise.all([
            AdvisoryServiceServices.getAdvisoryServiceById(advisoryServiceId),
            TeacherService.getTeacherById(teacherId)
        ])
        .then(values => {
            var advisoryService = values[0];
            var teacher = values[1];

            var teacherHasCourse = !teacher.courses.some(course => {
                return course === advisoryService.course.id
            });

            if (teacherHasCourse) {
                return Promise.reject('El profesor no dicta esta materia.')
            }
            else if (teacher.state !== TeacheState.ACTIVE.value) {
                return Promise.reject('El profesor esta inactivo');
            }

            var message = {
                teacherId: teacherId,
                advisoryServiceId: advisoryServiceId
            };

            return SQSServices.sendMessage(config.queues.assignAdvisoryService, JSON.stringify(message), 'Assign');
        });
};

AdvisoryServiceServices.matchTeacher = (advisoryServiceId, scheduleId) => {
    return Promise.all([
            AdvisoryServiceServices.getAdvisoryServiceById(advisoryServiceId),
            ScheduleServices.getScheduleById(scheduleId)
        ])
        .then(values => {
            var advisoryService = values[0];
            var schedule = values[1];
            var result = {};

            var sessions = advisoryService.sessions.map(session => {
                var sections = schedule.days.find(day => {
                    return day.day === session.dayOfWeek;
                }).sections;
                session.existsSchedule = sections.some(section => {
                    var startTime = parseInt(session.startTime.replace(':', ''));
                    var endTime = parseInt(session.endTime.replace(':', ''));
                    return startTime >= section.startTime && endTime <= section.endTime;
                });
                return session;
            });

            result.matchSessions = sessions.filter(session => {
                return session.existsSchedule;
            }).length;
            result.percentageMatchSessions = result.matchSessions / sessions.length;

            return Promise.resolve(result);

        });
};

module.exports = AdvisoryServiceServices;
