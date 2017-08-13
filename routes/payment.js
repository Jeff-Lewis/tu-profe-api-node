var express = require('express');

var routes = function (Payment) {
    var paymentRouter = express.Router();

    paymentRouter.route('/')
        .get(function (req, res) {
            Payment.scan().exec(function (err, payments) {
                if (err)
                    res.status(500).send(err);
                else
                    res.send(payments);
            });
        })
        .post(function (req, res) {
            var payment = new Payment(req.body);
            console.log(payment);
            Payment.create(payment, function (err, newPayment) {
                if (err)
                    res.status(500).send(err);
                else
                    res.status(201).send(payment);
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