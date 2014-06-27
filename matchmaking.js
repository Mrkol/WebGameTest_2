var _System = require("sys");

/*
    {
        id: ,
        name: ,
        players: []
    }
 */

var lastLobbyId = 0;

exports.lobbies = [];

exports.processQuery = function(query, response)
{
    if(query.create_lobby)
    {
        var json0 = JSON.parse(query.create_lobby);

        exports.lobbies[lastLobbyId] = {
            id: lastLobbyId++,
            name: json0.name,
            players: []
        };
    }

    if(query.join_lobby)
    {
        var json1 = JSON.parse(query.join_lobby);

        if(exports.lobbies[json1.id] != null)
        {
            exports.lobbies[json1.id].players.push(json1.username);
        }
    }

    if(query.leave_lobby)
    {
        var json2 = JSON.parse(query.leave_lobby);

        if(exports.lobbies[json2.id] != null)
        {
            var i = exports.lobbies[json2.id].players.indexOf(json2.username);
            if(i > -1)
            {
                exports.lobbies[json2.id].players.splice(i, 1);
            }

            if(exports.lobbies[json2.id].players.length <= 0)
            {
                exports.lobbies[json2.id] = null;
            }
        }
    }



    return JSON.stringify(exports.lobbies);
}