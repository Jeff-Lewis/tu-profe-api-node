var uuidV4 = require('uuid/v4')
Promise = require('promise');

var Course = require('../models/course');

var CourseServices = {};

CourseServices.getTutorCourse = () => {
    return {
        courseName: "Acompañamiento",
        id: "00000000-0000-0000-0000-000000000000"
    };
};

CourseServices.createCourse = course => {
    return new Promise((resolve, reject) => {
        course.id = uuidV4();
        Course.create(course, function (err, newCourse) {
            if (err) {
                reject(err);
            } else {                
                resolve(newCourse);
            }
        });
    });
};

module.exports = CourseServices;