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

