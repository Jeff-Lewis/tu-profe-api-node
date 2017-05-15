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
        })
        .put((req, res) => {
            var notification = req.body;
            NotificationServices.updateNotification(notification.id, notification)
                .then(notification => {
                    res.status(200).send(notification);
                }, err => {
                    res.status(500).send(err);
                });
        });
        
    notificationRouter.route('/user/:userId')
        .get((req,res)=>{
            NotificationServices.getNotificationsByUserId(req.params.userId)
                .then(notifications=>{
                    res.status(200).send(notifications);
                })
                .catch(err=>{
                    res.status(500).send(err);
                });
        });

    return notificationRouter;
};

module.exports = routes;