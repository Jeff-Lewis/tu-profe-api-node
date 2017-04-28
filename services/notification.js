var uuidV4 = require('uuid/v4');
var Promise = require('promise');

var Notification = require('../models/notification')
var NotificationServices = {};

NotificationServices.createNotification = notification => {
    return new Promise((resolve, reject) => {
        notification.id = uuidV4();
        Notification.create(notification, (err, newNotification) => {
            if (err) reject(err);
            else resolve(newNotification);
        });
    });
};

module.exports = NotificationServices;