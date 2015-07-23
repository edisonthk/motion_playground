(function() {

'use strict';

/**
 * @ngdoc function
 * @name motionPlaygroundApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the motionPlaygroundApp
 */

function Bike(ScrollPlayer) {
    var self = this,
        height = 100,
        width = 100
        ;
    
    self.move = function(x,y) {
        ScrollPlayer.play(0, x, y,width,height);

    }
}

function bikeCtrl(ScrollPlayer,WindowHandler,Helper) {

    var self = this,
        frames = ["assets/bike/bike.png"],
        bike = new Bike(ScrollPlayer, WindowHandler)
    ;

    self.trailStyles = {
        bottom: "0",
        position: "absolute",
    };
    
    self.cnt = 0;
    self.fun = false;

    var framesLoadedEvent = function() {
        console.log("framesLoadedEvent");
        self.initial = false;  
        bike.move(0, WindowHandler.windowHeight - 150);
    };

    var initialize = function() {
        self.initial = true;
        self.show = false;
        self.trailStyles.height = "50px";
    };

    var funEventTriggle = function() {
        self.fun = true;
        ScrollPlayer.setScrollLayerHeight(0);

        console.log("fun");
        bike.move(0, WindowHandler.windowHeight - 100);
    };

    var scrollEvent = function(offsetTop) {
        if(self.fun) {
            return;
        }

        if(offsetTop > WindowHandler.windowHeight - 100) {
            funEventTriggle();
        }else if(offsetTop > 50) {
            self.trailStyles.height = offsetTop+"px";    
            bike.move(0, WindowHandler.windowHeight - offsetTop - 100);

        }else{
            bike.move(0, WindowHandler.windowHeight - 150);
        }
    };

    self.reset = function() {
        self.show = false;
        ScrollPlayer.reset();
    }

    ScrollPlayer.setFullScreen(false);
    ScrollPlayer.setScrollLayerHeight(1800);
    
    ScrollPlayer.setFrames(frames);
    ScrollPlayer.setLoadedCallback(framesLoadedEvent);
    ScrollPlayer.setScrollEvent(scrollEvent);
    ScrollPlayer.ready();

    initialize();
}

angular.module('motionPlaygroundApp.bike',['ngAnimate'])
  
  .controller('bikeCtrl', ['ScrollPlayer','WindowHandler','Helper',bikeCtrl]);

})();
