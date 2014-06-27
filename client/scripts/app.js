var application = angular.module('mainModule', ['ngRoute', 'ngCookies', 'ngAnimate']);


application.controller('GlobalAppCtrl', ['$scope', function ($scope) {
    $scope.loadingProgress = 0;
    $scope.previousView = '';

    $scope.$watch('loadingProgress', function (nvalue, ovalue) {
        if(ovalue == 0 && nvalue > 0)
        {

        }
    });
}]);


application.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/mainmenu', {
            templateUrl: '/client/templates/mainmenu.html'
        })
        .when('/editor', {
            templateUrl: '/client/templates/editor.html',
            controller: 'ViewEditorCtrl'
        })
        .when('/ingame', {
            templateUrl: '/client/templates/ingame.html',
            controller: 'ViewIngameCtrl'
        })
        .when('/pregame', {
            templateUrl: '/client/templates/pregame.html'
        })
        .when('/loading', {
            templateUrl: '/client/templates/loading.html'
        })
        .when('/test', {
            templateUrl: '/client/templates/test.html'
        })
        .otherwise({
            redirectTo: '/mainmenu'
        })
}]);