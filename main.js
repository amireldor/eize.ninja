var express = require('express');
var routes = require('./routes');
var config = require('./config');

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static('public'))
app.use(function (req, res, next) {
    // add root_url to all templates
    res.locals.root_url = config.root_url;
    next();
});

app.get('/', routes.home);
app.get('/me', routes.page);
app.get('/page/:page', routes.page);
app.get('/:proj', routes.project);

var server = app.listen(config.port, config.host, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Listening at %s:%s", host, port);
});
