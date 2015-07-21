var express = require('express');
var fs = require('fs');
var Q = require('q');

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
        return filename.match(re);
    });


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

    var renders = [ render_defer('projects/berserkore'), render_defer('projects/amir-x') ];
    Q.allSettled(renders).then(function (data) {
        var html = '';
        for (d of data) {
            html += d.value;
        }
        res.send(html);
    });
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Listening at %s:%s", host, port);
});
