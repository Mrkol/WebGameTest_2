application.factory('authorization', ['$http', '$cookies', function ($http, $cookies) {
    var authorizationToken = "";
    var username = "";

    if($cookies.authorizationToken && $cookies.username)
    {
        $http.get('/authorization.js?act=check&username=' + $cookies.username + '&token=' + encodeURIComponent($cookies.authorizationToken)).success(function (data) {
            if(!data || data == 'false') return;
            authorizationToken = $cookies.authorizationToken;
            username = $cookies.username;
        });
    }

    return  {
        /**
         * Attempts to authorize to the server with specified user data.
         * @param l
         * The username
         * @param p
         * The password
         * @param f
         * A callback function, which is needed due to $http.get being async.
         */
        login: function (l, p, f) {
            $http.get('/authorization.js?act=login&username=' + l + '&password=' + hex_md5(p)).success(function (data) {
                if(data != "" && data != "failure")
                {
                    authorizationToken = data;
                    username = l;
                    $cookies.authorizationToken = data;
                    $cookies.username = l;
                    f(true);
                    return;
                }
                f(false);
            });
        },

        /**
         * Attempts to register a new user on the server with specified data.
         * @param l
         * The username
         * @param p
         * The password
         * @param f
         * A callback function, which is needed due to $http.get being async
         */
        register: function (l, p, f) {
            if(!l || !p) return;
            $http.get('/authorization.js?act=register&username=' + l + '&password=' + hex_md5(p)).success(function (data) {
                if(data != "" && data != "failure")
                {
                    f(true);
                    return;
                }
                f(false);
            });
        },

        /**
         * Attempts to log out of the server.
         */
        logout: function () {
            $http.get('/authorization.js?act=logout&token=' + encodeURIComponent(authorizationToken)).success(function (data) {
                if(data != "" && data != "failure")
                {
                    username = "";
                    authorizationToken = "";

                    delete $cookies.authorizationToken;
                    delete $cookies.username;
                }
            });
        },

        /**
         * Gets the current user login token.
         * @returns {string}
         * The token
         */
        token: function () {
            return authorizationToken;
        },

        /**
         * Gets the current user's username.
         * @returns {string}
         * The username
         */
        username: function() {
            return username;
        }
    }
}]);