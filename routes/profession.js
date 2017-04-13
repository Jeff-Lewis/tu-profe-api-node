var express = require('express'),
    uuidV4 = require('uuid/v4');

var routes = function (Profession) {
    var professionRouter = express.Router();

    professionRouter.route('/')
        .get(function (req, res) {
            Profession.scan().exec(function (err, professions) {
                if (err)
                    console.log(err);
                else
                    res.send(professions);
            });
        })
        .post(function (req, res) {
            var profession = new Profession(req.body);
            profession.id = uuidV4();
            Profession.create(profession, function (err, newProfession) {
                if (err)
                    res.status(500).send(err);
                else                    
                    res.status(201).send(profession);
            });
        });

    professionRouter.route('/:id')
        .get(function (req, res) {
            Profession.get({ id: req.params.id }, function (err, profession) {
                if (err)
                    res.status(404).send(err);
                else
                    res.status(200).send(profession);
            });
        });

    return professionRouter;
};

module.exports = routes;