var express = require('express'),
    uuidV4 = require('uuid/v4');

var routes = function (Interview) {
    var interviewRouter = express.Router();

    interviewRouter.route('/')
        .get(function (req, res) {
            Interview.scan().exec(function (err, interviews) {
                if (err)
                    console.log(err);
                else
                    res.send(interviews);
            });
        })
        .post(function (req, res) {
            var interview = new Interview(req.body);            
            interview.id = uuidV4();            
            Interview.create(interview, function (err, newInterview) {
                if (err) {res.status(500).send(err)}
                else {res.status(201).send(interview)}
            });
        });

    interviewRouter.route('/:id')
        .get(function (req, res) {
            Interview.get({ id: req.params.id }, function (err, interview) {
                if (err || interview === undefined)
                    res.status(404).send(err);
                else
                    res.status(200).send(interview);
            });
        });
        
     interviewRouter.route('/active/all')
        .get(function (req, res) {
            Interview.scan().exec(function (err, interviews) {
                if (err) {res.status(500).send()}
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

    
    return interviewRouter;
};

module.exports = routes;