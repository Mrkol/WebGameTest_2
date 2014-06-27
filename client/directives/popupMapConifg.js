application.directive('popupMapConifg', ['$http', 'map', 'content', function($http, map, content) {
    return {
        restrict: 'E',
        templateUrl: "/client/templates/popupMapConfig.html",
        scope: {},
        link: function ($scope, element, attributes) {
            var startY, initialMouseY;
            var startX, initialMouseX;

            $scope.posX = (document.body.clientWidth / 2) - (element[0].childNodes[0].clientWidth / 2);
            $scope.posY = (document.body.clientHeight / 2) - (element[0].childNodes[0].clientHeight / 2);
            $scope.name = map.map().name;
            $scope.packsServer = [];
            $scope.packsMap = [];

            $scope.$parent.$watch('showConfig', function () {
                if($scope.$parent.showConfig == true) $scope.onOpened();
            })

            $scope.toMap = function(i)
            {
                var t = $scope.packsServer.splice(i, 1);
                $scope.packsMap.push(t[0]);
            }

            $scope.fromMap = function(i)
            {
                var t = $scope.packsMap.splice(i, 1);
                $scope.packsServer.push(t[0]);
            }

            $scope.getMap = function()
            {
                return map.map();
            }

            $scope.show = function()
            {
                return $scope.$parent.showConfig;
            }

            $scope.done = function()
            {
                map.map().name = $scope.name;
                if(!map.map().include.equals($scope.packsMap))
                {
                    map.map().include = $scope.packsMap.clone();
                    map.reload();
                }
                $scope.close();
            }

            $scope.close = function()
            {
                if(document.activeElement) document.activeElement.blur();
                $scope.$parent.showConfig = false;
            }

            $scope.onOpened = function()
            {
                $scope.name = map.map().name;

                $scope.packsMap = map.map().include.clone();
                $http.get('/content/packs.json').success(function(data) {
                    $scope.packsServer = data.filter(function(i) {
                        return $scope.packsMap.indexOf(i) == -1;
                    });
                });
            }

            $scope.startMoving = function($event)
            {
                if(document.elementFromPoint($event.clientX, $event.clientY).id != "popup-map-config") return false;
                startX = $scope.posX;
                startY = $scope.posY;
                initialMouseY = $event.clientY;
                initialMouseX = $event.clientX;
                angular.element(document).bind('mousemove', mousemove);
                angular.element(document).bind('mouseup', mouseup);
                return false;
            };

            function mousemove($event)
            {
                var dx = $event.clientX - initialMouseX;
                var dy = $event.clientY - initialMouseY;
                $scope.$apply(function () {
                    $scope.posX = startX + dx;
                    $scope.posY = startY + dy;
                });
                return false;
            }

            function mouseup()
            {
                angular.element(document).unbind('mousemove', mousemove);
                angular.element(document).unbind('mouseup', mouseup);
            }
        }
    }
}]);