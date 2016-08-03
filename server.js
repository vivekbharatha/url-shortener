var fs = require('fs');
var path = require('path');

var express = require('express');
var app = new express();

var shortid = require('shortid');
var jsonfile = require('jsonfile');

// As only 2 callbacks not using async
fs.stat(path.join(__dirname, 'data'), function (err, stat) {
    if (err) {
         fs.mkdir(path.join(__dirname, 'data'), function () {
            console.log('data folder created');
            jsonfile.writeFile(dataFile, {}, {spaces: 2}, function (err) {
                    if (err) {
                        console.log('error in creating data.json file', err);
                    } else {
                        console.log('data.json created');
                    }
                });
        });
    } else {
        fs.stat(path.join(__dirname, 'data', 'data.json'), function (err, stat) {
            if (err) {
                jsonfile.writeFile(dataFile, {}, {spaces: 2}, function (err) {
                    if (err) {
                        console.log('error in creating data.json file', err);
                    } else {
                        console.log('data.json created');
                    }
                });
            } else {
                console.log('data.json exists');
            }
        });
        console.log('data folder exists');
    }
});

var dataFile = path.join(__dirname, 'data', 'data.json');

app.get('/:id', function (req, res, next) {
   var id = req.params.id;
   
   jsonfile.readFile(dataFile, function (err, db) {
        if (err) {
            console.log('Error on reading the data file', err);
            return res.json({ error: 'Oops!, my bad there was an error. Please try again' });
        }
        var short_url = db[id];
        if (short_url) {
            return res.redirect(short_url.original_url);
        } else {
            return res.json({ error: 'Invalid short url' });
        }
    });
});

app.get('/new/:url*', function (req, res, next) {
    var url = req.params.url + req.params[0]; // to get slashes as a single string
    var urlValidator = new RegExp('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$');
    
    if(!urlValidator.test(url)) {
        console.log(url, 'Invalid url');
        return res.json({"error":"Wrong url format, make sure you have a valid protocol and real site."});
    }
    var id = shortid.generate();
    
    console.log('new url to short : ', url);
    
    var newObj = {
        original_url: url,
        short_url: req.protocol + '://' + req.hostname + '/' + id
    };
    
    jsonfile.readFile(dataFile, function (err, db) {
        if (err) {
            console.log('Error on reading the data file', err);
            return res.json({ error: 'Oops!, my bad there was an error. Please try again' });
        }
        
        db[id] = newObj
        
        jsonfile.writeFile(dataFile, db, {spaces: 2}, function (err) {
            if (err) return res.json({ error: 'Oops!, my bad there was an error. Please try again' });
            return res.json(newObj);
        });
    });
});

app.get('/')

var port = process.env.PORT || 8080;

app.listen(port, function () {
   console.log('Spined at port: ' + port); 
});