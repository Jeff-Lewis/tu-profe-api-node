var express = require('express');

var NotificationServices = require('../services/notification');

var routes = Notification => {
    var notificationRouter = express.Router();
    
    notificationRouter.route('/')
        .post((req, res) => {
            var notification = req.body;
            NotificationServices.createNotification(notification)
                .then(newNotification => {
                    res.status(201).send(notification);
                })
                .catch(err => {
                    res.status(err).send(err);
                });
        });

    return notificationRouter;
};