var SessionState = require('../models/enum/sessionState');

var AdvisoryServiceState = require('../models/enum/advisoryServiceState');

var LogService = require("../services/log")();
var TeacherService = require('../services/teacher');
var AdvisoryServiceServices = require('../services/advisoryService');

var AdvisorySessionServices = {};

AdvisorySessionServices.updateAdvisorySession = (advisoryServiceId, sessionId, sessionUpdated) => {
    return AdvisoryServiceServices.getAdvisoryServiceById(advisoryServiceId)
        .then(advisoryService => {
            var session = advisoryService.sessions.find(session => session.id === sessionId);
            var index = advisoryService.sessions.indexOf(session);

            if (session.state === SessionState.FINISHED.value || session.state === SessionState.CANCELED.value) {
                return Promise.reject('La sesion esta terminada o cancelada y no puede ser editada');
            } else if (sessionUpdated.state === SessionState.IN_PROCESS.value) {
                session.inProgressTime = new Date();
                session.teacher = advisoryService.teacher;
                LogService.log('AdvisorySession', 'updateAdvisorySession', `Advisory Service ${advisoryServiceId} Session ${session.id} IN_PROCESS`, 'info', {});
            } else if (sessionUpdated.state === SessionState.FINISHED.value) {
                session.finishedTime = new Date();
                session.realDuration = session.finishedTime - new Date(session.inProgressTime);
                LogService.log('AdvisorySession', 'updateAdvisorySession', `Advisory Service ${advisoryServiceId} Session ${session.id} FINISHED`, 'info', {});
            }

            session.state = sessionUpdated.state;
            advisoryService.sessions[index] = session;
            
            if (advisoryService.sessions.every(session => session.state === SessionState.FINISHED.value)) {
                advisoryService.state = AdvisoryServiceState.FINISHED.value;
                TeacherService.getTeacherById(advisoryService.teacher)
                    .then(teacher => {                        
                        teacher.advisoryServices = teacher.advisoryServices.filter(advisory => advisory !== advisoryServiceId);
                        TeacherService.updateTeacher(teacher.id, teacher);
                    })
                    .catch(err => LogService.log('AdvisorySession', 'updateAdvisorySession', 'error', 'err', err));
                LogService.log('AdvisorySession', 'updateAdvisorySession', `Advisory Service ${advisoryServiceId} FINISHED`, 'info', {});
            }

            return AdvisoryServiceServices.updateAdvisoryService(advisoryService.id, advisoryService);
        });
};

module.exports = AdvisorySessionServices;
