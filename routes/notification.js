var express = require('express');

var NotificationServices = require('../services/notification');

var routes = Notification => {
    var notificationRouter = express.Router();
    
    notificationRouter.route('/')
        .get(function (req, res) {
            Notification.scan().exec(function (err, notifications) {
                if (err)
                    res.status(500).send(err);
                else
                    res.send(notifications);
            });
        })
        .post((req, res) => {
            var notification = req.body;
            NotificationServices.createNotification(notification)
                .then(newNotification => {
                    res.status(201).send(notification);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

    return notificationRouter;
};

module.exports = routes;