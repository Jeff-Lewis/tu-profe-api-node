var Enum = require('enum');

var MailType = new Enum({
    'STUDENT_SIGN_UP': 1,
    'TEACHER_SIGN_UP': 2,
    'FORGOT_PASSWORD': 3,
    'RESTORED_PASSWORD': 4,
    'SERVICE_CREATED': 5
});

module.exports = MailType;