var Enum = require('enum');

var MailType = new Enum({
    'STUDENT_SIGN_UP': 1,
    'TEACHER_SIGN_UP': 2
});

module.exports = MailType;