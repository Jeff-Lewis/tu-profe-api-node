var Enum = require('enum');

var SessionState = new Enum({
    'PENDING': 0,
    'IN_PROCESS': 1,
    'FINISHED': 2,
    'FROZEN': 3,
    'CANCELED': 4
});

module.exports = SessionState;