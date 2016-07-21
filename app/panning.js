var config = require('./config');
var Filters = require('./filters');

var iw = config.imageWidth;
var ih = config.imageHeight;
var cw = config.canvasWidth;
var ch = config.canvasHeight;

var offset = {
  oldX: 0,
  oldY: 0,
  newX: 0,
  newY: 0
};

var Panning = function(mouse, threshold, bgImage, bgCtx, filterCtx, outputCtx, drawImage) {

  var panX = function(v) {
    var mouseDiffX = 0;
    if(mouse.x > threshold.right && mouse.x >= mouse.lastX){
      /*Pan to the right */
      mouse.x += v;
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
    } 
    return mouseDiffX; 
  };

  var panY = function(v) {
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
    }     
    return mouseDiffY;
  };

  function draw(x, y){
    //updates the background pixels it's grabbing
    drawImage(bgImage, bgCtx, x, y, iw, ih);
  }

  var filterPixels = Filters.getPixels(filterCtx, cw/2 - mouse.x, ch/2 - mouse.y, cw, ch);
  var bgPixels = Filters.getPixels(bgCtx, 0, 0, cw, ch);
  var filterData = Filters.multiply(bgPixels, filterPixels);
  outputCtx.putImageData(filterData, 0, 0); 

  var velocityX = Math.round((offset.oldX - offset.newX) * 0.5);
  var velocityY = Math.round((offset.oldY- offset.newY) * 0.5);
  console.log(velocityX, velocityY);

  var xLocation = -iw/4 + panX(velocityX);
  var yLocation = -ih/4 + panY(velocityY);

  offset.oldX = offset.newX;
  offset.oldY = offset.newY;

  //prevents pan from going further than the image's height
  yLocation = ih + yLocation <= ch ? -ih - ch : yLocation;
  yLocation = yLocation > 0 ? 0 : yLocation;

  //prevents pan from going further than the image's width
  xLocation = iw - cw + xLocation <=  0 ? -cw : xLocation;
  xLocation = xLocation > 0 ? 0 : xLocation;

  offset.newX = xLocation;
  offset.newY = yLocation;

  window.setInterval(function() {
    
    draw(offset.newX, offset.newY);

  }, 10);

};

module.exports = Panning;
