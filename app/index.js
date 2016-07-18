'use strict';

var config = require('./config');

var canvas = document.getElementById('wall');
var ctx = canvas.getContext('2d');
var cw = canvas.width;
var ch = canvas.height;
var offsetX;
var offsetY;
var wallImage = new Image();
wallImage.src = config.wallImageSrc;

function reOffset() {
  var BB = canvas.getBoundingClientRect();
  offsetX = BB.left;
  offsetY = BB.top;
};

reOffset();

window.onscroll = function(e) { reOffset(); };
window.onresize = function(e) { reOffset(); };

canvas.addEventListener('mousemove', function(e) { handleMouseMove(e); });

wallImage.onload = function() {
  //resize large jpg to fit into the canvas
  //ctx.drawImage(wallImage, 0, 0, config.wallImageWidth, config.wallImageHeight, 0, 0, cw, ch);
  draw(cw / 2, ch / 2, config.radius);
};

function draw(cx, cy, radius) {
  ctx.save();
  ctx.clearRect(0, 0, cw, ch);
  var radialGradient = ctx.createRadialGradient(cx, cy, 1, cx, cy, config.radius);
  radialGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
  radialGradient.addColorStop(.5, 'rgba(0, 0, 0, 1)');
  radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.beginPath();
  ctx.arc(cx, cy, config.radius, 0, Math.PI*2);
  ctx.fillStyle = radialGradient;
  ctx.fill();
  ctx.globalCompositeOperation = 'source-atop';
  ctx.drawImage(wallImage, 0, 0, config.wallImageWidth, config.wallImageHeight, 0, 0, cw, ch);
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, cw, ch);
  ctx.restore();
};

function handleMouseMove(e) {
  e.preventDefault();
  e.stopPropagation();
  var mouseX = parseInt(e.clientX - offsetX);
  var mouseY = parseInt(e.clientY - offsetY);
  draw(mouseX, mouseY, config.radius);

};

