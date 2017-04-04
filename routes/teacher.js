var express = require('express'),
    uuidV4 = require('uuid/v4');

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
        })
        .post(function (req, res) {
            var teacher = new Teacher(req.body);
            teacher.id = uuidV4();
            Teacher.create(teacher, function (err, newTeacher) {
                if (err)
                    res.status(500).send(err);
                else                    
                    res.status(201).send(teacher);
            });
        });

    teacherRouter.route('/:id')
        .get(function (req, res) {
            Teacher.get({ id: req.params.id }, function (err, teacher) {
                if (err)
                    console.log(err);
                    //res.status(404).send(err);
                else
                    res.status(200).send(teacher);
            });
        });

    return teacherRouter;
};

module.exports = routes;