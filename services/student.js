var uuidV4 = require('uuid/v4');
var Promise = require('promise');
var NodeGeocoder = require('node-geocoder');
var config = require('../config');

var Student = require('../models/student');
var MailType = require('../models/enum/mailType');
var LogService = require("../services/log")();
var SQSServices = require('../services/sqs');
var S3Services = require('../services/s3');

var StudentServices = {};
var geocoder = NodeGeocoder(config.geocoderOptions);

StudentServices.createStudent = async student => {

    try {
        await StudentServices.getStudentByEmail(student.email);
        var error = 'Este correo ya está asociado a otro estudiante.';
        LogService.log('StudentServices', 'createStudent', 'error', 'err', student);
        return Promise.reject(error);
    } catch (error) {
        return new Promise((resolve, reject) => {
            student.id = uuidV4();
            Student.create(student, (err, newStudent) => {
                if (err) {
                    LogService.log('StudentServices', 'createStudent', 'error', 'err', { student: student, err: err });
                    reject(err);
                }
                else {
                    var sqsAttributes = {
                        MailType: { DataType: 'String', StringValue: MailType.STUDENT_SIGN_UP.key },
                        Mail: { DataType: 'String', StringValue: student.email }
                    };
                    SQSServices.sendMessage(config.queues.mailQueue, JSON.stringify(student), null, sqsAttributes);
                    resolve(newStudent);
                }
            });
        });
    }
};

/**
 * Get Student By Id
 */
StudentServices.getStudentById = studentId => {
    return new Promise((resolve, reject) => {
        Student.get({
            id: studentId
        }, (err, student) => {
            if (err || student === undefined) {
                reject('Student not found');
            }
            else {
                student.courses = student.courses || [];
                resolve(student);
            }
        });
    });
};

StudentServices.getStudentByEmail = email => {
    return new Promise((resolve, reject) => {
        Student.scan('email').eq(email).exec((err, students) => {
            if (err) reject(err);
            else if (students.length <= 0) reject('Ningun estudiante fue encontrado');
            else resolve(students[0]);
        });
    });
};

StudentServices.updateStudent = (studentId, studentUpdated) => {
    return Promise.all([
        geocoder.geocode(`${studentUpdated.city.name}, ${studentUpdated.address}`),
        StudentServices.getStudentById(studentId)
    ])
        .then(values => {
            var geoInfo = values[0][0];
            var student = values[1];

            if (geoInfo !== null) {
                studentUpdated.geoInfo = {
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
                studentUpdated.geoInfo = null;
            }

            return new Promise((resolve, reject) => {
                student = new Student(studentUpdated);
                student.save(err => {
                    if (err) {
                        LogService.log('StudentServices', 'updateStudent', 'error', 'err', { student: studentUpdated, err: err });
                        reject(err)
                    }
                    else {
                        LogService.log('StudentServices', 'updateStudent', 'info', 'info', student);
                        resolve(student)
                    }
                });
            });
        });

};

StudentServices.updatePhoto = (studentId, photo) => {
    var bucketName = 'tu-profe/students/profile-photo';
    var key = studentId + '.png';
    var file = photo;

    return StudentServices.getStudentById(studentId)
        .then(student => S3Services.uploadFile(bucketName, key, file));
};

module.exports = StudentServices;
