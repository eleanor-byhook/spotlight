var config = require('./config');
var iw = config.imageWidth;
var ih = config.imageHeight;

var Panning = function(mouse, threshold, bgImage, bgCtx, drawImage) {

  if(mouse.x >= threshold.right && mouse.x > mouse.lastX){
    /*Pan to the right */
    var mouseDiff = mouse.x - threshold.right;
    drawImage(bgImage, bgCtx, -iw/4 - mouseDiff, -ih/3, iw, ih);

  } else if(mouse.x >= threshold.right && mouse.x < mouse.lastX){
    //pan left to return to center image
    var mouseDiff = mouse.x - threshold.right;
    drawImage(bgImage, bgCtx, -iw/4 - mouseDiff, -ih/3, iw, ih);

  }else if(mouse.x <= threshold.left && mouse.x < mouse.lastX){
    /* Pan to the left */
    var mouseDiff = threshold.left - mouse.x;
    drawImage(bgImage, bgCtx, -iw/4 + mouseDiff, -ih/3, iw, ih);
  }else if (mouse.x <= threshold.left && mouse.x > mouse.lastX){
    //pan right to return to center image
    var mouseDiff = threshold.left - mouse.x;
    drawImage(bgImage, bgCtx, -iw/4 + mouseDiff, -ih/3, iw, ih);
  };

};

module.exports = Panning;
