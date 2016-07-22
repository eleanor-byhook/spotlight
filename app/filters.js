var Filters = {};

Filters.multiply = function(bgPixels, filterPixels) {
  var d1 = bgPixels.data;
  var d2 = filterPixels.data;
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
  return bgPixels;
}

module.exports = Filters;
