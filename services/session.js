var Promise = require('promise');
var config = require('../config');
var jwt = require('jsonwebtoken');

var SessionServices = {};

SessionServices.authenticate = (username, password, user) => {
    console.log('here');
    return new Promise((resolve, reject) => {
        if (user === null || user === undefined) {
            reject('Autenticación invalida');
        } else if (user.password !== password) {
            reject('Autenticación fallida.');
        } else {
            var token = jwt.sign(user, config.secret, {
                expiresIn: 1440 
            });
            resolve({
                success: true,
                message: 'Este token de sesión expirará en 24 horas',
                token: token
            });
        }
    });
};

module.exports = SessionServices;