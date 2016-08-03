var express = require('express');
var app = new express();

app.get('/new/:url', function (req, res, next) {
    var resJson = {
        original_url: '',
        short_url: ''
    };
    
    
    return res.json(resJson);
});

var port = process.env.PORT || 8080;

app.listen(port, function () {
   console.log('Spined at port: ' + port); 
});