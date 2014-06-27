

application.controller('ChatCtrl', ['$scope', '$http', 'authorization', function ($scope, $http, auth) {
    $scope.messages = [];

    $scope.$evalAsync(function() {
        $scope.scrollDown();
    });

    $scope.refreshChat = function(text)
    {
        $http.get('/chat.js?' + text).success(function (data) {
            $scope.messages = $scope.messages.concat(data.filter(function(i) {
                var b = true;
                for(var m in $scope.messages)
                {
                    if($scope.messages[m].messageID == i.messageID) b = false;
                }
                return b;
            }));
            setTimeout(function() {
                /*var wrap = document.getElementById("messagesWrap").firstElementChild;
                wrap.firstElementChild.scrollTop = wrap.scrollHeight - wrap.clientHeight;
                angular.element(wrap.lastElementChild.firstElementChild).css('top',  wrap.lastElementChild.clientHeight - wrap.lastElementChild.firstElementChild.clientHeight);*/
                $scope.$evalAsync(function() {
                    $scope.scrollDown();
                });
            }, 10);
        });
    }

    $scope.sendMessage = function()
    {
        var text = document.getElementById("chatTextbox");

        if(text.value == "") return;

        var stext = "token=" + encodeURIComponent(auth.token()) + "&message={\"message\":\"" + encodeURIComponent(text.value) + "\"}"

        $scope.refreshChat(stext);

        text.value = "";
    }


    $scope.textboxKeypress = function($event)
    {
        if($event.which === 13)
        {
            $scope.sendMessage();
            return true;
        }

        return false;
    }

    $scope.refreshChat('');

    setInterval(function()
    {
        $scope.$apply(function() {
            $scope.refreshChat('');
        });
    }, 5000)
}])





