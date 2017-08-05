var express = require('express');

var ScheduleServices = require('../services/schedule');

var routes = function (Schedule) {
    var scheduleRouter = express.Router();

    scheduleRouter.route('/:id')
        .get((req, res) => {
            ScheduleServices.getScheduleById(req.params.id)
                .then(schedule => res.status(200).send(schedule))
                .catch(err => res.status(500).send(err));
        });

    scheduleRouter.route('/:scheduleId/sections')
        .post((req, res) => {
            var scheduleId = req.params.scheduleId;
            var section = req.body;
            ScheduleServices.addSection(scheduleId, section)
                .then(schedule => res.status(200).send(schedule))
                .catch(err => {
                    res.status(500).send(err);
                });
        })
        .delete((req,res)=>{
            var scheduleId = req.params.scheduleId;
            var section = req.body;
            ScheduleServices.deleteSection(scheduleId, section)
                .then(schedule => res.status(200).send(schedule))
                .catch(err => res.status(500).send(err));
        });



    return scheduleRouter;
};

module.exports = routes;