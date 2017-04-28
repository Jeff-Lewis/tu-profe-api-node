var extend = require('util')._extend;

var Interview = require('../models/interview');

var TeacherService = require('../services/teacher');

var InterviewServices = {};

InterviewServices.getAll = () => {
    return new Promise((resolve, reject) => {
        Interview.scan().exec(function (err, interviews) {
            if (err) {
                reject(err);
            }
            else {
                interviews.forEach(interview => {
                    interview.interviewed = interview.interviewed || [];
                });
                resolve(interviews);
            }
        });
    });
};

InterviewServices.getInterviewById = interviewId => {
    return new Promise((resolve, reject) => {
        Interview.get({ id: interviewId }, (err, interview) => {
            if (err || interview === undefined) { reject('Interview not found'); }
            else {
                interview.interviewed = interview.interviewed || [];
                resolve(interview);
            }
        });
    });
};

InterviewServices.updateInterview = (interviewId, interviewUpdated) => {
    return InterviewServices.getInterviewById(interviewId)
        .then(interview => {
            return new Promise((resolve, reject) => {
                interview = new Interview(interviewUpdated);
                interview.save(err => {
                    if (err) { reject(err) }
                    else { resolve(interview) }
                });
            });
        });
};
/*
InterviewServices.takePlace = (interviewId, teacherId) => {
    var teacherBackUp, interviewBackUp;

    return Promise.all([
        InterviewServices.getInterviewById(interviewId),
        TeacherService.getTeacherById(teacherId)
    ])
        .then(([interview, teacher]) => {

            if (interview.interviewed.length >= interview.capacity) {
                return Promise.reject('Entrevista llena');
            } else if (interview.interviewed.indexOf(teacherId) > -1) {
                return Promise.reject('Profesor ya esta agendado en esta entrevista');
            } else {
                interview.interviewed.push(teacherId);
            }

            if (teacher.interview !== undefined) {
                return Promise.reject('Profesor ya tiene entrevista asignada');
            } else {
                teacher.interview = interviewId;
                teacher.state = 2;
            }

            return {
                interview: interview,
                teacher: teacher
            };

        })
        .then(data => {
            return Promise.all([
                InterviewServices.updateInterview(interviewId, data.interview),
                TeacherService.updateTeacher(teacherId, data.teacher)
            ]);
        });
};
*/
module.exports = InterviewServices;