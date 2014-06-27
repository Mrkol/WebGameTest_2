var _System = require('sys');
var _Crypto = require('crypto');
var _Server = require("./server.js");

exports.processQuery = function(query, response)
{
    if(!query.act) return "";

    switch(query.act)
    {
        case 'login':
            if(!query.username || !query.password) return "";

            var q = _Server.User.where('username').equals(query.username).where('password').equals(query.password);

            q.exec(function (err, users) {
                if(err || users.length == 0)
                {
                    response.writeHeader(200, {"Content-Type": "text/plain"});
                    response.write("failure");
                    response.end();
                    return;
                }

                var token = _Crypto.randomBytes(16);

                _Server.User.update({username: users[0].username}, {$set: {token: token.toString()}}, {upsert: true}, function(err){});


                response.writeHeader(200, {"Content-Type": "text/plain"});
                response.write("" + token.toString());
                response.end();
            });
            break;

        case 'logout':
            if(!query.token) return "";

            var q = _Server.User.where('token').equals(query.token);

            q.exec(function (err, users) {
                if(err || users.length == 0)
                {
                    response.writeHeader(200, {"Content-Type": "text/plain"});
                    response.write("failure");
                    response.end();
                    return;
                }

                _Server.User.update({username: users[0].username}, {$set: {token: ""}}, {upsert: true}, function(err){});


                response.writeHeader(200, {"Content-Type": "text/plain"});
                response.write("success");
                response.end();
            });
            break;

        case 'register':
            if(!query.username || !query.password) return "";

            var q = _Server.User.where('username').equals(query.username);

            q.exec(function (err, users) {
                if(err || users.length != 0)
                {
                    response.writeHeader(200, {"Content-Type": "text/plain"});
                    response.write("failure");
                    response.end();
                }
                else
                {
                    var u = new _Server.User({ username: query.username, password: query.password, token: ""});
                    u.save(function (err, user) {
                    });

                    response.writeHeader(200, {"Content-Type": "text/plain"});
                    response.write("success");
                    response.end();
                }
            });
            break;
        case 'check':
            if(!query.username || !query.token) return "";

            var q = _Server.User.where('username').equals(query.username).where('token').equals(query.token);

            q.exec(function (err, users) {
                if(err || users.length == 0)
                {
                    response.writeHeader(200, {"Content-Type": "text/plain"});
                    response.write("false");
                    response.end();
                }
                else
                {
                    response.writeHeader(200, {"Content-Type": "text/plain"});
                    response.write("true");
                    response.end();
                }
            });

            break;

        default:
            return "";
    }

    return null;
}