(function() {

'use strict';


 function ImageLoader() {
    var self = this;
    self.progressUpdatedCallback = null;
    this.loadedCallback = null;
    self.userImageLoaded = function() {};

    self.images = [];
    self.progressUpdatedInterval = 100;
    self.progressUpdateTimer = null;
    self.loadedFlag = false;

    self.countImagesLoaded = 0;
    self.imageTags = [];

    self.setImagesUrl = function(images) {
        self.images = images;
    };

    self.imageLoaded = function() {
        if(typeof self.userImageLoaded === 'function') {
            self.userImageLoaded(self.imageTags);    
        }
        self.countImagesLoaded += 1;

        if(self.countImagesLoaded >= self.images.length) {
            // all images is loaded
            clearInterval(self.progressUpdateTimer);
            self.loadedCallback();
        }
    };

    self.load = function() {
        var self = this;

        self.loadedFlag = true;

        if(self.progressUpdatedCallback) {
            self.progressUpdateTimer = setInterval(function() {
                self.progressUpdatedCallback(self.countImagesLoaded / self.images.length);
            }, self.progressUpdatedInterval);
        }

        for (var i = 0; i < self.images.length; i++) {
            var img = new Image();
            img.src = self.images[i];
            img.onload = self.imageLoaded;
            img.onerror = self.imageLoaded;
            self.imageTags.push(img);
        }
    };

    self.getImagesTag = function() {
        if(self.loadedFlag) {
            return self.imageTags;    
        }
        throw "execute load() method before you use getImagesTag() method.";
    };

    self.setImageLoadedCallback = function(cb) {
        self.userImageLoaded = cb;
    };

    self.setProgressUpdatedCallback = function(cb) {
        self.progressUpdatedCallback = cb;
    };

    self.setLoadedCallback = function(cb) {
        self.loadedCallback = cb;
    };
}

function FramesFactory() {

    var self = this
        ;

    self.frames = [];
    self.loadedCallback = null;
    self.progressUpdateCallback = null;

    // extends FramesFactory with ImageLoader
    self.loader = new ImageLoader();
    
    self.getFrames = function() {
        return self.loader.getImagesTag();
    };

    self.setFrames = function(frames) {
        self.frames = [];
        self.loader.setImagesUrl(frames);
    };

    self.setLoadedCallback = function(cb) {
        self.loader.setLoadedCallback(cb);
    };

    self.load = function() {
        self.loader.load();
    };

    return self;
}

angular.module('canvasModule.factories',[])
    .factory('FramesFactory', [ 'WindowHandler', FramesFactory]);

})();
