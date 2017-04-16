var Enum = require('enum');

var TeacherState = new Enum({
    'SIGN_UP': 0,
    'CURRICULUM': 1,
    'INTERVIEW': 2,
    'INACTIVE': 3,
    'ACTIVE': 4,
    'REJECTED': 5
});

module.exports = TeacherState;