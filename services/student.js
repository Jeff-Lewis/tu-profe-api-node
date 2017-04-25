var uuidV4 = require('uuid/v4');
var Promise = require('promise');

var Student = require('../models/student');

var StudentServices = {};

StudentServices.createStudent = student => {
    return new Promise((resolve, reject) => {
        student.id = uuidV4();
        Student.create(student, (err, newStudent) => {
            if (err) { reject(err); }
            else { resolve(newStudent); }
        });
    });
};

module.exports = StudentServices;