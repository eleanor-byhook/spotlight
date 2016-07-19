'use strict';

var config = require('./config');
var cw = config.canvasWidth;
var ch = config.canvasHeight;

var bg = document.createElement('canvas');
var bgCtx = bg.getContext('2d');
bg.id = 'bg';
bg.width = cw;
bg.height = ch;
var bgImage = new Image();
bgImage.src = config.bgImageSrc;
bgImage.onload = function() {drawNormal(bgImage, bgCtx); };
var text = document.createTextNode("Background: ");
document.body.appendChild(text);

document.body.appendChild(bg);

var filter = document.createElement('canvas');
var filterCtx = filter.getContext('2d');
filter.id = 'filter';
filter.width = cw;
filter.height = ch;
var filterImage = new Image();
filterImage.src = 'images/rainbow.jpg';
filterImage.onload = function() {drawNormal(filterImage, filterCtx);}
var text2 = document.createTextNode("Filter: ");
document.body.appendChild(text2);

document.body.appendChild(filter);

var outputCanvas = document.createElement('canvas');
var outputCtx = outputCanvas.getContext('2d');
outputCanvas.id = 'canvas';
outputCanvas.width = cw;
outputCanvas.height = ch;

var fillBlack = function() {
  outputCtx.beginPath();
  outputCtx.rect(0, 0, cw, ch);
  outputCtx.fillStyle = 'black';
  outputCtx.fill();
};

fillBlack();
var text3 = document.createTextNode("Output Canvas: ");
document.body.appendChild(text3);
document.body.appendChild(outputCanvas);


var drawNormal = function(image, ctx) {
  ctx.drawImage(image, 0, 0, cw, ch);
}

/* Mouse controlled masking  */
var offsetX;
var offsetY;
function reOffset() {
  var BB = filter.getBoundingClientRect();
  offsetX = BB.left;
  offsetY = BB.top;
}
reOffset();
window.onscroll = function(e) { reOffset(); };
window.onresize = function(e) { reOffset(); };

outputCanvas.addEventListener('mouseenter', function(e) { handleMouseEnter(e); });
outputCanvas.addEventListener('mousemove', function(e) { handleMouseMove(e); });
outputCanvas.addEventListener('mouseleave', function(e) { fillBlack(); });

var handleMouseEnter = function(e) {
  var bgPixels = Filters.getPixels(bgCtx);
  var filterPixels = Filters.getPixels(filterCtx);
  var filterData = Filters.multiply(filterPixels, bgPixels);
  outputCtx.putImageData(filterData, 0, 0, 0, 0, cw, ch);

}

var handleMouseMove = function(e) {
  e.preventDefault();
  e.stopPropagation();
  var mouseX = parseInt(e.clientX - offsetX);
  var mouseY = parseInt(e.clientY - offsetY);
  //draw(filterCtx, mouseX, mouseY, config.radius);
}

var draw = function(ctx, x, y, radius) {
  var radialGradient = ctx.createRadialGradient(x, y, 1, x, y, radius);
  radialGradient.addColorStop(0, 'transparent'); //TODO add color multiply here?
  radialGradient.addColorStop(1, 'rgba(31, 0, 0, 0.8)');
  ctx.beginPath();
  ctx.strokeStyle = 'transparent';
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = radialGradient;
  ctx.fill(); 
  ctx.stroke();
  ctx.closePath();
};

/**********************
 Image filters 
*********************/
var Filters = {};

Filters.getPixels = function (ctx) {
  return ctx.getImageData(0, 0, cw, ch);
};

Filters.multiply = function(pixels1, pixels2) {
//assumes both canvases are the same size
  var d1 = pixels1.data;
  var d2 = pixels2.data;
  for (var i = 0; i < d1.length; i+= 4) {
    var r1 = d1[i];
    var r2 = d2[i];

    var g1 = d1[i+1];
    var g2 = d2[i+1];

    var b1 = d1[i+2];
    var b2 = d2[i+2];

    d1[i] = r1 * r2 / 255;
    d1[i+1] = g1 * g2 / 255;
    d1[i+2] = b1 * b2 / 255;    
  }
  return pixels1;
}

Filters.grayscale = function(pixels) {
  var d = pixels.data;
  for(var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    d[i] = d[i+1] = d[i+2] = v;
  }
  return pixels;
}

Filters.sepia = function (pixels) {
  var d = pixels.data;
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    d[i]     = (r * 0.393)+(g * 0.769)+(b * 0.189); // red
    d[i + 1] = (r * 0.349)+(g * 0.686)+(b * 0.168); // green
    d[i + 2] = (r * 0.272)+(g * 0.534)+(b * 0.131); // blue
  }
  return pixels;
};

