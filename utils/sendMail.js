// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
/*
var helper = require('sendgrid').mail;
var fromEmail = new helper.Email('test@example.com');
var toEmail = new helper.Email('diego.alfonso.prieto.torres@gmail.com');
var subject = 'Sending with SendGrid is Fun';
var content = new helper.Content('text/plain', 'and easy to do anywhere, even with Node.js');
var mail = new helper.Mail(fromEmail, subject, toEmail, content);

var substitution = new helper.Substitution("%name%", "User's Name")
mail.personalizations[0].addSubstitution(substitution)
mail.setTemplateId('1bb85931-4c35-4bee-9a38-798e9736a58e')

var sg = require('sendgrid')('');
var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON()
});

sg.API(request, function(error, response) {
  if (error) {
    console.log('Error response received');
  }
  console.log('Status: ', response.statusCode);
  console.log('Body: ', response.body);
  console.log('Headers: ', response.headers);
});
*/
/*
var fs = require('fs');
var nodemailer = require('nodemailer');
fs.readFile(__dirname + '/../mailTemplates/test.html', 'utf-8', function (err, file) {

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
      user: 'diego.alfonso.prieto.torres@gmail.com',
      pass: process.env.TU_PROFE_GMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  var mailOptions = {
    from: 'TuProfeNoReply <tu-profe-noreply@gmail.com>',
    to: 'diego.prieto.torres@hotmail.com',
    subject: 'Sending Email using Node.js',
    html: file
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});
*/





/*
var MailType = require('../models/enum/mailType');
console.log(MailType.enums);

for (var i = 0; i < MailType.enums.length ; i++) { 
  console.log(MailType.enums[i].value + ' => ' + MailType.enums[i].key) 
}
*/

/*
var MailTemplateServices = require('../services/mailTemplate');
var data = {
  name: 'diego'
};

console.log(MailTemplateServices);

MailTemplateServices.getMailTemplateById('STUDENT_SIGN_UP')
  .then(mailTemplate => {
    console.log(mailTemplate)
    var tpl = eval('`' + mailTemplate.text + '`');
    console.log(tpl);
  })
  .catch(err => console.log(err));
*/

/*
var SQSServices = require('../services/sqs');
var MailType = require('../models/enum/mailType');
var config = require('../config');

var student = {
  name: 'diego',
  email: 'diego.prieto.torres@hotmail.com'
}
var sqsAttributes = {
  MailType: { DataType: 'String', StringValue: MailType.STUDENT_SIGN_UP.key },
  Mail: { DataType: 'String', StringValue: student.email }
};
SQSServices.sendMessage(config.queues.mailQueue, JSON.stringify(student), null, sqsAttributes);
*/

var data = {
  x_cust_id_cliente: '13529',
  x_ref_payco: '374136',
  x_id_factura: 'd1040e17-26c2-492a-86ad-63679892a592',
  x_id_invoice: 'd1040e17-26c2-492a-86ad-63679892a592',
  x_description: 'Servicio de AcompaÃ±amiento de TuProfe',
  x_amount: '304900',
  x_amount_country: '304900',
  x_amount_ok: '304900',
  x_tax: '0',
  x_amount_base: '0',
  x_currency_code: 'COP',
  x_bank_name: 'Banco de Pruebas',
  x_cardnumber: '457562*******0326',
  x_quotas: '12',
  x_respuesta: 'Aceptada',
  x_response: 'Aceptada',
  x_approval_code: '000000',
  x_transaction_id: '374136',
  x_fecha_transaccion: '2017-08-12 20:46:47',
  x_transaction_date: '2017-08-12 20:46:47',
  x_cod_respuesta: '1',
  x_cod_response: '1',
  x_response_reason_text: '00-Aprobada',
  x_errorcode: '00',
  x_franchise: 'VS',
  x_extra1: '',
  x_extra2: '',
  x_extra3: '',
  x_business: 'DIEGO ALFONSO PRIETO TORRES ',
  x_customer_doctype: 'CC',
  x_customer_document: '1020788372',
  x_customer_name: 'd',
  x_customer_lastname: 'p',
  x_customer_email: 'diego.prieto.torres@hotmail.com',
  x_customer_phone: '3156162527',
  x_customer_country: 'CO',
  x_customer_city: 'Bogota',
  x_customer_address: 'calle 186a 19 26',
  x_customer_ip: '186.145.175.64',
  x_signature: '11afa3f056d7f811f7d42009cf90f48a74a35baa481b1d56fa41c94a53909dc5',
  x_test_request: 'TRUE' };

  console.log(JSON.stringify(data));