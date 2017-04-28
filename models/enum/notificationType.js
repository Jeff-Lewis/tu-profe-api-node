var Enum = require('enum');

var NotificationType = new Enum({
    'ERROR': 1,
    'SUCCESS': 2,
    'WARNING': 3,
    'INFO': 4,
    'IPORTANT_INF0': 5,
});

module.exports = NotificationType;