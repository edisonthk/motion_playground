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
    var self = this
        ;
    
    // constant
    self.height = 183;
    self.width = 284;
    self.funAnimationInterval = 300;


    self.frames = [];
    self.currentFrame = 0;
    self.crashAnimationIntervalId = null;

    self.setCrashFrames = function(frames) {
        self.frames = frames;
    }

    self.move = function(x,y) {
        ScrollPlayer.play(0, x, y,self.width,self.height);
    }

    self.crash = function(x,y) {
        clearInterval(self.crashAnimationIntervalId);
        self.currentFrame = 0;

        self.crashAnimationIntervalId = setInterval(function() {
            if(self.currentFrame >= self.frames.length) {
                clearInterval(self.crashAnimationIntervalId);
                return;
            }

            ScrollPlayer.play(self.currentFrame, x, y,self.width,self.height);
            self.currentFrame ++;
        }, self.funAnimationInterval);
    }
}

function bikeCtrl(ScrollPlayer,WindowHandler,Helper) {

    var self = this,
        frames = [],
        bike = new Bike(ScrollPlayer, WindowHandler)
    ;

    self.trailStyles = {
        bottom: "0",
        position: "absolute",
    };

    // set crash frames
    for (var i = 1; i <= 6; i++) {
        frames.push("assets/bike/bike"+Helper.leadingZeroString(3,i)+".png");
    };
    bike.setCrashFrames(frames);

    
    self.funEventIntervalId = null;
    self.currentFrame = 0;
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

        bike.crash(0, 0);
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
        self.currentFrame = 0;
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
