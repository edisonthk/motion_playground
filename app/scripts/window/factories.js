'use strict';

angular.module('windowModule',[])
    .factory('WindowHandler',['$window', function(w){

        var WindowHandler = {
            HORIZONTAL_SCREEN: 1,
            VERTICAL_SCREEN:   2,
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
        };
        
        WindowHandler.initialize();

        return WindowHandler;
    }]);
