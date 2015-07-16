(function() {

'use strict';

/**
 * @ngdoc function
 * @name motionPlaygroundApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the motionPlaygroundApp
 */

function ScrollPlayer() {
    var self = this;

    self.framePerPixel = 10;
    self.frames = [];
    self.control = {},
    self.indexFrame = 0;
    self.userFramesLoadedCallback = null;
    self.userFunEventCallback = null;
    self.funEventTriggled = false;
    self.funTriggleFrameIndex = 36;
    self.dummyElement = document.getElementById("dummyElement");


    self.applicationFunEvent = function($scope,ctrl,indexFrame) {
        self.funEventTriggled = true;
        ctrl.dummyStyles = {
            height : '0px'
        };

        if(typeof self.userFunEventCallback === 'function') {
                self.userFunEventCallback();
            }   

        $scope.$apply(function() {
            
        });
        self.indexFrame = indexFrame;

        

        self.intervalId = setInterval(function() {
            self.indexFrame ++;
            if(self.indexFrame < self.frames.length) {
                self.play(self.indexFrame);            
            }else{
                clearInterval(self.intervalId);
            }
            
            $scope.$apply();
        },1000/24);
    }



    self.controller = function($scope,FramesFactory,w,WindowHandler) {
        var ctrl = this;
        
        self.updateDummyStyles(ctrl, WindowHandler);

        ctrl.control = self.control;

        angular.element(self.dummyElement).bind('scroll', function(e){
            var indexFrame = parseInt((-self.dummyElement.children[0].getBoundingClientRect().top) / self.framePerPixel);
            if(indexFrame >= 0 && indexFrame < self.frames.length && !self.funEventTriggled) {
                self.indexFrame = indexFrame;
                if(self.indexFrame >= self.funTriggleFrameIndex) {
                    self.applicationFunEvent($scope,ctrl, indexFrame);
                }else{
                    self.play(self.indexFrame);        
                }
            }
        });

        FramesFactory.setLoadedCallback(function() {
            self.frames = FramesFactory.getFrames();
            self.play(0);

            self.updateDummyStyles(ctrl, WindowHandler);

            if(typeof self.userFramesLoadedCallback === 'function') {
                self.userFramesLoadedCallback();
            }

            $scope.$digest();
        });

        self.reset = function() {
            clearInterval(self.intervalId);
            self.funEventTriggled = false;
            self.updateDummyStyles(ctrl, WindowHandler);
            self.play(0);
        }

        self.play = function(frameIndex) {
            self.control.draw(self.frames[frameIndex]);
        };
    };

    self.updateDummyStyles = function(ctrl, WindowHandler) {
        ctrl.dummyStyles = {
            height : (WindowHandler.windowHeight + (self.framePerPixel * self.frames.length)) + 'px'
        };
    }

    self.getFrames = function() {
        return self.frames;
    };

    self.factory = function(FramesFactory,w,WindowHandler) {
        
        return {
            setFrames:         FramesFactory.setFrames,
            ready:             FramesFactory.load,
            play:              self.play,
            reset:             self.reset,
            setFunEventTriggledCallback: function(cb) {
                self.userFunEventCallback = cb;
            },
            setLoadedCallback: function(cb) {
                self.userFramesLoadedCallback = cb;
            },
            setFunTriggleFrameIndex: function(frameIndex) {
                self.funTriggleFrameIndex = frameIndex;
            },
        };
    };
}

var player = new ScrollPlayer();

angular.module('canvasModule.player',[])
    .factory('ScrollPlayer', ['FramesFactory','$window','WindowHandler', player.factory])
    .controller('CanvasPlayerCtrl',['$scope','FramesFactory','$window','WindowHandler',player.controller ])
;


})();
