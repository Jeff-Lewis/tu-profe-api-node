var express = require('express'),
    multer = require('multer'),
    path = require('path');

var TeacherService = require('../services/teacher');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString(16) + path.extname(file.originalname));
    }
});
var upload = multer({
  storage: storage
});

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

    teacherRouter.route('/:teacherId')
        .get(function (req, res) {
            var teacher = TeacherService.getTeacherById(req.params.teacherId)
                .then(teacher => {
                    res.status(200).send(teacher);
                },err => {
                    res.status(404).send(err);
                });
        });
    
    teacherRouter.route('/email/:email')
        .get(function (req, res) {
            var teacher = TeacherService.getTeacherByEmail(req.params.email)
                .then(teacher => {
                    res.status(200).send(teacher);
                },err => {
                    res.status(404).send(err);
                });
        });
    
    teacherRouter.post('/curriculum',upload.single('file'),(req, res) => {
            var file = req.file;
            res.send('OK');
        });

    return teacherRouter;
};

module.exports = routes;