var Promise = require('promise');

var CostConfig = require('../models/costConfig');

var CostConfigServices = {};

CostConfigServices.getCostConfigById = costConfigId => {
     return new Promise((resolve, reject) => {
        CostConfig.get({ id: costConfigId }, (err, costConfig) => {
            if (err || costConfig === undefined) { reject('CostConfig not found'); }
            else {
                resolve(costConfig);
            }
        });
    });
};

CostConfigServices.getCostConfig = (advisoryServiceType,courseType,greaterThanLimit,numStudents) => {
    return new Promise((resolve, reject) => {
        var params = {
            advisoryServiceType: {eq: advisoryServiceType},
            courseType: {eq: courseType},
            greaterThanLimit: {eq: greaterThanLimit},
            numStudents: {eq: numStudents},
        };
        
        CostConfig.scan(params, function (err, costConfig) {
            if (err) reject(err);
            else if (costConfig.length <= 0) reject('Ninguna configuración de costos encontrada');
            else resolve(costConfig[0]);
        });
    });
};

module.exports = CostConfigServices;