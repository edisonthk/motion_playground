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
    self.funAnimationInterval = 1000/ 23;


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

function bikeCtrl(scope, ScrollPlayer,WindowHandler,Helper) {

    var self = this,
        frames = [],
        bike = new Bike(ScrollPlayer, WindowHandler)
    ;

    self.trailStyles = {
        bottom: "0",
        position: "absolute",
    };

    // set crash frames
    frames.push("assets/bike/bike"+Helper.leadingZeroString(3,0)+".jpg");        
    for (var i = 1; i <= 17; i++) {
        if(i < 7) {
            for (var j = 0; j < 10; j++) {
                frames.push("assets/bike/bike"+Helper.leadingZeroString(3,i)+".jpg");        
            }
        }else{
            frames.push("assets/bike/bike"+Helper.leadingZeroString(3,i)+".jpg");    
        }
    }
    bike.setCrashFrames(frames);

    
    self.funEventIntervalId = null;
    self.currentFrame = 0;
    self.fun = false;

    var updateBikeLeftPosition = function() {
        var container = document.querySelector("div.responsive-container");
        self.bikeLeftPosition = (WindowHandler.windowWidth - container.clientWidth) / 2;
    };

    var framesLoadedEvent = function() {
        console.log("framesLoadedEvent");
        self.initial = false;  
        self.bikeTopPosition    = WindowHandler.windowHeight - 150;
        bike.move(self.bikeLeftPosition, self.bikeTopPosition);
    };

    var initialize = function() {
        self.initial = true;
        self.show = false;
        self.trailStyles.height = "50px";
        updateBikeLeftPosition();
    };


    var funEventTriggle = function() {
        self.fun = true;
        ScrollPlayer.setScrollLayerHeight(0);

        bike.crash(self.bikeLeftPosition, 0);
    };  

    var scrollEvent = function(offsetTop) {
        if(self.fun) {
            return;
        }

        if(offsetTop > WindowHandler.windowHeight - 100) {
            funEventTriggle();
        }else if(offsetTop > 50) {
            self.trailStyles.height = offsetTop+"px";    
            self.bikeTopPosition    = WindowHandler.windowHeight - offsetTop - 100;
            bike.move(self.bikeLeftPosition, self.bikeTopPosition);
            console.log(self.bikeTopPosition);

        }else{
            self.bikeTopPosition = WindowHandler.windowHeight - 150;
            bike.move(self.bikeLeftPosition, self.bikeTopPosition);
        }
    };

    self.reset = function() {
        self.show = false;
        ScrollPlayer.reset();
        self.currentFrame = 0;
    };

    var resizedEvent = function() {
        updateBikeLeftPosition();
        // console.log(self.bikeLeftPosition + " " + self.bikeTopPosition);
        bike.move(self.bikeLeftPosition, self.bikeTopPosition);
    };

    WindowHandler.setResizeCallback(resizedEvent, scope);

    ScrollPlayer.setFullScreen(false);
    ScrollPlayer.setScrollLayerHeight(1800);
    
    ScrollPlayer.setFrames(frames);
    ScrollPlayer.setLoadedCallback(framesLoadedEvent);
    ScrollPlayer.setScrollEvent(scrollEvent);
    ScrollPlayer.ready();

    initialize();
}

angular.module('motionPlaygroundApp.bike',['ngAnimate'])
  
  .controller('bikeCtrl', ['$scope','ScrollPlayer','WindowHandler','Helper',bikeCtrl]);

})();
