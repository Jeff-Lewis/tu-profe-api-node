var express = require('express');

var AdvisorySessionServices = require('../services/advisorySession');

var routes = AdvisorySession => {
    var advisorySessionRouter = express.Router();

    advisorySessionRouter.route('/:advisoryServiceId/:sessionId')
        .put((req, res) => {
            AdvisorySessionServices.updateAdvisorySession(req.params.advisoryServiceId, req.params.sessionId, req.body)
                .then(response => res.status(200).send(response))
                .catch(err => res.status(500).send(err));
        });

    return advisorySessionRouter;
};

module.exports = routes;