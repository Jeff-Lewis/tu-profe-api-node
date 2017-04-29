var express = require('express');
var Promise = require('promise');

var TeacherService = require('../services/teacher');
var StudentServices = require('../services/student');
var AdminServices = require('../services/admin');

var routes = function (Teacher, Student, Admin) {
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
        .post(function (req, res) {
            console.log(req.query.username);
            Teacher.scan('email').contains(req.query.username).exec(function (err, teachers) {
                if (err || teachers === undefined)
                    res.status(403).send(err);
                else
                    res.status(200).send(teachers[0]);
            });
        });

    sessionRoute.route('/student/signup')
        .post((req, res) => {
            var student = new Student(req.body);
            StudentServices.createStudent(student)
                .then(newStudent => {
                    res.status(201).send(student);
                }, err => {
                    res.status(500).send(err);
                });
        });

    sessionRoute.route('/student/login')
        .post(function (req, res) {
            console.log(req.query.username);
            Student.scan('email').contains(req.query.username).exec(function (err, students) {
                if (err || students === undefined)
                    res.status(403).send(err);
                else
                    res.status(200).send(students[0]);
            });
        });

    sessionRoute.route('/admin/signup')
        .post((req, res) => {
            var admin = new Admin(req.body);
            AdminServices.createAdmin(admin)
                .then(newAdmin => {
                    res.status(201).send(admin);
                }, err => {
                    res.status(500).send(err);
                });
        });

    return sessionRoute;
};

module.exports = routes;