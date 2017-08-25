var SessionState = require('../models/enum/sessionState');

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
            } else if (sessionUpdated.state === SessionState.FINISHED.value) {
                session.finishedTime = new Date();
                session.realDuration = session.finishedTime - new Date(session.inProgressTime);                
            }

            session.state = sessionUpdated.state;
            advisoryService.sessions[index] = session;
            return AdvisoryServiceServices.updateAdvisoryService(advisoryService.id, advisoryService);
        });
};

module.exports = AdvisorySessionServices;
