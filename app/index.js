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
bgImage.onload = function() { bgCtx.drawImage(bgImage, -imageWidth/4, -imageHeight/4, imageWidth, imageHeight); };
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
filterImage.onload = function() {requestAnimationFrame(animate);};
filterImage.src = config.filterImageSrc;
addText('Filter: ');
document.body.appendChild(filter);


/*Initial animation for filter canvas - 'turning on the flashlight' effect */
var scale = 1;
var scaleSpeed = 1;
var y = 1;

var animate = function(time) {
  if(scale > 0) {
    requestAnimationFrame(animate); //if this gets too expensive, consider caching calls to animate
  }
  filterCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  filterCtx.drawImage(
      filterImage, 
      0, //x of original image
      0, //y of original image
      imageWidth, //width
      imageHeight, //height
      canvasWidth / 2 - Math.round(imageWidth/4 * scale / 100), //x of output canvas
      canvasHeight / 2 - Math.round((imageHeight/4 * scale / 100)) -23, //y of output canvas minus an offset value that is specific to this image.
      imageWidth * scale / 100, //width of transformed image
      imageHeight * scale / 100 //height of transformed image
  );  
  scale += scale/3;
  if(scale >= 100) {
    scale = 100;
  }
}

/*Flashlight method */
var flashlight = function() {
  panLag.update();
  Pan(panLag, bgImage, bgCtx);
  var bgPixels = bgCtx.getImageData(0, 0, canvasWidth, config.canvasHeight);
  var filterPixels = filterCtx.getImageData(canvasWidth/2 - mouse.x, config.canvasHeight/2 - mouse.y, canvasWidth, config.canvasHeight);
  var filterData = Filters.multiply(bgPixels, filterPixels);
  outputCtx.putImageData(filterData, 0, 0);
 };

/* All the action:
 * Get correct mouse offset
 * Store mouse location every time the mouse moves
 * Redraw the flashlight filter over the panning background every 0.1 seconds
 */

reOffset();

window.onscroll = function(e) { reOffset(); };
window.onresize = function(e) { reOffset(); };
outputCanvas.addEventListener('mousemove', function(e) { saveMouseLocation(e); });

var panLag = new PanLag( lagLocation );
window.setInterval(flashlight, 10);

