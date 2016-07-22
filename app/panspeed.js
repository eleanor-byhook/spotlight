'use strict'; 

var Panning = function(target) {
  this.friction = {x:0.95, y:0.95};
  this.velocity = {x:0, y:0};
  this.x = 0;
  this.y = 0;
  this.target = target;
};

Panning.prototype.update = function(){
  this.lastX = this.target.x;
  this.lastY = this.target.y
  this.velocity.x = (this.target.x - this.x) * ( 1 - this.friction.x );
  this.velocity.y = (this.target.y - this.y) * ( 1 - this.friction.y );
  this.x += Math.round(this.velocity.x);
  this.y += Math.round(this.velocity.y);
};

module.exports = Panning;
