var express = require('express'),
    uuidV4 = require('uuid/v4');

var routes = function (City) {
    var cityRouter = express.Router();

    cityRouter.route('/')
        .get(function (req, res) {
            City.scan().exec(function (err, cities) {
                if (err)
                    res.status(500).send(err);
                else
                    res.send(cities);
            });
        });

    cityRouter.route('/:id')
        .get(function (req, res) {
            City.get({ id: req.params.id }, function (err, city) {
                if (err)
                    res.status(404).send(err);
                else
                    res.status(200).send(city);
            });
        });

    return cityRouter;
};

module.exports = routes;