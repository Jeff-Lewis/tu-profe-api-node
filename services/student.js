var uuidV4 = require('uuid/v4');
var Promise = require('promise');
var config = require('../config');

var Student = require('../models/student');
var MailType = require('../models/enum/mailType');
var SQSServices = require('../services/sqs');
var S3Services = require('../services/s3');

var StudentServices = {};

StudentServices.createStudent = async student => {

    try {
        await StudentServices.getStudentByEmail(student.email);
        return Promise.reject('Este correo ya está asociado a otro estudiante.');
    } catch (error) {
        return new Promise((resolve, reject) => {
            student.id = uuidV4();
            Student.create(student, (err, newStudent) => {
                if (err) {
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
    return StudentServices.getStudentById(studentId)
        .then(student => {
            return new Promise((resolve, reject) => {
                student = new Student(studentUpdated);
                student.save(err => {
                    if (err) {
                        console.log(err);
                        reject(err)
                    }
                    else {
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
