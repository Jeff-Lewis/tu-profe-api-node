var uuidV4 = require('uuid/v4');
var Teacher = require('../models/teacher');
var Promise = require('promise');

var teacherServices = function () {
    
    /**
     * Create a new Teacher 
     */
    var createTeacher = function (teacher) {
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
    var getTeacherById = function (teacherId) {
        return new Promise((resolve, reject) => {
            Teacher.get({ id: teacherId }, function (err, teacher) {
                if (err) reject(err);
                else resolve(teacher);
            });
        });
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