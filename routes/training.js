var express = require('express'),
    uuidV4 = require('uuid/v4');

var routes = function (Training) {
    var trainingRouter = express.Router();

    trainingRouter.route('/')
        .get(function (req, res) {
            Training.scan().exec(function (err, trainings) {
                if (err)
                    res.status(500).send(err);
                else
                    res.send(trainings);
            });
        })
        .post(function (req, res) {
            var training = new Training(req.body);            
            training.id = uuidV4();            
            Training.create(training, function (err, newTraining) {
                if (err)                    
                    res.status(500).send(err);
                else
                    res.status(201).send(training);
            });
        });

    trainingRouter.route('/:id')
        .get(function (req, res) {
            Training.get({ id: req.params.id }, function (err, training) {
                if (err)
                    res.status(404).send(err);
                else
                    res.status(200).send(training);
            });
        });

    return trainingRouter;
};

module.exports = routes;