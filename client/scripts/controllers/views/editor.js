application.controller('ViewEditorCtrl', ['$scope', '$http', 'content', 'map', function($scope, $http, content, map) {

    $scope.image_background_0 = new Image();
    $scope.image_background_0.src = '/client/resources/default_background.png';

    $scope.canvas = document.getElementById('editor-canvas');

    $scope.canvas.width = $scope.canvas.clientWidth;
    $scope.canvas.height = $scope.canvas.clientHeight;

    $scope.cameraX = 0;
    $scope.cameraY = 0;
    $scope.cameraZoom = 1;

    $scope.showConfig = false;
    $scope.showLoad = false;

    $scope.currentTile = -1;
    $scope.eraseTile = false;

    $scope.selectedTile = 0;

    $scope.debug = false;

    var keyA = false;
    var keyW = false;
    var keyS = false;
    var keyD = false;
    var keyboardLoop = null;


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

            if ($scope.debug)
            {
                ctx.fillStyle = "transparent";
                ctx.strokeStyle = "#FF00FF";
                ctx.strokeRect(-map.map().offsetX * 32, -map.map().offsetY * 32, map.map().width * 32, map.map().height * 32);
            }
        }
        ctx.restore();
    }

    $scope.canvasClick = function ($event)
    {
        if(document.activeElement) document.activeElement.blur();
        $event.preventDefault();
        return true;
    }

    $scope.contextMenu = function ($event)
    {
        if(document.activeElement) document.activeElement.blur();
        $event.preventDefault();
        return true;
    }

    $scope.mousePressed = function ($event)
    {
        if($event.which == 1) $scope.eraseTile = false;
        if($event.which == 3) $scope.eraseTile = true;
        var x = Math.floor(($event.clientX - ($scope.canvas.clientWidth  / 2)) / (32 * $scope.cameraZoom) + ($scope.cameraX / 32));
        var y = Math.floor(($event.clientY - ($scope.canvas.clientHeight / 2)) / (32 * $scope.cameraZoom) + ($scope.cameraY / 32));

        if($scope.currentTile != -1)
        {
            map.map().setTile(x, y, $scope.eraseTile ? 0 : $scope.currentTile);
        }

        angular.element(document).bind('mousemove', $scope.mouseMove);
        angular.element(document).bind('mouseup', $scope.mouseReleased);
    }

    $scope.mouseReleased = function ($event)
    {
        angular.element(document).unbind('mousemove', $scope.mouseMove);
        angular.element(document).unbind('mouseup', $scope.mouseReleased);
    }

    $scope.mouseMove = function ($event)
    {
        var x = ($event.clientX - ($scope.canvas.clientWidth  / 2)) / ($scope.cameraZoom) + $scope.cameraX;
        var y = ($event.clientY - ($scope.canvas.clientHeight / 2)) / ($scope.cameraZoom) + $scope.cameraY;

        if($scope.currentTile != -1)
        {
            map.map().setTile(Math.floor(x / 32), Math.floor(y / 32), $scope.eraseTile ? 0 : $scope.currentTile);
        }

        $event.preventDefault();
    }

    angular.element(window).bind('resize', function ($event) {
        $scope.canvas.width = $scope.canvas.clientWidth;
        $scope.canvas.height = $scope.canvas.clientHeight;
    });

    $scope.keyPressed = function ($event)
    {
        if(document.activeElement && document.activeElement.tagName != 'BODY') return;
        switch($event.which)
        {
            case 65:
            case 37: //left
                keyA = true;
                break;
            case 87:
            case 38: //up
                keyW = true;
                break;
            case 68:
            case 39: //right
                keyD = true;
                break;
            case 83:
            case 40: //down
                keyS = true;
                break;
        }
    }

    $scope.keyReleased = function ($event)
    {
        if(document.activeElement && document.activeElement.tagName != 'BODY') return;
        switch($event.which)
        {
            case 65:
            case 37: //left
                keyA = false;
                break;
            case 87:
            case 38: //up
                keyW = false;
                break;
            case 68:
            case 39: //right
                keyD = false;
                break;
            case 83:
            case 40: //down
                keyS = false;
                break;
        }
    }

    $scope.mouseWheel = function ($event)
    {
        var d = 0;
        if($event.deltaY > 0)
        {
            d = 0.9;
        }
        else
        {
            d = 1.1;
        }
        $scope.cameraZoom *= d;
    }


    angular.element($scope.canvas).bind('wheel', $scope.mouseWheel);
    angular.element(document).bind("keydown", $scope.keyPressed);
    angular.element(document).bind("keyup", $scope.keyReleased);
    keyboardLoop = setInterval(function () {
        if(keyA) $scope.cameraX -= 10 / $scope.cameraZoom;
        if(keyW) $scope.cameraY -= 10 / $scope.cameraZoom;
        if(keyS) $scope.cameraY += 10 / $scope.cameraZoom;
        if(keyD) $scope.cameraX += 10 / $scope.cameraZoom;
    }, 1);

    $scope.drawLoop();
}]);