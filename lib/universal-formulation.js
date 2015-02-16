var Stumpff = require("./stumpff");

var Sylvester = require("sylvester");

var UniversalFormulation = {};

module.exports = UniversalFormulation;

function _z(x, a) {
  return Math.pow(x, 2) / a;
};
UniversalFormulation.z = _z;

UniversalFormulation.f = function f(x, a, r, v, mu, dt) {
  var z = _z(x, a),
      s = Stumpff.s(z),
      c = Stumpff.c(z);

  return (
    ((1 - (r.norm() / a)) * s * Math.pow(x, 3)) +
    ((r.dot(v) / Math.sqrt(mu)) * c * Math.pow(x, 2)) +
    (r.norm() * x) -
    (Math.sqrt(mu) * dt)
  );
};

UniversalFormulation.dfdt = function dfdt(x, a, r, v, mu) {
  var z = _z(x, a),
      s = Stumpff.s(z),
      c = Stumpff.c(z);

  return (
    (c * Math.pow(x, 2)) +
    ((r.dot(v) / Math.sqrt(mu)) * (1 - (s * z)) * x) +
    (r.norm() * (1 - (c * z)))
  );
};

UniversalFormulation.d2fdt = function d2fdt(x, a, r, v, mu) {
  var z = _z(x, a),
      s = Stumpff.s(z),
      c = Stumpff.c(z);

  return (
    ((1 - (r.norm() / a)) * (1 - (s * z)) * x) +
    ((r.dot(v) / Math.sqrt(mu)) * (1 - (c * z)))
  );
};
