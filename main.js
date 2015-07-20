var express = require('express');
var fs = require('fs');

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.render('base');
});

app.get('/:proj', function (req, res) {
    var proj = req.params.proj || '';

    // get available .jade files for projects
    var available_projs = fs.readdirSync('./views/projects');
    available_projs = available_projs.filter(function(filename) {
        var re = new RegExp('\.jade$');
        //return filename.endsWith('.jade');
        return filename.match(re);
    });

    res.render('projects/berserkore', { debug: available_projs });
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Listening at %s:%s", host, port);
});

/*
exports.init = function() {
    console.log("hi!");
}
*/
