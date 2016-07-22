'use strict'; 

var config = require('./config');

var startX = config.canvasWidth / 2;
var startY = config.canvasHeight / 2;

var PanLag = function(target) {
  this.friction = {x:0.97, y:0.97};
  this.velocity = {x:0, y:0};
  this.x = startX;
  this.y = startY;
  this.target = target;
};

PanLag.prototype.update = function(){
  this.lastX = this.target.x;
  this.lastY = this.target.y
  this.velocity.x = (this.target.x - this.x) * ( 1 - this.friction.x );
  this.velocity.y = (this.target.y - this.y) * ( 1 - this.friction.y );
  this.x += Math.round(this.velocity.x);
  this.y += Math.round(this.velocity.y);
};

module.exports = PanLag;
