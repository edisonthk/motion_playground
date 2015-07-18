(function() {

'use strict';

/**
 * @ngdoc function
 * @name motionPlaygroundApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the motionPlaygroundApp
 */

function page1Ctrl(ScrollPlayer,WindowHandler,Helper) {

    var self = this,
        triggleFrameIndex = 36,
        frames = []
    ;

    if(WindowHandler.isVerticalScreen()) {
        triggleFrameIndex = 38;
        for (var i = 0; i < 80; i++) {
            frames.push('assets/mb_page1a/a'+Helper.leadingZeroString(4,i)+".jpg");
        };    
    }else{
        triggleFrameIndex = 36;
        for (var i = 0; i < 82; i++) {
            frames.push('assets/page1/a'+Helper.leadingZeroString(2,i)+".jpg");
        };    
    }
    
    console.log(frames.length);

    var framesLoadedEvent = function() {
        console.log("framesLoadedEvent");
        self.initial = false;    
    };

    var initialize = function() {
        self.initial = true;
        self.show = false;
    };

    var funEventTriggled = function() {
        console.log("triggle");
        self.show = true;
    }

    self.reset = function() {
        self.show = false;
        ScrollPlayer.reset();
    }

    ScrollPlayer.setFrames(frames);
    ScrollPlayer.setLoadedCallback(framesLoadedEvent);
    ScrollPlayer.setFunEventTriggledCallback(funEventTriggled);
    ScrollPlayer.setFunTriggleFrameIndex(triggleFrameIndex);
    ScrollPlayer.ready();

    initialize();
}

angular.module('motionPlaygroundApp.page1',['ngAnimate'])
  
  .controller('page1Ctrl', ['ScrollPlayer','WindowHandler','Helper',page1Ctrl]);

})();
