var config = require('./config');
var iw = config.imageWidth;
var ih = config.imageHeight;
var cw = config.canvasWidth;
var ch = config.canvasHeight;

var Panning = function(mouse, threshold, bgImage, bgCtx, drawImage) {

  var panX = function() {
    var mouseDiffX = 0;

    if(mouse.x > threshold.right && mouse.x >= mouse.lastX){
      /*Pan to the right */
      mouseDiffX = -(mouse.x - threshold.right) * 2;

    } else if(mouse.x > threshold.right && mouse.x < mouse.lastX){
      //pan left to return to center image
      mouseDiffX = -(mouse.x - threshold.right) * 2;

    }else if(mouse.x <= threshold.left && mouse.x <= mouse.lastX){
      /* Pan to the left */
      mouseDiffX = (threshold.left - mouse.x) * 2;

    }else if (mouse.x <= threshold.left && mouse.x > mouse.lastX){
      //pan right to return to center image
      mouseDiffX = (threshold.left - mouse.x) * 2;
    };

    return mouseDiffX;
  };

  var panY = function() {
    var mouseDiffY = 0;
    if(mouse.y <= threshold.top && mouse.y <= mouse.lastY) {
      /*Pan to the top */
      mouseDiffY = (threshold.top - mouse.y) * 2;

    } else if(mouse.y <= threshold.top && mouse.y > mouse.lastY) {
      //pan down to return to center
      mouseDiffY = (threshold.top - mouse.y) * 2;

    }else if(mouse.y >= threshold.bottom && mouse.y >= mouse.lastY){
      /* Pan to the bottom */
      mouseDiffY = -(mouse.y - threshold.bottom) * 2;
      
    }else if(mouse.y >= threshold.bottom && mouse.y < mouse.lastY){
      //pan up to return to center
      mouseDiffY = -(mouse.y - threshold.bottom) * 2;
    };

    return mouseDiffY;
  };

 var panDistanceX = panX();
 var panDistanceY = panY();

 var xLocation = -iw/4 + panDistanceX;
 var yLocation = -ih/4 + panDistanceY;

//prevents pan from going further than the image's height
 yLocation = ih + yLocation <= ch ? -ih - ch : yLocation;
 yLocation = yLocation > 0 ? 0 : yLocation;

 //prevents pan from going further than the image's width
 xLocation = iw - cw + xLocation <=  0 ? -cw : xLocation;
 xLocation = xLocation > 0 ? 0 : xLocation;

 drawImage(bgImage, bgCtx, xLocation, yLocation, iw, ih);
};

module.exports = Panning;
