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
        projects.sort(function (a, b) {
            if (a.weight < b.weight) return -1;
            return 1;
        });
        return projects;
    }).then(function(projects) {
        res.render('home', { "projects": projects });
    });
});

app.get('/:proj', function (req, res) {
    var proj = req.params.proj || res.send('no.');
    title = "2";
    html = "<h1>HIEL!"+proj+"</h1>";
    res.render('project', { "project_title": title, "html": html });
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Listening at %s:%s", host, port);
});
