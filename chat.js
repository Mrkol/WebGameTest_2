var _System = require("sys");
var _Server = require("./server.js");

var messageIDs = 0;

exports.chatQueue = [];

exports.processQuery = function(query, response)
{
	/*if(query.wipe == "")
	{
		exports.chatQueue = [];
        _System.puts("Anal wiped the whole thing: " + exports.chatQueue + "\n");
	}*/
	
	if(query.message)
	{
        var q = _Server.User.where('token').equals(unescape(query.token));

        q.exec(function(err, users) {
            if(err || (users.length == 0 && query.token != "")) return;
            var json = JSON.parse(query.message);
            json.messageID = messageIDs++;
            if(users.length != 0) json.username = users[0].username;
            else json.username = "Anonymous";
            exports.chatQueue.push(json);
            if(exports.chatQueue.length > 30) exports.chatQueue.shift();
            _System.puts(json.username + ": " + json.message + "\n");


            response.writeHeader(200, {"Content-Type": "text/plain"});
            response.write(JSON.stringify(exports.chatQueue));
            response.end();
        });
	}
    else
    {
        return JSON.stringify(exports.chatQueue);
    }

    return null;
}

/*

{
	"username": "";
	"message": "";
}

*/