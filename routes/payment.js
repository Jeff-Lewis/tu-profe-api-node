var express = require('express');

var LogService = require("../services/log")();
var PaymentServices = require('../services/payment');

var routes = function (Payment) {
    var paymentRouter = express.Router();

    paymentRouter.route('/')
        .post(function (req, res) {
            var payment = { epayCoInfo: req.body };
            PaymentServices.createPayment(payment)
                .then(newPayment => {
                    LogService.log('PaymentRouter', 'createPayment', 'info', 'info');
                    res.status(200).send(newPayment);
                })
                .catch(err => {
                    console.log(err);
                    LogService.log('PaymentRouter', 'createPayment', 'error', 'err', err);
                    res.status(500).send(newPayment);
                });
        });

    paymentRouter.route('/:id')
        .get(function (req, res) {
            Payment.get({ id: req.params.id }, function (err, payment) {
                if (err)
                    res.status(404).send(err);
                else
                    res.status(200).send(payment);
            });
        });

    return paymentRouter;
};

module.exports = routes;