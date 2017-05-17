var uuidV4 = require('uuid/v4');
var Promise = require('promise');

var AdvisoryService = require('../models/advisoryService');
var AdvisoryServiceType = require('../models/enum/advisoryServiceType');

var NotificationServices = require('../services/notification');
var UtilsServices = require('../services/utils');
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
                    else {
                        AdvisoryServiceServices.sendNotification(newAdvisoryService);
                        resolve(newAdvisoryService);
                    }
                });
            });
        });
};

/**
 * Calculate advisory Service cost
 */
AdvisoryServiceServices.calculate = advisoryService => {
    return new Promise((resolve, reject) => {
        
        var conf = {
            F:1-0.0299*1.19,
            G:1.06,
            E:600*1.19
        };
        
        var factor = (B,C,X)=>{
            console.log(B,C,X);
            return B-(C*(X-8)/2);
        };
        
        var epayCo = (V,X) => {
            return (V*X + conf.E)/conf.F*conf.G;
        };
        
        var specificSmallerThan8 = (A,X) => {
            return A*X;    
        };
        
        var specificOneStudent = (X,B,C,D) => {
            var V = factor(B,C,X)/D;
            console.log(V);
            return epayCo(V,X);
        };
        
        var specificMoreThanTwoStudents = (X,B,C,D,L,M) => {
            var V = ((L*X) + M - factor(B,C,X))/D;
            return epayCo(V,X);
        };
        
        var tutor = (L,X,M,N,O,P,D) => {
            var V = (L*X + M + (N*X + O)*(P - 1))/D; 
            return epayCo(V,X);
        };
        
        var total = 0;
        
        switch (advisoryService.type) {
            case 1:
                conf.L=-127.2;
                conf.M=4997.4;
                conf.N=-416.93;
                conf.O=5639.2;
                conf.D=0.8;
                var x = advisoryService.sessionsPerWeek * 2 * 4;
                total = tutor(conf.L,x,conf.M,conf.N,conf.O,advisoryService.numStudents,conf.D);
                break;
            case 2:
                var costFunction = specificMoreThanTwoStudents;
                var X = advisoryService.timePerSession * advisoryService.numSessions;
                switch (advisoryService.numStudents) {
                    case 1:
                        conf.A = 17490;
                        conf.B = 16366.2530739996;	
                        conf.C = 209.823757358969;	
                        conf.D = 0.7
                        costFunction = specificOneStudent;
                        break;
                    case 2:
                        conf.A = 25440;
                        break;
                    case 3:
                        conf.A = 33390;
                        break;
                    case 4:
                        conf.A = 41340;
                        break;
                    default:
                        reject('No es posible calcular un valor para este número de estudiantes.');
                        break;
                }
                if(X < 8){
                    total = specificSmallerThan8(conf.A, X);
                }else{
                    total = costFunction(X,conf.B,conf.C,conf.D,conf.L,conf.M);
                }
                break;
            default:
            reject('No es posible calcular el valor a este tipo de servicio.');
                break;
        }
        advisoryService.total=UtilsServices.ceil10(total,2);
        return resolve(advisoryService);
        
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

AdvisoryServiceServices.sendNotification = (advisoryService)=>{
    var notification = {
        title:"Servicio Creado",
        text:"Su servicio ha sido creado con éxito",
        type:2,
        userId:"2"
    };  
    NotificationServices.createNotification(notification);
};

module.exports = AdvisoryServiceServices;