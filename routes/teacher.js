var express = require('express'),
    multer = require('multer'),
    path = require('path');

var LogService = require("../services/log")();
var TeacherService = require('../services/teacher');

var upload = multer({ dest: '..uploads/' })

var routes = function (Teacher) {
    var teacherRouter = express.Router();

    teacherRouter.route('/')
        .get(function (req, res) {
            Teacher.scan().exec(function (err, teachers) {
                if (err)
                    res.status(500).send(err);
                else
                    res.send(teachers);
            });
        })
        .put((req, res) => {
            var teacher = req.body;
            TeacherService.updateTeacher(teacher.id, teacher)
                .then(teacher => {
                    res.status(200).send(teacher);
                }, err => {
                    LogService.log('TeacherRoute', 'updateTeacher', 'error', 'err', { teacher: teacher, err: err });
                    res.status(500).send(err);
                });
        });

    teacherRouter.route('/:teacherId')
        .get(function (req, res) {
            TeacherService.getTeacherById(req.params.teacherId)
                .then(teacher => {
                    res.status(200).send(teacher);
                }, err => {
                    res.status(404).send(err);
                });
        });

    teacherRouter.route('/email/:email')
        .get(function (req, res) {
            TeacherService.getTeacherByEmail(req.params.email)
                .then(teacher => {
                    res.status(200).send(teacher);
                }, err => {
                    res.status(404).send(err);
                });
        });

    teacherRouter.post('/curriculum/:teacherId', upload.single('file'), (req, res) => {
        var file = req.file;
        TeacherService.uploadCurriculum(req.params.teacherId, file)
            .then(data => {
                res.status(200).send(data);
            }, err => {
                res.status(404).send(err);
            });
    });

    teacherRouter.post('/accept-game-rules/:teacherId', (req, res) => {
        TeacherService.acceptGameRules(req.params.teacherId)
            .then(teacher => {
                res.status(200).send();
            }, err => {
                res.status(404).send(err);
            });
    });

    teacherRouter.post('/take-exam/:teacherId', (req, res) => {
        TeacherService.takeExam(req.params.teacherId, req.body)
            .then(teacher => {
                res.status(200).send();
            }, err => {
                res.status(404).send(err);
            });
    });

    teacherRouter.post('/activate-account/:teacherId', (req, res) => {
        TeacherService.activateAccount(req.params.teacherId)
            .then(teacher => {
                res.status(200).send();
            }, err => {
                res.status(404).send(err);
            });
    });

    teacherRouter.post('/change-valid-data/:teacherId', (req, res) => {
        TeacherService.changeValidData(req.params.teacherId)
            .then(teacher => {
                res.status(200).send();
            }, err => {
                res.status(404).send(err);
            });
    });

    teacherRouter.get('/link-up/all', (req, res) => {
        TeacherService.getLinkUpTeachers()
            .then(teachers => {
                res.status(200).send(teachers);
            }, err => {
                res.status(500).send(err);
            });
    });

    /**
     * POST - Update teacher photo profile.
     */
    teacherRouter.post('/photo/:teacherId', upload.single('file'), (req, res) => {
        var file = req.file;
        TeacherService.updatePhoto(req.params.teacherId, file)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });

    return teacherRouter;
};

module.exports = routes;