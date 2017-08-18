var express = require('express');

var LogService = require("../services/log")();
var AdvisorySessionServices = require('../services/advisorySession');

var routes = () => {
    var advisorySessionRouter = express.Router();

    advisorySessionRouter.route('/:advisoryServiceId/:sessionId')
        .put((req, res) => {
            AdvisorySessionServices.updateAdvisorySession(req.params.advisoryServiceId, req.params.sessionId, req.body)
                .then(response => {
                    LogService.log('AdvisorySessionRouter', 'updateAdvisoryService', 'info', 'info');
                    res.status(200).send();
                })
                .catch(err => {
                    console.log(err);
                    LogService.log('AdvisorySessionRouter', 'updateAdvisoryService', 'error', 'err', { err: err });
                    res.status(500).send(err);
                });
        });

    return advisorySessionRouter;
};

module.exports = routes;