var uuidV4 = require('uuid/v4');
var Promise = require('promise');

var Notification = require('../models/notification')
var NotificationServices = {};

NotificationServices.createNotification = notification => {
    return new Promise((resolve, reject) => {
        notification.id = uuidV4();
        notification.read = false;
        notification.date = new Date();
        Notification.create(notification, (err, newNotification) => {
            if (err) reject(err);
            else resolve(newNotification);
        });
    });
};

NotificationServices.updateNotification = (notificationId, notificationUpdated) => {
    return NotificationServices.getNotificationById(notificationId)
        .then(notification => {
            return new Promise((resolve, reject) => {
                notification = new Notification(notificationUpdated);
                notification.save(err => {
                    if (err) { reject(err) }
                    else { resolve(notification) }
                });
            });
        });
};

NotificationServices.deleteNotification = notificationId => {
    return new Promise((resolve,reject)=>{
        Notification.delete({id: notificationId}, (err) => {
            if(err) { return reject(err); }
            return resolve();
        });
    });  
};

NotificationServices.getNotificationById = notificationId => {
    return new Promise((resolve, reject) => {
        Notification.get({ id: notificationId }, (err, notification) => {
            if (err || notification === undefined) { reject('Notification not found'); }
            else {
                resolve(notification);
            }
        });
    });
};

NotificationServices.getNotificationsByUserId = userId => {
    return new Promise((resolve, reject) => {
        Notification.scan({userId: {eq: userId} }, function (err, notifications) {
            if (err) reject(err);
            else resolve(notifications);
        });
    });
};

module.exports = NotificationServices;