'use strict';

var config = require('./config');

var canvas = document.getElementById('wall');
var ctx = canvas.getContext('2d');
var cw = canvas.width;
var ch = canvas.height;

/* Mouse controlled masking  */
/*
var offsetX;
var offsetY;
function reOffset() {
  var BB = canvas.getBoundingClientRect();
  offsetX = BB.left;
  offsetY = BB.top;
}
reOffset();
window.onscroll = function(e) { reOffset(); };
window.onresize = function(e) { reOffset(); };
*/


/*********************
 Initial canvas image load 
 *********************/

var wallImage = new Image();
wallImage.src = config.wallImageSrc;

var drawNormal = function() {
  //resize large jpg to fit into the canvas
  ctx.drawImage(wallImage, 0, 0, config.wallImageWidth, config.wallImageHeight, 0, 0, cw, ch);
};

wallImage.onload = function() { drawNormal(); };

/**********************
 Image filters 
*********************/
var Filters = {};
Filters.getPixels = function(img) {
  return ctx.getImageData(0, 0, cw, ch);
}

Filters.filterImage = function(filter, image) {
  var args = [this.getPixels(image)];
  for(var i = 2; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return filter.apply(null, args);
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


canvas.addEventListener('mouseenter', function(e) { handleMouseMove(e); });
canvas.addEventListener('mouseleave', function(e) { drawNormal();});

function handleMouseMove(e) {
  var filterData = Filters.filterImage(Filters.grayscale, wallImage);
  ctx.putImageData(filterData, 0, 0);
}



