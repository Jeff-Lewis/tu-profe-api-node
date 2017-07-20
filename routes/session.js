var express = require('express');
var Promise = require('promise');

var SessionServices = require('../services/session');
var TeacherService = require('../services/teacher');
var StudentServices = require('../services/student');
var AdminServices = require('../services/admin');

var routes = function (Teacher, Student, Admin) {
    var sessionRoute = express.Router();

    sessionRoute.route('/teacher/signup')
        .post((req, res) => {
            var teacher = new Teacher(req.body);
            SessionServices.signUpUser('Teacher',teacher)
                .then(newTeacher => {
                    res.status(201).send(teacher);
                }, err => {
                    res.status(500).send(err);
                });
        });

    sessionRoute.route('/teacher/login')
        .post(function (req, res) {
            TeacherService.getTeacherByEmail(req.query.username)
                .then(teacher => SessionServices.authenticate(req.query.username, req.query.password, teacher))
                .then(token => res.status(200).send(token))
                .catch(err => res.status(500).send(err));
        });

    sessionRoute.route('/student/signup')
        .post((req, res) => {
            var student = new Student(req.body);
            SessionServices.signUpUser('Student',student)
                .then(newStudent => {
                    console.log(newStudent);
                    res.status(201).send(student);
                }, err => {
                    res.status(500).send(err);
                });
        });

    sessionRoute.route('/student/login')
        .post(function (req, res) {
            StudentServices.getStudentByEmail(req.query.username)
                .then(student => SessionServices.authenticate(req.query.username, req.query.password, student))
                .then(token => res.status(200).send(token))
                .catch(err => res.status(500).send(err));
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