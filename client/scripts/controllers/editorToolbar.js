application.controller('EditorToolbarCtrl', ['$scope', 'content', 'map', function($scope, content, map) {



    $scope.toolbarButton = function(b)
    {
        if(document.activeElement) document.activeElement.blur();
        switch (b)
        {
            case 'save':
                map.save();
                break;

            case 'config':
                $scope.$parent.showConfig = true;
                break;

            case 'load':
                $scope.$parent.showLoad = true;
                break;

            case 'exit':
                window.location.hash = '#/mainmenu';
                break;
        }
    }

    $scope.getSelectionTiles = function ()
    {
        return content.tiles();
    }

    $scope.getSelectionImage = function (id)
    {
        return content.image(id).src;
    }

    $scope.selectTile = function (id)
    {
        $scope.$parent.currentTile = id;
    }

    $scope.mouseOverTile = function(id)
    {
        if(id != $scope.$parent.selectedTile)
        {
            $scope.$parent.selectedTile = id;
        }
        else
        {
            $scope.selectTile(id);
        }
    }

    $scope.getTileSelectionWidth = function(id)
    {
        return document.getElementsByClassName('toolbar-tile-select')[0].clientWidth;
    }

    $scope.getOpacity = function(i, j)
    {
        return (5 - Math.abs(i - j)) / 5;
    }
}]);
