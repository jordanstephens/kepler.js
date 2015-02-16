var Stumpff = require("./stumpff");

var Sylvester = require("sylvester");

var Lagrange = {}

module.exports = Lagrange;

Lagrange.f = function f(x, z, r) {
  var c = Stumpff.c(z);
  return 1 - (Math.pow(x, 2) / r.norm()) * c;
};

Lagrange.g = function g(x, z, mu, dt) {
  var s = Stumpff.s(z);
  return dt - ((1 / Math.sqrt(mu)) * Math.pow(x, 3) * s);
};

Lagrange.df = function df(x, z, r, r0, mu) {
  var s = Stumpff.s(z);
  return (Math.sqrt(mu) / (r.norm() * r0.norm())) * (s * z - 1) * x;
};

Lagrange.dg = function dg(x, z, r) {
  var c = Stumpff.c(z);
  return 1 - ((Math.pow(x, 2) / r.norm()) * c);
};
