var uuidV4 = require('uuid/v4');
var Promise = require('promise');

var Teacher = require('../models/teacher');
var TeacheState = require('../models/enum/teacherState');
var ScheduleServices = require('../services/schedule');
var S3Services = require('../services/s3');
var TeacherServices = {};


/**
 * Create a new Teacher 
 */
TeacherServices.createTeacher = teacher => {
    return new Promise((resolve, reject) => {
        teacher.id = uuidV4();
        teacher.acceptGameRules = false;
        teacher.state = TeacheState.SIGN_UP.value;
        Teacher.create(teacher, function (err, newTeacher) {
            if (err) {
                reject(err);
            }
            else {
                ScheduleServices.createSchedule({ id: teacher.id });
                resolve(newTeacher);
            }
        });
    });
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
    return TeacherServices.getTeacherById(teacherId)
        .then(teacher => {
            return new Promise((resolve, reject) => {
                teacher = new Teacher(teacherUpdated);
                teacher.save(err => {
                    if (err) { reject(err) }
                    else { resolve(teacher) }
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