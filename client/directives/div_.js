application.directive('div_', function() {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: '<div>\n    <div class="div_-wrap unselectable">\n        <div ng-transclude class="div_-content selectable">\n            \n        </div>\n        <div class="div_-scroll-wrap unselectable">\n            <input type="button" class="div_-scroller unselectable"/>\n        </div>\n    </div>\n</div>',
        link: function($scope, element, attributes) {
            var startY, initialMouseY;
            var scroll_wrap = angular.element(element.children('div')[0].children[1]);
            var scroller = angular.element(scroll_wrap.children('input')[0]);
            var wrap = angular.element(element.children('div')[0].children[0]);

            scroller.css('top', '0px');

            function applyScrolling()
            {
                wrap[0].scrollTop = (wrap[0].scrollHeight - wrap[0].clientHeight) * (parseInt(scroller.css('top'), 10) / (scroll_wrap[0].clientHeight - scroller[0].clientHeight));
            }

            $scope.scrollDown = function()
            {
                scroller.css('top', scroll_wrap[0].clientHeight - scroller[0].clientHeight);
                applyScrolling();
            }

            scroller.bind('mousedown', function($event) {
                startY = scroller.prop('offsetTop');
                initialMouseY = $event.clientY;
                angular.element(document).bind('mousemove', mousemove);
                angular.element(document).bind('mouseup', mouseup);
                return false;
            });

            function mousemove($event)
            {
                var dy = $event.clientY - initialMouseY;
                if(startY + dy <= 0)
                {
                    dy = -startY;
                }
                if(startY + dy >= scroll_wrap[0].clientHeight - scroller[0].clientHeight)
                {
                    dy = scroll_wrap[0].clientHeight - scroller[0].clientHeight - startY;
                }
                scroller.css({
                    top:  startY + dy + 'px'
                });
                applyScrolling();
                return false;
            }

            function mouseup()
            {
                angular.element(document).unbind('mousemove', mousemove);
                angular.element(document).unbind('mouseup', mouseup);
            }

            element.bind('wheel', function ($event)
            {
                var y = parseInt(scroller.css('top'), 10);
                var dy = ($event.deltaY > 0 ? 1 : -1) * Math.floor(scroll_wrap[0].clientHeight / 20);
                if(y + dy <= 0)
                {
                    dy = -y;
                }
                if(y + dy >= scroll_wrap[0].clientHeight - scroller[0].clientHeight)
                {
                    dy = scroll_wrap[0].clientHeight - scroller[0].clientHeight - y;
                }
                scroller.css({
                    top: (y + dy) + 'px'
                });
                applyScrolling();
            });

            var scrollH = scroll_wrap[0].clientHeight;
            angular.element(window).bind('resize', function ($event) {
                var delta = scroll_wrap[0].clientHeight / scrollH;
                var y = parseInt(scroller.css('top'), 10);
                var dy = (y * delta) - y;
                if(y + dy <= 0)
                {
                    dy = -y;
                }
                if(y + dy >= scroll_wrap[0].clientHeight - scroller[0].clientHeight)
                {
                    dy = scroll_wrap[0].clientHeight - scroller[0].clientHeight - y;
                }
                scroller.css({
                    top: (y + dy) + 'px'
                });
                scrollH = scroll_wrap[0].clientHeight;
            });
        }
    };
});