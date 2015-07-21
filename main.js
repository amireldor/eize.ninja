var express = require('express');
var fs = require('fs');
var Q = require('q');

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static('public'))

app.get('/', function (req, res) {
    // get available .jade files for projects
    var available_projs = fs.readdirSync('./views/projects');
    available_projs = available_projs.filter(function(filename) {
        var re = new RegExp('\.jade$');
        return filename.match(re);
    });

    // returns a promise when the rendering finished
    render_defer = function (template) {
        var deferred= Q.defer();
        app.render(template, function (err, html) {
            if (err != null) {
                deferred.reject(err);
            }
            deferred.resolve(html);
        });
        return deferred.promise;
    };

    var renders = [ render_defer('projdcts/thumb_berserkore'), render_defer('projects/thumb_amir-x') ];
    Q.allSettled(renders).then(function (results) {
        var html = '';
        for (d of results) {
            if (d.value) html += d.value;
        }
        return html;
    }).then(function (data) {
        res.render('home', { html: data });
    });;
});

app.get('/:proj', function (req, res) {
    var proj = req.params.proj || '';

    res.send('not yet');
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Listening at %s:%s", host, port);
});
