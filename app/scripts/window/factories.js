'use strict';

angular.module('windowModule',[])
    .factory('WindowHandler',['$window',function(w){

        var WindowHandler = {
            HORIZONTAL_SCREEN: 1,
            VERTICAL_SCREEN:   2,
            userResizeCallback: null,
            initialize: function() {
                var self = this;

                angular.element(w).on('resize', function(){
                    // scopeを更新
                    self.sizingEvent();
                });
                self.sizingEvent();
            },
            sizingEvent: function(){
                var self = this;
                
                self.windowHeight = window.innerHeight;
                self.windowWidth = window.innerWidth;

                if(typeof self.userResizeCallback === 'function') {
                    self.userResizeCallback();
                }
            },
            getCurrentScreen: function() {
                var self = this;
                if(self.windowWidth > self.windowHeight) {
                    return self.HORIZONTAL_SCREEN;
                }

                return self.VERTICAL_SCREEN;
            },
            isHorizontalScreen: function() {
                var self = this;
                return self.getCurrentScreen() === self.HORIZONTAL_SCREEN;
            },
            isVerticalScreen: function() {
                var self = this;
                return self.getCurrentScreen() === self.VERTICAL_SCREEN;
            },
            setResizeCallback: function(cb, $scope) {
                var self = this;
                self.userResizeCallback = cb;
                $scope.$apply();
            }
        };
        
        WindowHandler.initialize();

        return WindowHandler;
    }]);
