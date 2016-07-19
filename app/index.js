'use strict';

var config = require('./config');

var canvas = document.getElementById('wall');
var ctx = canvas.getContext('2d');
var cw = canvas.width;
var ch = canvas.height;
var wallImage = new Image();
wallImage.src = config.wallImageSrc;
wallImage.onload = function() {drawNormal(wallImage, ctx); };

var filter = document.createElement('canvas');
var filterCtx = filter.getContext('2d');
filter.id = 'filter';
filter.width = cw;
filter.height = ch;
var filterImage = new Image();
filterImage.src = 'images/rainbowtexture.png';
filterImage.onload = function() {drawNormal(filterImage, filterCtx);}
document.body.appendChild(filter);

var drawNormal = function(image, ctx) {
  ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, config.canvasWidth, config.canvasHeight);
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

canvas.addEventListener('mouseenter', function(e) { handleMouseMove(e); });
canvas.addEventListener('mouseleave', function(e) { drawNormal(wallImage, ctx); });

var handleMouseMove = function(e) {
  var wallPixels = ctx.getImageData(0, 0, cw, ch);
  var filterPixels = filterCtx.getImageData(0, 0, cw, ch);
  var filterData = Filters.multiply(wallPixels, filterPixels);
  ctx.putImageData(filterData, 0, 0);
  e.preventDefault();
  e.stopPropagation();
  var mouseX = parseInt(e.clientX - offsetX);
  var mouseY = parseInt(e.clientY - offsetY);
//  draw(filterCtx, mouseX, mouseY, config.radius);
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

