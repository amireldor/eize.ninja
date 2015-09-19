var express = require('express');
var routes = require('./routes');
var config = require('./config');

var app = express();
var router = express.Router();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static('public'))
app.use(function (req, res, next) {
    // add root_url to all templates
    res.locals.root_url = config.root_url;
    next();
});
app.use(router);

router.get('/', routes.home);
router.get('/me', routes.page);
router.get('/page/:page', routes.page);
router.get('/:proj', routes.project);

var server = app.listen(config.port, config.host, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Listening at %s:%s", host, port);
});
