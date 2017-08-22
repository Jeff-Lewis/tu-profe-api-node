var express = require('express'),
    uuidV4 = require('uuid/v4');

var CourseServices = require('../services/course');

var routes = function (Course) {
    var courseRouter = express.Router();

    courseRouter.route('/')
        .get(function (req, res) {
            Course.scan().exec(function (err, courses) {
                if (err)
                    res.status(500).send(err);
                else
                    res.send(courses);
            });
        })
        .post(function (req, res) {
            CourseServices.createCourse(req.body)
                .then(course => {
                    res.status(201).send(course);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

    courseRouter.route('/:id')
        .get(function (req, res) {
            Course.get({ id: req.params.id }, function (err, course) {
                if (err)
                    res.status(404).send(err);
                else
                    res.status(200).send(course);
            });
        });

    return courseRouter;
};

module.exports = routes;