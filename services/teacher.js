var uuidV4 = require('uuid/v4');
var Promise = require('promise');
var NodeGeocoder = require('node-geocoder');
var config = require('../config');

var Teacher = require('../models/teacher');
var TeacheState = require('../models/enum/teacherState');
var MailType = require('../models/enum/mailType');
var ScheduleServices = require('../services/schedule');
var SQSServices = require('../services/sqs');
var S3Services = require('../services/s3');
var LogService = require("../services/log")();
var geocoder = NodeGeocoder(config.geocoderOptions);
var TeacherServices = {};


/**
 * Create a new Teacher 
 */
TeacherServices.createTeacher = async teacher => {
    try {
        await TeacherServices.getTeacherByEmail(teacher.email);
        return Promise.reject('Este correo ya está asociado a otro profesor.');
    } catch (err) {
        return new Promise((resolve, reject) => {
            teacher.id = uuidV4();
            teacher.acceptGameRules = false;
            teacher.state = TeacheState.SIGN_UP.value;
            Teacher.create(teacher, function (err, newTeacher) {
                if (err) { reject(err); }
                else {
                    ScheduleServices.createSchedule({ id: teacher.id });

                    var sqsAttributes = {
                        MailType: { DataType: 'String', StringValue: MailType.TEACHER_SIGN_UP.key },
                        Mail: { DataType: 'String', StringValue: teacher.email }
                    };
                    SQSServices.sendMessage(config.queues.mailQueue, JSON.stringify(teacher), null, sqsAttributes);

                    resolve(newTeacher);
                }
            });
        });
    }
};

/**
 * Get Teacher By Id
 */
TeacherServices.getTeacherById = teacherId => {
    return new Promise((resolve, reject) => {
        Teacher.get({ id: teacherId }, (err, teacher) => {
            if (err || teacher === undefined) { reject('Teacher not found'); }
            else {
                teacher.courses = teacher.courses || [];
                teacher.advisoryServices = teacher.advisoryServices || [];
                resolve(teacher);
            }
        });
    });
};

TeacherServices.getTeacherByEmail = email => {
    return new Promise((resolve, reject) => {
        Teacher.scan('email').eq(email).exec((err, teachers) => {
            if (err) reject(err);
            else if (teachers.length <= 0) reject('Ningun profesor fue encontrado');
            else resolve(teachers[0]);
        });
    });
};

TeacherServices.getLinkUpTeachers = () => {
    return new Promise((resolve, reject) => {
        Teacher.scan('state').between(0, 3).exec((err, teachers) => {
            if (err) reject(err);
            else if (teachers.length <= 0) reject('Ningun profesor fue encontrado');
            else resolve(teachers);
        });
    });
};

TeacherServices.updateTeacher = (teacherId, teacherUpdated) => {
    return Promise.all([
        geocoder.geocode(`${teacherUpdated.city.name}, ${teacherUpdated.address}`),
        TeacherServices.getTeacherById(teacherId)
    ])
        .then(values => {
            var geoInfo = values[0][0];
            var teacher = values[1];

            if (geoInfo !== null) {
                teacherUpdated.geoInfo = {
                    city: geoInfo.city,
                    country: geoInfo.country,
                    countryCode: geoInfo.countryCode,
                    zipcode: geoInfo.zipcode,
                    formattedAddress: geoInfo.formattedAddress,
                    latitude: geoInfo.latitude,
                    longitude: geoInfo.longitude,
                    neighborhood: geoInfo.extra.neighborhood
                };
            } else {
                teacherUpdated.geoInfo = null;
            }

            return new Promise((resolve, reject) => {
                teacher = new Teacher(teacherUpdated);
                teacher.save(err => {
                    if (err) {
                        LogService.log('TeacherServices', 'updateTeacher', 'error', 'err', { teacher: teacherUpdated, err: err });
                        reject(err);
                    }
                    else {
                        LogService.log('TeacherServices', 'updateTeacher', 'info', 'info', teacher);
                        resolve(teacher);
                    }
                });
            });
        });
};

TeacherServices.uploadCurriculum = (teacherId, curriculum) => {
    var bucketName = 'tu-profe/teachers/curriculum';
    var key = teacherId + '.docx';
    var file = curriculum;

    return TeacherServices.getTeacherById(teacherId)
        .then(teacher => S3Services.uploadFile(bucketName, key, file))
        .then(data => TeacherServices.getTeacherById(teacherId))
        .then(teacher => {
            teacher.state = 1;
            TeacherServices.updateTeacher(teacherId, teacher);
        });
};

TeacherServices.acceptGameRules = teacherId => {
    return TeacherServices.getTeacherById(teacherId)
        .then(teacher => {
            teacher.acceptGameRules = true;
            return Promise.resolve(teacher);
        })
        .then(teacher => TeacherServices.updateTeacher(teacherId, teacher));
};

TeacherServices.takeExam = (teacherId, exam) => {
    return TeacherServices.getTeacherById(teacherId)
        .then(teacher => {
            teacher.exam = exam;
            return Promise.resolve(teacher);
        })
        .then(teacher => TeacherServices.updateTeacher(teacherId, teacher));
};

TeacherServices.changeValidData = teacherId => {
    return TeacherServices.getTeacherById(teacherId)
        .then(teacher => {
            teacher.validData = teacher.validData ? !teacher.validData : true;
            return Promise.resolve(teacher);
        })
        .then(teacher => TeacherServices.updateTeacher(teacherId, teacher));
};

TeacherServices.activateAccount = (teacherId, exam) => {
    return TeacherServices.getTeacherById(teacherId)
        .then(teacher => {
            teacher.state = TeacheState.ACTIVE.value;
            return Promise.resolve(teacher);
        })
        .then(teacher => TeacherServices.updateTeacher(teacherId, teacher));
};

TeacherServices.updatePhoto = (teacherId, photo) => {
    var bucketName = 'tu-profe/teachers/profile-photo';
    var key = teacherId + '.png';
    var file = photo;

    return TeacherServices.getTeacherById(teacherId)
        .then(teacher => S3Services.uploadFile(bucketName, key, file));
};

module.exports = TeacherServices;