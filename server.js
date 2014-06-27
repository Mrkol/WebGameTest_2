var _System = require('sys');
var _Http = require('http');
var _Url = require('url');
var _Path = require('path');
var _FileSystem = require('fs');
var _Utility = require('./util.js');
var _Mongo = require('mongoose');
var _Mime = require('mime');

_Mongo.connect('mongodb://localhost/authorization');

var database = _Mongo.connection;
database.on('error', console.error.bind(console, 'Connection error: '));
database.once('open', function callback () {
    _System.puts("Connected to DB successfully.\n");
    var userSchema = _Mongo.Schema({
        username: { type: String, index: { unique: true, dropDups: true } },
        password: String,
        token: String
    });
    exports.User = _Mongo.model('User', userSchema);
});

var server = _Http.createServer();
server.on('request', function(request, response) 
{
	var parsedUrl = _Url.parse(request.url, true);
	var fullPath = _Path.join(process.cwd(), parsedUrl.pathname);

    if(parsedUrl.pathname == "/")
    {
        response.writeHead(301, {Location: '/client/index.html'});
        response.end();
        return;
    }

    _FileSystem.exists(fullPath, function(exists)
	{
		if(!exists)
		{
            _FileSystem.readFile(process.cwd() + '/client/404.html', "binary", function(err, file)
            {
                if(err)
                {
                    response.writeHeader(404, {"Content-Type": "text/plain"});
                    response.write('404 Not Found.');
                    response.end();
                }
                else
                {
                    response.writeHeader(404, {"Content-Type": _Mime.lookup('html')});
                    response.write(file, "binary");
                    response.end();
                }
            });
		}
		else
		{
			if(request.url.indexOf('?') != -1)
			{
				try
				{
					var file = require(fullPath);
					if(file && file.processQuery)
					{
						var data = file.processQuery(parsedUrl.query, response);
                        if(data != null)
                        {
                            response.writeHeader(200, {"Content-Type": "text/plain"});
                            response.write(data);
                            response.end();
                        }
					}
				}
				catch(e)
				{
					response.writeHeader(500, {"Content-Type": "text/plain"});	
					response.write("500 Internal Server Error\n");
					response.end();
				}
			}
			else
			_FileSystem.readFile(fullPath, "binary", function(err, file) 
			{
				if(err)
				{
					response.writeHeader(500, {"Content-Type": "text/plain"});
					response.write(err + "\n");
					response.end();
				}	
				else
				{
					response.writeHeader(200, {"Content-Type": _Mime.lookup(parsedUrl.pathname)});
					response.write(file, "binary");
					response.end();
				}
			});
		}
	});
});

server.listen(6113);