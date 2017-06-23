
// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
var helper = require('sendgrid').mail;
var fromEmail = new helper.Email('test@example.com');
var toEmail = new helper.Email('diego.alfonso.prieto.torres@gmail.com');
var subject = 'Sending with SendGrid is Fun';
var content = new helper.Content('text/plain', 'and easy to do anywhere, even with Node.js');
var mail = new helper.Mail(fromEmail, subject, toEmail, content);

var sg = require('sendgrid')('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');
var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON()
});

sg.API(request, function (error, response) {
  if (error) {
    console.log('Error response received');
  }
  console.log(response.statusCode);
  console.log(response.body);
  console.log(response.headers);
});

/*
var sg = require('sendgrid')('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');
var helper = require('sendgrid').mail;
var fromEmail = new helper.Email('test@example.com');
var toEmail = new helper.Email('diego.alfonso.prieto.torres@gmail.com');
subject = "Dummy Subject"
content = new helper.Content("text/html", "dummy content")
mail = new helper.Mail(fromEmail, subject, toEmail, content)

substitution = new helper.Substitution("%name%", "User's Name")
mail.personalizations[0].addSubstitution(substitution)
mail.setTemplateId('3f43307c-ead4-4e56-844f-f3dd85029000')
var requestBody = mail.toJSON()
var requestPost = JSON.parse(JSON.stringify(sg.emptyRequest()))
requestPost.method = 'POST'
requestPost.path = '/v3/mail/send'
requestPost.body = requestBody
sg.API(requestPost, function (error, response) {
  if (error) {
    console.log('Error response received');
    console.log(error);
  }
  console.log(response.statusCode)
  console.log(response.body)
  console.log(response.headers)
})
*/