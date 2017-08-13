var uuidV4 = require('uuid/v4');
var Promise = require('promise');
var sha256 = require('sha256');

/* Models */
var Payment = require('../models/payment');

/* Enums */
var AdvisoryServiceState = require('../models/enum/advisoryServiceState');

/* Services */
var LogService = require("../services/log")();
var AdvisoryServiceServices = require('../services/advisoryService');

PaymentService = {};

PaymentService.createPayment = payment => {
    return AdvisoryServiceServices.getAdvisoryServiceById(payment.epayCoInfo.x_id_invoice)
        .then(advisoryService => {
            return new Promise((resolve, reject) => {
                var signature = sha256(`${process.env.P_CUST_ID_CLIENTE}^${process.env.P_KEY}^${payment.epayCoInfo.x_ref_payco}^${payment.epayCoInfo.x_transaction_id}^${payment.epayCoInfo.x_amount}^${payment.epayCoInfo.x_currency_code}`);

                if (signature === payment.epayCoInfo.x_signature) {
                    payment.id = uuidV4();

                    switch (parseInt(payment.epayCoInfo.x_cod_response)) {
                        case 1:
                            advisoryService.state = AdvisoryServiceState.AVAILABLE.value;
                            console.log(advisoryService);
                            AdvisoryServiceServices.updateAdvisoryService(advisoryService.id, advisoryService);
                            break;
                        case 2:
                            //echo "transacción rechazada";
                            break;
                        case 3:
                            //echo "transacción pendiente";
                            break;
                        case 4:
                            //echo "transacción fallida";
                            break;
                    }

                    Payment.create(payment, function (err, newPayment) {
                        if (err) {
                            LogService.log('PaymentService', 'createPayment', 'error', 'err', err);
                            reject(err);
                        } else {
                            LogService.log('PaymentService', 'createPayment', 'info', 'info', { id: payment.epayCoInfo.x_id_invoice });
                            resolve(newPayment);
                        }
                    });
                } else {
                    var err = 'Firma no valida'
                    LogService.log('PaymentService', 'createPayment', 'error', 'err', err);
                    reject(err);
                }
            });
        });

};

module.exports = PaymentService;