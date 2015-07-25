var express = require('express');
var fs = require('fs');
var Q = require('q');

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static('public'))

app.get('/', function (req, res) {
    // get available .jade files for projects
    var available_projs = fs.readdirSync('./projects'); // remove Sync? do promise or callback?
    available_projs = available_projs.filter(function(filename) {
        var re = new RegExp('\.json$');
        return filename.match(re);
    });

    var readers = [];
    for (p of available_projs) {
        readers.push(Q.nfcall(fs.readFile, 'projects/' + p, { encoding: 'utf-8'} ));
    }

    Q.allSettled(readers).then(function (results) {
        var projects = []
        for (p of results) {
            if (p.state == 'fulfilled') {
                try {
                    projects.push(JSON.parse(p.value));
                } catch(err) {
                    //projects.push("error", err);
                }
            }
        }
        return projects;
    }).then(function(projects) {
        console.log(projects);
        res.render('home', { "projects": projects });
    });
/*
    // returns a promise of template rendering
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
    });*/
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
