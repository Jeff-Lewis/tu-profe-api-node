var uuidV4 = require('uuid/v4');

var teacherServices = function (Teacher) {

    var createTeacher = function (teacher) {
        return teacher.save();
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