'use strict';

var config = require('./config');
var Filters = require('./filters');

var cw = config.canvasWidth;
var ch = config.canvasHeight;

var drawNormal = function(image, ctx) {
  ctx.drawImage(image, 0, 0, cw, ch);
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

var addCanvas = function(image, id, text){
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.id = id;
  canvas.width = cw;
  canvas.height = ch;
  var canvasImage = new Image();
  if(image) {
    canvasImage.src = image;
    canvasImage.onload = function() { drawNormal(canvasImage, ctx); };
  };
  addText(text);
  document.body.appendChild(canvas);
  return canvas;
}

/* Background Canvas */
var bg = addCanvas(config.bgImageSrc, 'bg', 'Background: ');
var bgCtx = bg.getContext('2d');

/* Filter Canvas */
var filter = addCanvas(config.filterImageSrc, 'filter', 'Filter: ');
var filterCtx = filter.getContext('2d');

/* Output Canvas */
var outputCanvas = addCanvas(null, 'canvas', 'Output Canvas: ');
var outputCtx = outputCanvas.getContext('2d');
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

