// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
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
