application.factory('content', ['$http', function ($http) {
    var packs = [];
    var tiles = [];
    var images = [];

    var lastTileId = 1;

    var update = function()
    {
        tiles = [];
        images = [];
        lastTileId = 1;

        for(var i = 0; i < packs.length; i++)
        {
            var pack = packs[i];

            for(var image in pack.custom.images)
            {
                images[image] = new Image();

                images[image].src = pack.custom.images[image];
            }

            for(var j = 0; j < pack.custom.tiles.length; j++)
            {
                tiles[lastTileId] = pack.custom.tiles[j];
                lastTileId++;
            }
        }
    }


    return {
        /**
         * Loads a resource pack from the server.
         * @param name
         * The name of the pack to be loaded
         * @param callback
         * Callback to run after the loading is done
         */
        load: function(name, callback)
        {
            $http.get('/content/' + name + '/' + name + '.json').success(function (data) {
                packs.push(data);
                callback(name);
            });
        },

        /**
         * Unloads a resource pack with a specified name.
         * @param name
         */
        unload: function(name)
        {
            for(var i = 0; i < packs.length; i++)
            {
                var pack = packs[i];
                if(pack.name == name)
                {
                    delete packs.splice(i, 1);
                    break;
                }
            }
        },

        refresh: function()
        {
            update();
        },

        wipe: function()
        {
            for(var i = 0; i < packs.length; i++)
            {
                delete packs[i];
            }
            for(var i = 0; i < tiles.length; i++)
            {
                delete tiles[i];
            }
            for(var i = 0; i < images.length; i++)
            {
                delete images[i];
            }
            packs = [];
            tiles = [];
            images = [];
        },

        tile: function(id)
        {
            return tiles[id] ? tiles[id] : null;
        },

        tiles: function()
        {
            return tiles;
        },

        image: function(id)
        {
            return images[id] ? images[id] : null;
        }
    };
}]);