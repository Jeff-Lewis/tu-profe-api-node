var Enum = require('enum');

var AdvisoryServiceState = new Enum({
    'CREATED': 1,
    'PAID_OUT': 2,
    'AVAILABLE': 1,
    'IN_PROCESS': 1,
    'FINISHED': 1,
    'CANCELED': 1,
});

module.exports = AdvisoryServiceState;