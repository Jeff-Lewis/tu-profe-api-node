var extend = require('util')._extend;

var Interview = require('../models/interview');

var TeacherService = require('../services/teacher');

var InterviewServices = {};

InterviewServices.getInterviewById = interviewId => {
    return new Promise((resolve, reject) => {
        Interview.get({ id: interviewId }, (err, interview) => {
            if (err || interview === undefined) {reject('Interview not found');}
            else {
                interview.interviewed = interview.interviewed || [];
                resolve(interview);
            }
        });
    });
};

InterviewServices.updateInterview = (interviewId,interviewUpdated) => {
    return InterviewServices.getInterviewById(interviewId)
        .then(interview => {
            return new Promise((resolve, reject)=>{
                interview = new Interview(interviewUpdated);
                interview.save(err => {
                    if(err) { reject(err) }
                    else {resolve(interview)}
                });
            });
        });
};

InterviewServices.takePlace = (interviewId, teacherId) => {
    var teacherBackUp, interviewBackUp;
    
    return InterviewServices.getInterviewById(interviewId)
        .then(interview => {
            if(interview.interviewed.length >= interview.capacity) {
                return Promise.reject('Entrevista llena');
            } else {
                interview.interviewed.push(teacherId);
                interviewBackUp = extend({},interview);
                return Promise.resolve(interview);
            }
        })
        .then(()=>TeacherService.getTeacherById(teacherId))
        .then(teacher=>{
            if(teacher.interview!==undefined) {
                return Promise.reject('Profesor ya tiene entrevista asignada');
            } else {
                teacher.interview = interviewId;
                teacherBackUp = extend({},teacher);
                console.log(teacherBackUp);
                return Promise.resolve(teacher);
            } 
        })
        .then(TeacherService.updateTeacher(teacherId, teacherBackUp))
        .then(InterviewServices.updateInterview(interviewId, interviewBackUp));
};

module.exports = InterviewServices;