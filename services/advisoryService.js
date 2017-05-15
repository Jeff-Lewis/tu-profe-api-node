var uuidV4 = require('uuid/v4');
var Promise = require('promise');

var AdvisoryService = require('../models/advisoryService');
var AdvisoryServiceType = require('../models/enum/advisoryServiceType');
var AdvisoryServiceServices = {};

/**
 * Create advisory Service
 */
AdvisoryServiceServices.createAdvisoryService = advisoryService => {
    return AdvisoryServiceServices.validate(advisoryService)
        .then(advisoryService => AdvisoryServiceServices.calculate(advisoryService))
        .then(advisoryService => {
            return new Promise((resolve, reject) => {
                advisoryService.id = uuidV4();
                advisoryService.sessions = advisoryService.sessions.map((session, index) => {
                    return {
                        id: index + 1,
                        startDate: session.startDate,
                        startTime: session.startTime,
                        duration: session.duration,
                        dayOfWeek: new Date(session.startDate).getDay()
                    };
                });
                AdvisoryService.create(advisoryService, function (err, newAdvisoryService) {
                    if (err) reject(err);
                    else resolve(newAdvisoryService);
                });
            });
        });
};

/**
 * Calculate advisory Service cost
 */
AdvisoryServiceServices.calculate = advisoryService => {
    return new Promise((resolve, reject) => {
        var cost = 0;
        advisoryService.cost = {
            baseCost: cost
        };
        resolve(advisoryService);
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
        } else if (advisoryService.sessions.length <= 0) {
            reject('Las sesiones no pueden estar vacias.');
        }

        advisoryService.sessions.forEach((session, index) => {
            var startTime = session.startTime.split(':');
            if (new Date(session.startDate) < today) {
                reject('La fecha de inicio de una sesión no puede ser menor a hoy');
            } else if (!(6 <= parseInt(startTime[0]) && parseInt(startTime[0]) <= 20)) {
                reject(`La hora de inicio de la sesión ${index + 1} no se encuentra en los rangos permitidos`);
            }
        });

        if (advisoryService.type === AdvisoryServiceType.TUTOR.value) {
            if (!(1 <= advisoryService.months && advisoryService.months <= 12)) {
                reject('La cantidad de meses debe estar entre 1 y 12.');
            } else if (!(2 <= advisoryService.sessionsPerWeek && advisoryService.sessionsPerWeek <= 5)) {
                reject('La cantidad de sesiones por semana debe estar entre 2 y 5.');
            } else if (new Date(advisoryService.startDate) < today) {
                reject('La fecha de inicio del servicio no puede ser menor a hoy');
            }
        } else if (advisoryService.type === AdvisoryServiceType.SPECIFIC_TOPIC.value) {

        } else {
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

module.exports = AdvisoryServiceServices;