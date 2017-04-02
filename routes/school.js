var express = require('express');

var routes = function (School) {
    var schoolRouter = express.Router();

    schoolRouter.route('/')
        .get(function (req, res) {
            School.scan().exec(function (err, schools) {
                if (err)
                    console.log(err);
                else
                    res.send(schools);
            });
        })
        .post(function (req, res) {
            var school = new School(req.body);
            school.id = uuidV4();
            School.create(school, function (err, school) {
                if (err)
                    res.status(500).send(err);
                else
                    res.status(201).send(school);
            });
        });

    schoolRouter.route('/:id')
        .get(function (req, res) {
            School.get({ id: req.params.id }, function (err, school) {
                if (err)
                    res.status(404).send(err);
                else
                    res.status(200).send(school);
            });
        });

    return schoolRouter;
};

module.exports = routes;