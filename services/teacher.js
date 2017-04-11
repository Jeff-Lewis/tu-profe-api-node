var uuidV4 = require('uuid/v4');
var Promise = require('promise');

var Teacher = require('../models/teacher');
var S3Services = require('../services/s3');
var TeacherServices = {};

    
/**
 * Create a new Teacher 
 */
TeacherServices.createTeacher = function (teacher) {
    return new Promise(function (resolve, reject) {
        teacher.id = uuidV4();
        Teacher.create(teacher, function(err,newTeacher){
            if (err) reject(err);
            else resolve(newTeacher);
        });
    });
};

/**
 * Get Teacher By Id
 */
TeacherServices.getTeacherById = teacherId => {
    return new Promise((resolve, reject) => {
        Teacher.get({ id: teacherId }, (err, teacher) => {
            if (err) reject(err);
            else resolve(teacher);   
        });
    });
};

TeacherServices.getTeacherByEmail = email => {
    return new Promise((resolve,reject)=>{
        Teacher.scan('email').eq(email).exec((err,teachers)=>{
            if(err) reject(err);
            else if(teachers.length <= 0) reject('Ningun profesor fue encontrado');
            else resolve(teachers[0]);
        });
    });
};

TeacherServices.getTeachers = function () {

};

TeacherServices.updateTeacher = function () {

};

TeacherServices.uploadCurriculum = function(teacherId,curriculum) {
    var bucketName = 'tu-profe/teachers/curriculum';
    var key = teacherId + '.docx';
    var file = curriculum;
    
    return TeacherServices.getTeacherById(teacherId)
        .then(teacher => S3Services.uploadFile(bucketName, key, file));
};

module.exports = TeacherServices;