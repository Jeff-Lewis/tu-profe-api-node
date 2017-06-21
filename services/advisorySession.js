var SessionState = require('../models/enum/sessionState');

var AdvisoryServiceServices = require('../services/advisoryService');

var AdvisorySessionServices = {};

AdvisorySessionServices.updateAdvisorySession = (advisoryServiceId, sessionId, sessionUpdated) => {
    return AdvisoryServiceServices.getAdvisoryServiceById(advisoryServiceId)
        .then(advisoryService => {
            var session = advisoryService.sessions.filter(session => {return session.id === sessionId;});
            var index = advisoryService.sessions.indexOf(session);

            if (session.state === SessionState.FINISHED.value || session.state === SessionState.CANCELED.value) {
                return Promise.reject('La sesion esta terminada o cancelada y no puede ser editada');
            } else if (sessionUpdated.state === SessionState.IN_PROCESS.value) {
                sessionUpdated.inProgressTime = new Date();
            } else if (sessionUpdated.state === SessionState.FINISHED.value) {
                sessionUpdated.finishedTime = new Date();
                sessionUpdated.realDuration = sessionUpdated.finishedTime - sessionUpdated.inProgressTime;
            }
            
            sessionUpdated.id = session.id;
            advisoryService.sessions[index] = sessionUpdated;
            return AdvisoryServiceServices.updateAdvisoryService(advisoryService.id,advisoryService);
        });
};

module.exports = AdvisorySessionServices;
