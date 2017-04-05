var express = require('express');

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