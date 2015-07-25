var express = require('express');
var fs = require('fs');
var Q = require('q');

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static('public'))

app.get('/', function (req, res) {
    // get available .jade files for projects
    var available_projs = fs.readdirSync('./views/projects'); // remove Sync? do promise or callback?
    available_projs = available_projs.filter(function(filename) {
        var re = new RegExp('\.jade$');
        return filename.match(re);
    });

    available_thumbs = available_projs.filter(function(filename) {
        var re = new RegExp('^thumb_');
        return filename.match(re);
    });

    // returns a promise of template rendering
    render_defer = function (template) {
        var deferred= Q.defer();

        var re = new RegExp('-([\\w.-]+)\\.jade$');
        var name_matches = template.match(re) || [];
        // a valid page name was extracted from template name
        var project_name = name_matches[1] || null;

        app.render(template, { project: project_name }, function (err, html) {
            if (err != null) {
                deferred.reject(err);
            }
            deferred.resolve(html);
        });
        return deferred.promise;
    };

    // start rendering stuff
    var renders = [];
    available_thumbs.sort() // alphabeticaly
    for (thumb of available_thumbs) {
        renders.push(render_defer('projects/' + thumb));
    }

    Q.allSettled(renders).then(function (results) {
        var html = '';
        for (p of results) {
            if (p.state == 'rejected') {
                console.log('Error:', p.reason);
                continue;
            }
            if (p.value) html += p.value;
        }
        return html;
    }).then(function (data) {
        res.render('home', { html: data });
    });
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
