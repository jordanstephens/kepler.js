var Stumpff = {}

Stumpff.c = function c(z) {
  var value;
  if (z > 0) {
    value = (1 - Math.cos(Math.sqrt(z))) / z;
  } else if (z < 0) {
    value = (Math.cosh(Math.sqrt(-z)) - 1) / (-z);
  } else {
    value = 0.5;
  }
  return value;
};

Stumpff.s = function s(z) {
  var value;
  if (z > 0) {
    value = (Math.sqrt(z) - Math.sin(Math.sqrt(z))) / Math.pow(Math.sqrt(z), 3);
  } else if (z < 0) {
    value = (Math.sinh(Math.sqrt(-z)) - Math.sqrt(-z)) / Math.pow(Math.sqrt(-z), 3);
  } else {
    value = 1 / 6;
  }
  return value;
};

module.exports = Stumpff;
