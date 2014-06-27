application.factory('map', ['$http', 'authorization', 'content', function ($http, auth, content) {
    var map = new Map();

    var reload = function()
    {
        content.wipe();
        var loaded = [];
        for (var i = 0; i < map.include.length; i++)
        {
            content.load(map.include[i], function(n) {
                loaded[map.include.indexOf(n)] = true;
                var b = true;
                for(var j = 0; j < map.include.length; j++)
                {
                    if(loaded[j] != true) b = false;
                }
                if(b)
                {
                    content.refresh();
                }
            });
        }

    }

    return {
        load: function(name) {
            if(!auth.username) return;
            $http.get('/content/' + auth.username() + '/' + name).success(function (data) {
                content.wipe();

                map = new Map();
                map.name = data.name;
                map.height = data.height;
                map.width = data.width;
                map.offsetX = data.offsetX;
                map.offsetY = data.offsetY;
                map.tiles = data.tiles;
                map.include = data.include.clone();

                reload();
            });
        },

        save: function() {
            $http.get('/content.js?act=save&token=' + encodeURIComponent(auth.token()) + '&map=' + encodeURIComponent(JSON.stringify(map)) + '&name=' + encodeURIComponent(map.name)).success(function (data) {
                if(!data || data == 'failure') return;
                var pup = document.getElementById('popup-map-save-info');
                if(pup)
                {
                    pup.attributes['show'].value = 'true';
                }
            });
        },

        reload: function() {
            reload();
        },

        clear: function() {
            map = new Map();
        },

        map: function() {
            return map;
        }
    }
}]);