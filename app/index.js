'use strict';

var config = require('./config');
var Filters = require('./filters');

var cw = config.canvasWidth;
var ch = config.canvasHeight;
var iw = config.imageWidth;
var ih = config.imageHeight;

var drawNormal = function(image, ctx, x, y, width, height) {
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
bgImage.onload = function() { drawNormal(bgImage, bgCtx, -iw/4, -ih/3, iw, ih); };
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
filterImage.onload = function() { drawNormal(filterImage, filterCtx, 0, 0, cw, ch); };
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
  var mouseX = parseInt(e.clientX - offsetX);
  var mouseY = parseInt(e.clientY - offsetY);

  var bgPixels = Filters.getPixels(bgCtx, 0, 0, cw, ch);
  var filterPixels = Filters.getPixels(filterCtx, cw/2 - mouseX, ch/2 - mouseY, cw, ch);
  var filterData = Filters.multiply(bgPixels, filterPixels);
  outputCtx.putImageData(filterData, 0, 0);
}

