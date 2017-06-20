var Enum = require('enum');

var AdvisoryServiceState = new Enum({
    'CREATED': 1,
    'PAID_OUT': 2,
    'AVAILABLE': 3,
    'IN_PROCESS': 4,
    'FINISHED': 5,
    'CANCELED': 6,
});

module.exports = AdvisoryServiceState;