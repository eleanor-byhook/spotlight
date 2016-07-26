'use strict';

var config = require('./config');
var Filters = require('./filters');
var PanLag = require('./pan-lag');
var Pan = require('./pan');

var canvasWidth = config.canvasWidth;
var canvasHeight = config.canvasHeight;
var imageWidth = config.imageWidth;
var imageHeight = config.imageHeight;

var startX = canvasWidth / 2;
var startY = canvasHeight / 2;

//location of the background that lags behind the realtime mouse
var lagLocation = {
  x: startX,
  y: startY,
};

var mouse = {
  x: startX,
  y: startY,
};

var addText = function(text) {
  var addText = document.createTextNode(text);
  document.body.appendChild(addText);
}

var fillBlack = function() {
  outputCtx.beginPath();
  outputCtx.rect(0, 0, canvasWidth, canvasHeight);
  outputCtx.fillStyle = 'black';
  outputCtx.fill();
};

/* Set the offset of the mouse location relative to the output Canvas*/
var offsetX;
var offsetY;
function reOffset() {
  var BB = outputCanvas.getBoundingClientRect();
  offsetX = BB.left;
  offsetY = BB.top;
}

var saveMouseLocation = function(e){
  mouse.x = parseInt(e.clientX - offsetX);
  mouse.y = parseInt(e.clientY - offsetY);
  lagLocation.x = mouse.x;
  lagLocation.y = mouse.y;
};

/* Create an Output Canvas */
var outputCanvas = document.createElement('canvas');
var outputCtx = outputCanvas.getContext('2d');
outputCanvas.id = 'output';
outputCanvas.width = canvasWidth;
outputCanvas.height = canvasHeight;
addText('Output Canvas: ');
document.body.appendChild(outputCanvas);
fillBlack();

/* Create a Background Canvas */
var bg = document.createElement('canvas');
var bgCtx = bg.getContext('2d');
bg.id = 'bg';
bg.width = canvasWidth;
bg.height = canvasHeight;
var bgImage = new Image();
bgImage.onload = function() { requestAnimationFrame(zoomOutBackground); };
bgImage.src = config.bgImageSrc;
addText('Background: ');
document.body.appendChild(bg);

/* Create a Filter Canvas */
var filter = document.createElement('canvas');
var filterCtx = filter.getContext('2d');
filter.id = 'filter';
filter.width = canvasWidth;
filter.height = canvasHeight;
var filterImage = new Image();
filterImage.onload = function() {requestAnimationFrame(powerOnFlashlight);};
filterImage.src = config.filterImageSrc;
//filterImage.onload = function() {filterCtx.drawImage(filterImage, 0, 0, canvasWidth, canvasHeight);};
addText('Filter: ');
document.body.appendChild(filter);

/*Initial animation for background canvas - slight zoom out effect */
var bgScale = 160;
var bgScaleSpeed = 0.5;
var bgScaleDone = false;

var zoomOutBackground = function() {
  if(bgScale > 100 && !bgScaleDone) {
    requestAnimationFrame(zoomOutBackground); 
  }
  var scaleWidth = imageWidth * bgScale/100;
  var scaleHeight = imageHeight * bgScale/100;
  bgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  bgCtx.drawImage(
      bgImage, 
      0, //x of original image
      0, //y of original image
      imageWidth, //width
      imageHeight, //height
      -scaleWidth/2 - (-scaleWidth/4 * 100/bgScale), //x of output canvas
      -scaleHeight/2 - (-scaleHeight/4 * 100/bgScale), //y of output canvas
      scaleWidth, //width of transformed image
      scaleHeight //height of transformed image
  );  
  bgScale -= bgScaleSpeed;
  if(bgScale < 100) {
    bgScale = 100;
    bgScaleDone = true;
    console.log('bg scale done!');
    //once scaling is done, clear the interval for initial load and set
    window.clearInterval(loadID);
    window.setInterval(flashlight, 10);
  }
}

/*Initial animation for filter canvas - 'turning on the flashlight' effect */
var scale = 1;
var scaleSpeed = 3;
var finishFlashlightTurnOn = false;

var powerOnFlashlight = function() {
  if(scale > 0 && !finishFlashlightTurnOn) {
    requestAnimationFrame(powerOnFlashlight); 
  }
  if(!finishFlashlightTurnOn){
    var newX = canvasWidth / 2 - (canvasWidth/2 * scale / 100);
    var newY = canvasHeight / 2 - (canvasHeight/2 * scale / 100);
    var newWidth = canvasWidth * scale / 100;
    var newHeight = canvasHeight * scale / 100;
    filterCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    filterCtx.drawImage(
        filterImage, 
        0, //x of original image
        0, //y of original image
        canvasWidth, //width
        canvasHeight, //height
        newX, //x of output canvas
        newY, //y of output canvas minus an offset value that is specific to this image.
        newWidth, //width of transformed image
        newHeight//height of transformed image
    );  
    scale += scaleSpeed;
    if(scale >= 100) {
      scale = 100;
      console.log('flashlight load done!');
      finishFlashlightTurnOn = true;
    }
  }
}

/* image data for initial load, no interaction */
var initialLoad = function() {
  var bgPixels = bgCtx.getImageData(0, 0, canvasWidth, config.canvasHeight);
  var filterPixels = filterCtx.getImageData(canvasWidth/2 - startX, config.canvasHeight/2 - startY, canvasWidth, config.canvasHeight);
  var filterData = Filters.multiply(bgPixels, filterPixels);
  outputCtx.putImageData(filterData, 0, 0);
}

/*Flashlight method with interaction*/
var flashlight = function() {
  panLag.update();
  Pan(panLag, bgImage, bgCtx);
  var bgPixels = bgCtx.getImageData(0, 0, canvasWidth, config.canvasHeight);
  var filterPixels = filterCtx.getImageData(canvasWidth/2 - mouse.x, config.canvasHeight/2 - mouse.y, canvasWidth, config.canvasHeight);
  var filterData = Filters.multiply(bgPixels, filterPixels);
  outputCtx.putImageData(filterData, 0, 0);
 };

/* All the action:
 *
 * 1) Get correct mouse offset and reset the offset incase of scroll or resize
 *
 * 2) Store mouse location every time the mouse moves
 *
 * 3) Start the initial load animation (flashlight turn on and background zoom out);
 *
 * 4) On complete of the initial load, the flashlight timeout gets set which will
 * redraw the flashlight filter over the panning background every 0.1 seconds
 */

reOffset();

window.onscroll = function(e) { reOffset(); };
window.onresize = function(e) { reOffset(); };
outputCanvas.addEventListener('mousemove', function(e) { saveMouseLocation(e); });

var panLag = new PanLag( lagLocation );
var loadID = window.setInterval(initialLoad, 10);

