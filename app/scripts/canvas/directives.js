'use strict';

angular.module('canvasModule',[])
  //
  // 背景の動画やフルサイズなどの仕事はこちらのdirectiveに任せています。
  // 
  // background directiveの使えるメソッドは
  // 1. getBackgroundCanvas()   返り値はbackgroundのcanvas要素です。
  // 2. state           状態オブジェクト
  //    * current         状態オブジェクトの現在の状態を返します
  //    * FLAG .. 
  // 3. getVideoList()      ビデオタグの配列を返します 
  .directive('background',['$window','$document','$location','$timeout','WindowHandler',function(w,d,location,$timeout,WindowHandler) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        control: '=',
      },
      template: '<canvas id="gafewVA21Z" width="{{canvasWidth}}" height="{{canvasHeight}}"></canvas><div style="position:absolute;" ng-transclude></div>',
      link: function(scope){
        
        var control = {},
            cnt_pause = 0,
            canvas = document.getElementById("gafewVA21Z"),
            currentFrameIndex = 0,
            currentFrames = [],
            currentFrame = null,
            frames = [],
            intervalIndex = null,
            resizedCallback = null
            ;
        
        
        // ページ遷移する際に使うオブジェクトです。
        // 現在の状態を表すフラグです。
        scope.state = {
          // それぞれの状態定数／フラグ
          FLAG_IDLE: 2,  // 動画が完全停止
          FLAG_PAUSE: 0,  // 動画を停止
          FLAG_PLAY: 1,   // 動画を再生

          // 初期状態
          initial: 0,
        };
        scope.state.current = scope.state.FLAG_PAUSE;
        scope.eventsWhenCanPlay = [];
        scope.eventsWhenEnded = [];

        if(typeof scope.control === 'undefined') {
            scope.control = {};
        }

        
        var ctx = canvas.getContext("2d");


        var progressBarDrawingFlag = false;
        var drawProgressBar = function(progress) {
            
            if(progressBarDrawingFlag) {
                return;
            }

            progressBarDrawingFlag = true;

            var size = 300;
            var lineWidth = 10;
            ctx.translate(scope.canvasWidth / 2, scope.canvasHeight / 2); // change center
            // ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

            //imd = ctx.getImageData(0, 0, 240, 240);
            var radius = (size - lineWidth) / 2;
            console.log("fdsfsd");
            var drawCircle = function(color, percent) {
                    percent = Math.min(Math.max(0, percent || 1), 1);
                    ctx.beginPath();
                    ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
                    ctx.strokeStyle = color;
                    ctx.lineCap = 'round'; // butt, round or square
                    ctx.lineWidth = lineWidth;
                    ctx.stroke();
            };

            progress = parseInt(progress);

            drawCircle('#efefef', 100 / 100);
            drawCircle('#555555', progress / 100);
            setTimeout(function() {
                progressBarDrawingFlag = false;
            },1);
        };

        // resizeイベントを遅延する効果が働きます
        scope.$watch('canvasWidth', function() {
            clearTimeout(scope.timeout_id_for_background);
            scope.timeout_id_for_background = setTimeout(function(){
                
                restoreFrame();

                if(typeof resizedCallback === 'function') {
                    resizedCallback();
                }
            },100);
        });
        scope.$watch('canvasHeight', function() {
            clearTimeout(scope.timeout_id_for_background);
            scope.timeout_id_for_background = setTimeout(function(){

                restoreFrame();

                if(typeof resizedCallback === 'function') {
                    resizedCallback();
                }  
            }, 100);
        });

        var updateCanvasSize = function() {
            scope.canvasWidth = WindowHandler.windowWidth;
            scope.canvasHeight = WindowHandler.windowHeight;
        };

        angular.element(w).on('resize', function(){
            // scopeを更新
            updateCanvasSize();  
            scope.$apply();
        });

        var restoreFrame = function() {
            console.log("fdsfsd");
            if(currentFrame != null) {
                scope.control.draw(currentFrame);    
            }
        }

        var drawImageProp = function(ctx, img, x, y, w, h, offsetX, offsetY) {

            if (arguments.length === 2) {
                x = y = 0;
                w = ctx.canvas.width;
                h = ctx.canvas.height;
            }

            // default offset is center
            offsetX = typeof offsetX === "number" ? offsetX : 0.5;
            offsetY = typeof offsetY === "number" ? offsetY : 0.5;

            // keep bounds [0.0, 1.0]
            if (offsetX < 0) {offsetX = 0;}
            if (offsetY < 0) {offsetY = 0;}
            if (offsetX > 1) {offsetX = 1;}
            if (offsetY > 1) {offsetY = 1;}

            var iw = img.width,
                ih = img.height,
                r = Math.min(w / iw, h / ih),
                nw = iw * r,   // new prop. width
                nh = ih * r,   // new prop. height
                cx, cy, cw, ch, ar = 1;

            // decide which gap to fill    
            if (nw < w){ ar = w / nw; }
            if (nh < h){ ar = h / nh; }
            nw *= ar;
            nh *= ar;

            // calc source rectangle
            cw = iw / (nw / w);
            ch = ih / (nh / h);

            cx = (iw - cw) * offsetX;
            cy = (ih - ch) * offsetY;

            // make sure source rectangle is valid
            if (cx < 0) {cx = 0;}
            if (cy < 0) {cy = 0;}
            if (cw > iw){ cw = iw;}
            if (ch > ih){ ch = ih;}

            // fill image in dest. rectangle
            ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
        };
        
        updateCanvasSize();

        scope.control.draw = function(imageFrame) {
            currentFrame = imageFrame;
            
            drawImageProp(ctx, imageFrame, 0, 0 ,scope.canvasWidth, scope.canvasHeight);
            
        }

        // videoタグに関するイベント
        // BEGIN: API
        scope.control.setFrames = function(frames) {
            scope.control.stop();
            currentFrames = frames;
            if(currentFrames && currentFrames.length > 0) {
                currentFrame = currentFrames[0];
            }
        };
        scope.control.play = function() {
            clearInterval(intervalIndex);
            scope.state.current = scope.state.FLAG_PLAY;
            currentFrameIndex = 0;
            intervalIndex = setInterval(canvasDrawImage, 1000/20);
        };
        scope.control.stop = function() {
            scope.state.current = scope.state.FLAG_PAUSE;
            clearInterval(intervalIndex);
        };
        scope.control.pause = function() {
            scope.control.stop();
        };
        scope.control.drawProgressBar = function(progress) {
            drawProgressBar(progress);
        };
        scope.control.drawAgain = function() {
            console.log("draw again");
            drawImageProp(ctx, currentFrame, 0, 0 ,scope.canvasWidth, scope.canvasHeight);
        };
        scope.control.getBackgroundContext = function() {
          return ctx;
        };
        scope.control.getState = function() {
          return scope.state;
        };
        scope.control.isPlaying = function() {
            return scope.state.current === scope.state.FLAG_PLAY;
        };
        scope.control.addEventWhenCanplay = function(_event){
          if(typeof _event === "function"){
            scope.eventsWhenCanPlay.push(_event);
          }
        };
        scope.control.addEventWhenEnded = function(_event){
          if(typeof _event === "function"){
            scope.eventsWhenEnded.push(_event);
          }
        };
        scope.control.clearAllEvents = function() {
          scope.eventsWhenEnded = [];
          scope.eventsWhenCanPlay = [];
        };
        scope.control.addResizedCallback = function(_event) {
            if(typeof _event === "function"){
                resizedCallback = _event;
            }
        };
        // END: API

        
      }
    };
  }]);