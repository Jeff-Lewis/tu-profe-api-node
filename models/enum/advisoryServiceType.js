var Enum = require('enum');

var AdvisoryServiceType = new Enum({
    'TUTOR': 1,
    'SPECIFIC_TOPIC': 2
});

module.exports = AdvisoryServiceType;