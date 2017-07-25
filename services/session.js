var Promise = require('promise');
var config = require('../config');
var jwt = require('jsonwebtoken');

var UtilsServices = require('../services/utils');
var TeacherService = require('../services/teacher');
var StudentServices = require('../services/student');
var AdminServices = require('../services/admin');
var MailType = require('../models/enum/mailType');
var SQSServices = require('../services/sqs');
var SessionServices = {};

SessionServices.authenticate = (username, password, user) => {
    return UtilsServices.comparePassword(password, user.password)
        .then(isPasswordMatch => {
            if (!isPasswordMatch) {
                return Promise.reject('Autenticación fallida.');
            } else {
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 1440
                });
                return Promise.resolve({
                    success: true,
                    message: 'Este token de sesión expirará en 24 horas',
                    token: token,
                    user: {
                        username: user.email,
                        userId: user.id
                    }
                });
            }
        });
};

SessionServices.signUpUser = (userType, user) => {
    return UtilsServices.crypt(user.password)
        .then(password => {
            user.password = password;
            switch (userType) {
                case 'Teacher':
                    return TeacherService.createTeacher(user);
                case 'Student':
                    return StudentServices.createStudent(user);
                case 'Admin':
                    return AdminServices.createAdmin(user);
                default:
                    Promise.reject('El tipo de usuario no es valido');
                    break;
            }
        });
};

SessionServices.forgotPassword = async (userType, email) => {
    var user = null;    
    switch (userType) {
        case 'Teacher':
            user = await TeacherService.getTeacherByEmail(email);
            break;
        case 'Student':
            user = await StudentServices.getStudentByEmail(email);
            break;
        default:
            return Promise.reject('El tipo de usuario no es valido');
    }

    var sqsAttributes = {
        MailType: { DataType: 'String', StringValue: MailType.FORGOT_PASSWORD.key },
        Mail: { DataType: 'String', StringValue: email }
    };
    var data = {
        name: user.name,
        url: 'http://localhost:8081/'
    }
    return SQSServices.sendMessage(config.queues.mailQueue, JSON.stringify(data), null, sqsAttributes);    
};

module.exports = SessionServices;