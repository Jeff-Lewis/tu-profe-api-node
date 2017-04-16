var express = require('express'),
    uuidV4 = require('uuid/v4');

var TeacherService = require('../services/teacher'),
    InterviewService = require('../services/interview');

var routes = function (Interview) {
    var interviewRouter = express.Router();

    interviewRouter.route('/')
        .get(function (req, res) {
            InterviewService.getAll()
                .then(interviews => {
                    res.status(200).send(interviews);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        })
        .post(function (req, res) {
            var interview = new Interview(req.body);
            interview.id = uuidV4();
            Interview.create(interview, function (err, newInterview) {
                if (err) { res.status(500).send(err) }
                else { res.status(201).send(interview) }
            });
        });

    interviewRouter.route('/:interviewId')
        .get(function (req, res) {
            InterviewService.getInterviewById(req.params.interviewId)
                .then(interview => {
                    res.status(200).send(interview);
                }, err => {
                    res.status(404).send(err);
                });
        });

    interviewRouter.route('/active/all')
        .get(function (req, res) {
            Interview.scan().exec(function (err, interviews) {
                if (err) { res.status(500).send() }
                else {
                    interviews = interviews.filter(interview => {
                        interview.interviewed = interview.interviewed || [];
                        var capacity = interview.interviewed.length < interview.capacity;
                        var startDateTime = interview.startDateTime > new Date().getTime();
                        return capacity && startDateTime;
                    });
                    res.send(interviews);
                }
            });
        });

    interviewRouter.route('/active/take-place')
        .post((req, res) => {
            var teacherId = req.body.teacherId;
            var interviewId = req.body.interviewId;

            InterviewService.takePlace(interviewId, teacherId)
                .then(() => {
                    console.log('is returning');
                    res.status(200).send();
                })
                .catch((err) => {
                    res.status(500).send(err);
                });
        });


    return interviewRouter;
};

module.exports = routes;