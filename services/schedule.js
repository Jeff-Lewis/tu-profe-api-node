var uuidV4 = require('uuid/v4');
var Promise = require('promise');

var Schedule = require('../models/schedule');

var ScheduleServices = {};

ScheduleServices.createSchedule = schedule => {
    return new Promise((resolve, reject) => {
        schedule.days = [];
        for (var i = 1; i <= 7; i++) {
            schedule.days.push({
                day: i,
                sections: []
            });
        }
        Schedule.create(schedule, (err, newSchedule) => {
            if (err) { reject(err); }
            else { resolve(newSchedule); }
        });
    });
};

ScheduleServices.getScheduleById = scheduleId => {
    return new Promise((resolve, reject) => {
        Schedule.get({ id: scheduleId }, (err, schedule) => {
            if (err || schedule === undefined) { reject('Schedule not found'); }
            else { resolve(schedule); }
        });
    });
};

ScheduleServices.updateSchedule = (scheduleId, scheduleUpdated) => {
    return ScheduleServices.getScheduleById(scheduleId)
        .then(schedule => {
            return new Promise((resolve, reject) => {
                schedule = new Schedule(scheduleUpdated);
                schedule.save(err => {
                    if (err) { reject(err) }
                    else { resolve(scheduleUpdated) }
                });
            });
        });
};

ScheduleServices.addSection = (scheduleId, newSection) => {
    return ScheduleServices.getScheduleById(scheduleId)
        .then(schedule => {
            if (newSection.endTime - newSection.startTime < 200) {
                return Promise.reject('Una sección de horario no puede ser menor a 2 horas');
            } else if (0 >= newSection.day || newSection.day >= 8) {
                return Promise.reject('La sección no pertenece a un día invalido');
            }

            var day = schedule.days.find(day => { return day.day === newSection.day; });
            var validSection = day.sections.every(section => {
                return section.startTime >= newSection.endTime ||
                    section.endTime <= newSection.startTime;
            });

            if (!validSection) {
                return Promise.reject('Esta sección no puede ser añadida porque presenta cruce con alguna otra');
            }

            var index = schedule.days.indexOf(day);
            day.sections.push(newSection);
            schedule.days[index] = day;

            return ScheduleServices.updateSchedule(schedule.id, schedule);
        });
};

module.exports = ScheduleServices;