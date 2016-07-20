var Filters = {};

Filters.getPixels = function (ctx, x, y, cw, ch) {
  return ctx.getImageData(x, y, cw, ch);
};

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

module.exports = Filters;
