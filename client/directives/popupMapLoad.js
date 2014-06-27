application.directive('popupMapLoad', ['$http', 'map', 'authorization', '$timeout', function($http, map, auth, $timeout) {
    return {
        restrict: 'E',
        templateUrl: "/client/templates/popupMapLoad.html",
        scope: {},
        link: function ($scope, element, attributes) {
            var startY, initialMouseY;
            var startX, initialMouseX;

            $scope.posX = (document.body.clientWidth / 2) - (element[0].childNodes[0].clientWidth / 2);
            $scope.posY = (document.body.clientHeight / 2) - (element[0].childNodes[0].clientHeight / 2);

            $scope.mapList  = [];

            $scope.selected = 0;

            $scope.$parent.$watch('showLoad', function () {
                if($scope.$parent.showLoad == true) $scope.onOpened();
            })

            $scope.show = function() {
                return $scope.$parent.showLoad;
            }

            $scope.done = function()
            {
                window.location.hash = '#/loading';
                $timeout(function () {
                    map.load($scope.mapList[$scope.selected]);
                    $scope.close();
                }, 500);
                $timeout(function () {
                    window.location.hash = '#/editor';
                }, 1500);
            }

            $scope.close = function()
            {
                if(document.activeElement) document.activeElement.blur();
                $scope.$parent.showLoad = false;
            }

            $scope.onOpened = function()
            {
                $http.get('/content.js?act=list&token=' + encodeURIComponent(auth.token())).success(function (data) {
                    if(!data || data == 'failure') return;

                    $scope.mapList = data;
                    $scope.selected = $scope.mapList.indexOf(map.map().name) != -1 ? $scope.mapList.indexOf(map.map().name) : 0;
                });
            }

            $scope.select = function(i)
            {
                $scope.selected = i;
            }

            $scope.update = function()
            {
                $http.get('/content.js?act=list&token=' + encodeURIComponent(auth.token())).success(function (data) {
                    if(!data || data == 'failure') return;

                    $scope.mapList = data;
                });
            }

            $scope.startMoving = function($event)
            {
                if(!document.elementFromPoint($event.clientX, $event.clientY).classList.contains("popup-map-load")) return false;
                startX = $scope.posX;
                startY = $scope.posY;
                initialMouseY = $event.clientY;
                initialMouseX = $event.clientX;
                angular.element(document).bind('mousemove', mousemove);
                angular.element(document).bind('mouseup', mouseup);
                return false;
            }

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