var uuidV4 = require('uuid/v4');
var Teacher = require('../models/teacher');
var Promise = require('promise');

var teacherServices = function () {

    var createTeacher = function (teacher) {
        return new Promise(function (resolve, reject) {
            teacher.id = uuidV4();
            Teacher.create(teacher, function(err,newTeacher){
                if (err) reject(err);
                else {
                    console.log('resolve');
                    resolve(newTeacher);
                }
            });
        });
    };

    var getTeacherById = function () {

    };

    var getTeachers = function () {

    };

    var updateTeacher = function () {

    };

    return {
        createTeacher: createTeacher,
        getTeacherById: getTeacherById,
        getTeachers: getTeachers,
        updateTeacher: updateTeacher
    };
};

module.exports = teacherServices;