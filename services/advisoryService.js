var uuidV4 = require('uuid/v4');
var Promise = require('promise');

var AdvisoryServiceServices = {};

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