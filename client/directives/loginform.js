application.directive('loginform', ['authorization', function(auth) {
    return {
        restrict: 'E',
        templateUrl: "/client/templates/loginForm.html",

        link: function($scope, element, attributes) {
            $scope.username = "";
            $scope.password = "";
            $scope.message = "";

            $scope.login = function() {
                auth.login($scope.username, $scope.password, function (success) {
                    if(!success)
                    {
                        $scope.message = "Login was unsuccessful";
                        $scope.password = "";
                    }
                    else
                    {
                        $scope.message = "";
                        $scope.username = "";
                        $scope.password = "";
                    }
                });
            }

            $scope.logout = function() {
                auth.logout();
            }

            $scope.register = function() {
                auth.register($scope.username, $scope.password, function (success) {
                    if(!success)
                    {
                        $scope.message = "Registration was unsuccessful";
                    }
                    else
                    {
                        $scope.message = "Registered successfully";
                    }
                });
            }

            $scope.state = function() {
                if(auth.token() == "")
                {
                    return 0;
                }
                else
                {
                    return 1;
                }
            }

            $scope.getUsername = function() {
                return auth.username();
            }
        }
    }
}]);