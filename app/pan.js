'use strict'; 
var config = require('./config');

var imageWidth = config.imageWidth;
var imageHeight = config.imageHeight;
var canvasWidth = config.canvasWidth;
var canvasHeight = config.canvasHeight;

//thresholds for panning
var threshold = {
 left: canvasWidth / 2,
 right: canvasWidth - (canvasWidth / 2),
 top: canvasHeight / 2,
 bottom: canvasHeight - (canvasHeight / 2)
};

var Panning = function(mouse, bgImage, bgCtx) {

  var panX = function() {
    var mouseDiffX = 0;
    if(mouse.x > threshold.right && mouse.x > mouse.lastX){
      //Pan to the right
      mouseDiffX = -(mouse.x - threshold.right) * 2;

    } else if(mouse.x > threshold.right && mouse.x <= mouse.lastX){
      //pan left to return to center image
      mouseDiffX = -(mouse.x - threshold.right) * 2;

    }else if(mouse.x < threshold.left && mouse.x <= mouse.lastX){
      // Pan to the left
      mouseDiffX = (threshold.left - mouse.x) * 2;

    }else if (mouse.x < threshold.left && mouse.x > mouse.lastX){
      //pan right to return to center image
      mouseDiffX = (threshold.left - mouse.x) * 2;
    } 
    return (mouseDiffX); 
  };

  var panY = function() {
    var mouseDiffY = 0;
    if(mouse.y <= threshold.top && mouse.y <= mouse.lastY) {
      //Pan to the top
      mouseDiffY = (threshold.top - mouse.y) * 2;

    } else if(mouse.y <= threshold.top && mouse.y > mouse.lastY) {
      //pan down to return to center
      mouseDiffY = (threshold.top - mouse.y) * 2;

    }else if(mouse.y >= threshold.bottom && mouse.y >= mouse.lastY){
      // Pan to the bottom
      mouseDiffY = -(mouse.y - threshold.bottom) * 2;

    }else if(mouse.y >= threshold.bottom && mouse.y < mouse.lastY){
      //pan up to return to center
      mouseDiffY = -(mouse.y - threshold.bottom) * 2;
    }     
    return (mouseDiffY);
  };



  function draw(){
    bgCtx.drawImage(bgImage, xLocation, yLocation, imageWidth, imageHeight);
  }

  var xLocation = -imageWidth/4 + panX();
  var yLocation = -imageHeight/4 + panY();

  //prevents pan from going further than the image's height
  yLocation = imageHeight - canvasHeight + yLocation <= 0 ? -(imageHeight - canvasHeight): yLocation;
  //console.log('yLocation: ' + yLocation, 'image Height: ' + imageHeight, 'canvasHeight: ' + canvasHeight);
  yLocation = yLocation > 0 ? 0 : yLocation;

  //prevents pan from going further than the image's width
  xLocation = imageWidth - canvasWidth + xLocation <=  0 ? -canvasWidth : xLocation;
  xLocation = xLocation > 0 ? 0 : xLocation;

  draw();
};


module.exports = Panning;
