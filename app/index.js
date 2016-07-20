'use strict';

var config = require('./config');
var Filters = require('./filters');
var Panning = require('./panning');

var cw = config.canvasWidth;
var ch = config.canvasHeight;
var iw = config.imageWidth;
var ih = config.imageHeight;

//locations that cause panning
var threshold = {
  left: cw / 8,
  right: cw - (cw / 8),
  top: ch / 4,
  bottom: ch - (ch / 4)
};

var mouse = {
  x: 0,
  y: 0,
  lastX: 0,
  lastY: 0
};

var drawImage = function(image, ctx, x, y, width, height) {
  ctx.drawImage(image, x, y, width, height);
}

var addText = function(text) {
  var addText = document.createTextNode(text);
  document.body.appendChild(addText);
}

var fillBlack = function() {
  outputCtx.beginPath();
  outputCtx.rect(0, 0, cw, ch);
  outputCtx.fillStyle = 'black';
  outputCtx.fill();
};

/* Background Canvas */
var bg = document.createElement('canvas');
var bgCtx = bg.getContext('2d');
bg.id = 'bg';
bg.width = cw;
bg.height = ch;
var bgImage = new Image();
bgImage.src = config.bgImageSrc;
bgImage.onload = function() { drawImage(bgImage, bgCtx, -iw/4, -ih/3, iw, ih); };
addText('Background: ');
document.body.appendChild(bg);

/* Filter Canvas */
var filter = document.createElement('canvas');
var filterCtx = filter.getContext('2d');
filter.id = 'filter';
filter.width = cw;
filter.height = ch;
var filterImage = new Image();
filterImage.src = config.filterImageSrc;
filterImage.onload = function() { drawImage(filterImage, filterCtx, 0, 0, cw, ch); };
addText('Filter: ');
document.body.appendChild(filter);

/* Output Canvas */
var outputCanvas = document.createElement('canvas');
var outputCtx = outputCanvas.getContext('2d');
outputCanvas.id = 'output';
outputCanvas.width = cw;
outputCanvas.height = ch;
addText('Output Canvas: ');
document.body.appendChild(outputCanvas);
fillBlack();

/* Set the offset of the mouse location relative to the output Canvas*/
var offsetX;
var offsetY;
function reOffset() {
  var BB = outputCanvas.getBoundingClientRect();
  offsetX = BB.left;
  offsetY = BB.top;
}
reOffset();
window.onscroll = function(e) { reOffset(); };
window.onresize = function(e) { reOffset(); };

outputCanvas.addEventListener('mousemove', function(e) { flashlight(e); });

/*Flashlight method */

var flashlight = function(e) {
  e.preventDefault();
  e.stopPropagation();
  mouse.lastX = mouse.x;
  mouse.lastY = mouse.y;
  mouse.x = parseInt(e.clientX - offsetX);
  mouse.y = parseInt(e.clientY - offsetY);

  Panning(mouse, threshold, bgImage, bgCtx, drawImage);

  var bgPixels = Filters.getPixels(bgCtx, 0, 0, cw, ch);
  var filterPixels = Filters.getPixels(filterCtx, cw/2 - mouse.x, ch/2 - mouse.y, cw, ch);
  var filterData = Filters.multiply(bgPixels, filterPixels);
  outputCtx.putImageData(filterData, 0, 0);
};

