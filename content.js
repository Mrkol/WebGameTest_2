var _System = require('sys');
var _Server = require('./server.js');
var _Path = require('path');
var _FileSystem = require('fs');
var _Mkdirp = require('mkdirp');

exports.processQuery = function(query, response)
{
    if(!query.act) return "";

    switch(query.act)
    {
        case 'save':
            if(!query.token || !query.map || !query.name) return "";

            var q = _Server.User.where('token').equals(unescape(query.token));

            q.exec(function(err, users) {
                if(err || users.length == 0)
                {
                    response.writeHeader(200, {"Content-Type": "text/plain"});
                    response.write("failure");
                    response.end();
                    return;
                }

                var bd = process.cwd() + '/content/' + users[0].username;

                _Mkdirp.sync(bd);

                if(_FileSystem.existsSync(bd + '/' + query.name))
                {
                    _FileSystem.unlinkSync(bd + '/' + query.name);
                }
                _FileSystem.appendFileSync(bd + '/' + query.name, query.map);

                response.writeHeader(200, {"Content-Type": "text/plain"});
                response.write("success");
                response.end();
            });
            break;

        case 'list':
            if(!query.token) return "";

            var q = _Server.User.where('token').equals(unescape(query.token));

            q.exec(function(err, users) {
                if(err || users.length == 0)
                {
                    response.writeHeader(200, {"Content-Type": "text/plain"});
                    response.write("failure");
                    response.end();
                    return;
                }

                var bd = process.cwd() + '/content/' + users[0].username;

                _Mkdirp.sync(bd);

                var files = _FileSystem.readdirSync(bd);

                response.writeHeader(200, {"Content-Type": "text/plain"});
                response.write(JSON.stringify(files));
                response.end();
            });
            break;

        default:
            return "";
    }

    return null;
}

/*
{
    "name": "",
    "width": "",
    "height": "",
    "offsetX": "",
    "offsetY": "",

    "include":
    [
        "std"
    ]

    "tiles":
    [
        [[<ID>, <ADDITIONAL INFO>], [], []],
        [[], [], []],
        [[], [], []]
    ],

    "custom":
    {
        "blocks":
        [
            {
                "name": "",
                ""
            },
        ]
    }
}
 */