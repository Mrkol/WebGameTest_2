application.controller('ViewIngameCtrl', ['$scope', '$http', 'content', 'map', function($scope, $http, content, map) {

    $scope.image_background_0 = new Image();
    $scope.image_background_0.src = '/client/resources/default_background.png';

    $scope.canvas = document.getElementById('ingame-canvas');

    $scope.canvas.width = $scope.canvas.clientWidth;
    $scope.canvas.height = $scope.canvas.clientHeight;

    $scope.cameraX = 0;
    $scope.cameraY = 0;
    $scope.cameraZoom = 1;


    $scope.drawLoop = function()
    {
        var ctx = $scope.canvas.getContext("2d");

        $scope.canvas.width = $scope.canvas.width;
        ctx.clearRect (0, 0, $scope.canvas.width, $scope.canvas.height);

        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;

        ctx.drawImage($scope.image_background_0, 0, 0, $scope.canvas.width, $scope.canvas.height);

        ctx.save();
        {
            ctx.translate($scope.canvas.clientWidth / 2, $scope.canvas.clientHeight / 2);
            ctx.scale($scope.cameraZoom, $scope.cameraZoom);
            ctx.translate(-$scope.cameraX, -$scope.cameraY);

            $scope.drawMap(ctx);
        }
        ctx.restore();

        requestAnimFrame($scope.drawLoop, $scope.canvas);
    }

    $scope.drawMap = function(ctx)
    {
        ctx.save();
        {
            for (var i = Math.max(Math.floor(($scope.cameraX - ($scope.canvas.clientWidth / 2 / $scope.cameraZoom)) / 32), -map.map().offsetX); i < Math.min(Math.ceil(($scope.cameraX + ($scope.canvas.width - ($scope.canvas.clientWidth / 2)) / $scope.cameraZoom) / 32), map.map().width - map.map().offsetX); i++)
            {
                if (!map.map().tiles[i + map.map().offsetX]) continue;
                for (var j = Math.max(Math.floor(($scope.cameraY - ($scope.canvas.clientHeight / 2 / $scope.cameraZoom)) / 32), -map.map().offsetY); j < Math.min(Math.ceil(($scope.cameraY + ($scope.canvas.height - ($scope.canvas.clientHeight / 2)) / $scope.cameraZoom) / 32), map.map().height - map.map().offsetY); j++)
                {
                    if (!map.map().tiles[i + map.map().offsetX][j + map.map().offsetY]) continue;

                    var id = map.map().getTile(i, j);
                    ctx.fillStyle = "#00FF00";
                    if (id)
                    {
                        var tile = content.tile(id);
                        if (tile)
                        {
                            var img = content.image(tile.graphic[0]);
                            //ctx.fillRect(i * 32, j * 32, 32, 32);
                            ctx.drawImage(img, i * 32, j * 32, 32, 32);
                        }
                    }
                }
            }
        }
        ctx.restore();
    }

    angular.element(window).bind('resize', function ($event) {
        $scope.canvas.width = $scope.canvas.clientWidth;
        $scope.canvas.height = $scope.canvas.clientHeight;
    });


    $scope.drawLoop();
}]);