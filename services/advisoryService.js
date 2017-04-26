var uuidV4 = require('uuid/v4');
var Promise = require('promise');

var AdvisoryService = require('../models/advisoryService');
var AdvisoryServiceServices = {};

AdvisoryServiceServices.createAdvisoryService = advisoryService => {
    return AdvisoryServiceServices.calculate(advisoryService)
        .then(advisoryService => {
            return new Promise((resolve, reject) => {
                advisoryService.id = uuidV4();
                AdvisoryService.create(advisoryService, function (err, newAdvisoryService) {
                    if (err) reject(err);
                    else resolve(newAdvisoryService);
                });
            });
        });
};

AdvisoryServiceServices.calculate = advisoryService => {
    return new Promise((resolve, reject) => {
        var cost = advisoryService.numberStudents *
            advisoryService.numberHours *
            advisoryService.course.classification *
            10000;
        advisoryService.cost = {
            baseCost: cost
        };
        resolve(advisoryService);
    });
};

module.exports = AdvisoryServiceServices;