var Promise = require('promise');

var CostConfig = require('../models/costConfig');

var CostConfigServices = {};

CostConfigServices.getCostConfig = (advisoryServiceType,courseType,greaterThanLimit,numStudents) => {
    return new Promise((resolve, reject) => {
        var params = {
            advisoryServiceType: {eq: advisoryServiceType},
            courseType: {eq: courseType},
            greaterThanLimit: {eq: greaterThanLimit},
            numStudents: {eq: numStudents},
        };
        console.log(params);
        CostConfig.scan(params, function (err, costConfig) {
            console.log(costConfig);
            if (err) reject(err);
            else if (costConfig.length <= 0) reject('Ninguna configuración de costos encontrada');
            else resolve(costConfig[0]);
        });
    });
};

module.exports = CostConfigServices;