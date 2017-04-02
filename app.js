var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

app.get('/', function(req, res){
    res.send('works');
});

app.listen(port, function(){
    console.log('App is running in port: ' + port);
});