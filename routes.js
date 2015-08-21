var fs = require('fs');
var Q = require('q');
var marked = require('marked');

// homepage
exports.home = function (req, res) {
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
}

// project page
exports.project = function (req, res) {
    var proj = req.params.proj;

    var _readFile = function (filename) {
        var defer = Q.defer();
        fs.readFile(filename, function (err, data) {
            if (err) {
                defer.reject(err);
                return;
            }
            defer.resolve(data);
        });
        return defer.promise;
    }

    Q.all([
        _readFile('projects/' + proj + '.json', { "encoding": "utf-8" }),
        _readFile('projects/markdown/' + proj + '.md', { "encoding": "utf-8" })
    ]).then(function(values) {
        var title, html;
        try {
            var meta = JSON.parse(values[0]);
            title = meta.title;
        } catch(err) {
            title = proj;
        }
        html = marked(String(values[1]));

        var vars = {
            "project_title": title,
            "html": html,
            "thumbnail": meta.image,
            "screenshots": meta.screenshots || null
        }

        res.render('project', vars);
    }).catch(function(err) {
        // TODO: error handilng!!@# FIX FXI
        res.render('sad');
    }).done();
}

// page page. a simple page that is...
exports.page = function (req, res) {
    var page = req.params.page || req.path.substr(1);
    res.end(page);
}
