var express = require('express');
var Promise = require('promise');
    
var TeacherService = require('../services/teacher')();

var routes = function (Teacher) {
    var sessionRoute = express.Router();

    sessionRoute.route('/teacher/signup')
        .post((req, res) => {
            var teacher = new Teacher(req.body);
            var newTeacher = TeacherService.createTeacher(teacher)
                .then(newTeacher => {
                    return newTeacher;
                }, err => {
                    res.status(500).send(err);
                });
            res.status(201).send(teacher);
            
        });

    sessionRoute.route('/teacher/login')
        .post(function(req, res) {            
            console.log(req.body.username);
            Teacher.scan('email').contains(req.body.username).exec(function (err, teachers) {
                console.log(teachers);                
                if (err || teachers === undefined)
                    res.status(403).send(err);
                else
                    res.status(200).send(teachers[0]);
            });
        });

    return sessionRoute;
};

module.exports = routes;