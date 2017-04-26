var express = require('express');

var AdvisoryServiceServices = require('../services/advisoryService');

var routes = AdvisoryService => {
    var advisoryServiceRouter = express.Router();

    advisoryServiceRouter.route('/')
        .post((req, res) => {
            var advisoryService = req.body;            
            AdvisoryServiceServices.createAdvisoryService(advisoryService)
                .then(advisoryService => {
                    res.status(200).send(advisoryService);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

    advisoryServiceRouter.route('/calculate')
        .post((req, res) => {
            var advisoryService = req.body;            
            AdvisoryServiceServices.calculate(advisoryService)
                .then(advisoryService => {
                    res.status(200).send(advisoryService);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

    return advisoryServiceRouter;
};

module.exports = routes;