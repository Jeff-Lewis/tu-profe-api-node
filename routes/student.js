var express = require('express'),
    multer = require('multer'),
    path = require('path');

var StudentService = require('../services/student');

var upload = multer({ dest: '..uploads/' })

var routes = function (Student) {
    var studentRouter = express.Router();

    /**
     * GET - All Students.
     * PUT - Update a student.
     */
    studentRouter.route('/')
        .get(function (req, res) {
            Student.scan().exec(function (err, students) {
                if (err)
                    res.status(500).send(err);
                else
                    res.send(students);
            });
        })
        .put((req, res) => {
            var student = req.body;
            StudentService.updateStudent(student.id, student)
                .then(student => {
                    res.status(200).send(student);
                }, err => {
                    res.status(500).send(err);
                });
        });

    /**
     * GET - A specific student by id.
     */
    studentRouter.route('/:studentId')
        .get(function (req, res) {
            StudentService.getStudentById(req.params.studentId)
                .then(student => {
                    res.status(200).send(student);
                }, err => {
                    res.status(404).send(err);
                });
        });

    /**
     * GET - A specific student by email.
     */
    studentRouter.route('/email/:email')
        .get(function (req, res) {
            StudentService.getStudentByEmail(req.params.email)
                .then(student => {
                    res.status(200).send(student);
                }, err => {
                    res.status(404).send(err);
                });
        });

    /**
     * POST - Update student photo profile.
     */
    studentRouter.post('/photo/:studentId', upload.single('file'), (req, res) => {
        var file = req.file;
        StudentService.updatePhoto(req.params.studentId, file)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
    });


    return studentRouter;
};

module.exports = routes;