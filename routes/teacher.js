var express = require('express');

var TeacherService = require('../services/teacher');

var routes = function (Teacher) {
    var teacherRouter = express.Router();

    teacherRouter.route('/')
        .get(function (req, res) {
            Teacher.scan().exec(function (err, teachers) {
                if (err)
                    console.log(err);
                    //res.status(500).send(err);
                else
                    res.send(teachers);
            });
        });

    teacherRouter.route('/:teacherId')
        .get(function (req, res) {
            var teacher = TeacherService.getTeacherById(req.params.teacherId)
                .then(teacher => {
                    res.status(200).send(teacher);
                },err => {
                    res.status(404).send(err);
                });
        });
    
    teacherRouter.route('/email/:email')
        .get(function (req, res) {
            var teacher = TeacherService.getTeacherByEmail(req.params.email)
                .then(teacher => {
                    res.status(200).send(teacher);
                },err => {
                    res.status(404).send(err);
                });
        });

    return teacherRouter;
};

module.exports = routes;