var config = require('./config');
var iw = config.imageWidth;
var ih = config.imageHeight;

var Panning = function(mouse, threshold, bgImage, bgCtx, drawImage) {

  var panX = function() {
    var mouseDiffX = 0;

    if(mouse.x > threshold.right && mouse.x >= mouse.lastX){
      /*Pan to the right */
      mouseDiffX = -(mouse.x - threshold.right) * 4;

    } else if(mouse.x > threshold.right && mouse.x < mouse.lastX){
      //pan left to return to center image
      mouseDiffX = -(mouse.x - threshold.right) * 4;

    }else if(mouse.x <= threshold.left && mouse.x <= mouse.lastX){
      /* Pan to the left */
      mouseDiffX = (threshold.left - mouse.x) * 4;

    }else if (mouse.x <= threshold.left && mouse.x > mouse.lastX){
      //pan right to return to center image
      mouseDiffX = (threshold.left - mouse.x) * 4;
    };

    return mouseDiffX;
  };

  var panY = function() {
    var mouseDiffY = 0;
    if(mouse.y <= threshold.top && mouse.y <= mouse.lastY) {
      /*Pan to the top */
      mouseDiffY = (threshold.top - mouse.y) * 1.25;

    } else if(mouse.y <= threshold.top && mouse.y > mouse.lastY) {
      //pan down to return to center
      mouseDiffY = (threshold.top - mouse.y) * 1.25;

    }else if(mouse.y >= threshold.bottom && mouse.y >= mouse.lastY){
      /* Pan to the bottom */
      mouseDiffY = -(mouse.y - threshold.bottom) * 1.25;
      
    }else if(mouse.y >= threshold.bottom && mouse.y < mouse.lastY){
      //pan up to return to center
      mouseDiffY = -(mouse.y - threshold.bottom) * 1.25;
    };

    return mouseDiffY;
  };

 var panDistanceX = panX();
 var panDistanceY = panY();

 drawImage(bgImage, bgCtx, -iw/4 + panDistanceX, -ih/4 + panDistanceY, iw, ih);
};

module.exports = Panning;
