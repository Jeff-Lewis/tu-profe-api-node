var express = require('express'),
    uuidV4 = require('uuid/v4');

var SchoolServices = require('../services/school');

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
            SchoolServices.createSchool(school)
                .then(school => {
                    res.status(201).send(school);
                })
                .catch(err => {
                    res.status(500).send(err);
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