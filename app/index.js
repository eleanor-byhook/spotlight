'use strict';

var config = require('./config');
var Filters = require('./filters');
var PanLag = require('./pan-lag');
var Pan = require('./pan');

var canvasWidth = config.canvasWidth;
var canvasHeight = config.canvasHeight;
var imageWidth = config.imageWidth;
var imageHeight = config.imageHeight;

//location of the background that lags behind the realtime mouse
var lagLocation = {
  x: 0,
  y: 0,
  lastX: 0,
  lastY: 0
};

var mouse = {
  x: 0,
  y: 0,
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
bgImage.src = config.bgImageSrc;
bgImage.onload = function() { bgCtx.drawImage(bgImage, -imageWidth/4, -imageHeight/4, imageWidth, imageHeight); };
addText('Background: ');
document.body.appendChild(bg);

/* Create a Filter Canvas */
var filter = document.createElement('canvas');
var filterCtx = filter.getContext('2d');
filter.id = 'filter';
filter.width = canvasWidth;
filter.height = canvasHeight;
var filterImage = new Image();
filterImage.src = config.filterImageSrc;
filterImage.onload = function() { filterCtx.drawImage(filterImage, 0, 0, canvasWidth, canvasHeight); };
addText('Filter: ');
document.body.appendChild(filter);

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
var panLag = new PanLag( lagLocation );
outputCanvas.addEventListener('mousemove', function(e) { saveMouseLocation(e); });
window.setInterval(flashlight, 10);

