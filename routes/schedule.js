var express = require('express');

var ScheduleServices = require('../services/schedule');

var routes = function (Schedule) {
    var scheduleRouter = express.Router();

    scheduleRouter.route('/:scheduleId/sections')
        .post(function (req, res) {
            var scheduleId = req.params.scheduleId;
            var section = req.body;
            ScheduleServices.addSection(scheduleId, section)
                .then(schedule => res.status(200).send(schedule))
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                });
        });



    return scheduleRouter;
};

module.exports = routes;