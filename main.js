var express = require('express');
var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.render('base');
});

app.get('/:proj', function (req, res) {
    var proj = req.params.proj || '';
    res.render('projects/berserkore', { });
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
