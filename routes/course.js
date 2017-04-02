var express = require('express');

var routes = function (Course) {
    var courseRouter = express.Router();

    courseRouter.route('/')
        .get(function (req, res) {            
            Course.scan().exec(function (err, courses) {
                if (err)
                    console.log(err);
                else
                    res.send(courses);
            });
        })
        .post(function (req, res) {
            var course = new Course(req.body);
            course.id = uuidV4();
            Course.create(course, function (err, course) {
                if (err)
                    res.status(500).send(err);
                else
                    res.status(201).send(course);
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