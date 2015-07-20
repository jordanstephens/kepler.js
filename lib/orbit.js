var Sylvester = require("sylvester");

var ParamHelper = require("./param-helper"),
    constants = require("./constants"),
    UniversalFormulation = require("./universal-formulation"),
    Lagrange = require("./lagrange"),
    Laguerre = require("./laguerre");

module.exports = Orbit;

function Orbit(r, v, opts) {
  this.r = r;
  this.v = v;
  this.mu = (opts && opts.mu) || constants.MU;
  this.centralBodyRadius = (opts && opts.centralBodyRadius) || constants.EARTH_RADIUS;
}

Orbit.fromParams = function fromParams(params) {
  var state = ParamHelper.stateFromParams(params);

  return new Orbit(state.r, state.v, {
    mu: params.mu,
    centralBodyRadius: params.centralBodyRadius
  });
};

Orbit.prototype.angularMomentum = function angularMomentum() {
  return this.r.cross(this.v);
};

Orbit.prototype.radialVelocity = function radialVelocity() {
  return this.r.dot(this.v) / this.r.norm();
};

Orbit.prototype.eccentricity = function eccentricity() {
  return this.r.x(
    Math.pow(this.v.norm(), 2) - (this.mu / this.r.norm())
  ).subtract(
    this.v.x(this.r.norm() * this.radialVelocity())
  ).x(1 / this.mu);
};

Orbit.prototype.semimajorAxis = function semimajorAxis() {
  var h = this.angularMomentum().norm(),
      e = this.eccentricity().norm();
  return (Math.pow(h, 2) / this.mu) *
    (1 / (1 - Math.pow(e, 2)));
};

Orbit.prototype.semiminorAxis = function semiminorAxis() {
  var a = this.semimajorAxis(),
      e = this.eccentricity().norm();
  return a * Math.sqrt(1 - Math.pow(e, 2));
}

Orbit.prototype.semilatusRectum = function semilatusRectum() {
  return Math.pow(this.angularMomentum().norm(), 2) / this.mu;
};

Orbit.prototype.inclination = function inclination() {
  var h = this.angularMomentum();
  return toDeg(Math.acos(constants.K.dot(h) / h.norm()));
};

Orbit.prototype.nodeLine = function nodeLine() {
  return constants.K.cross(this.angularMomentum());
};

Orbit.prototype.rightAscension = function rightAscension() {
  var n = this.nodeLine();
  if (n.norm() === 0) { return 0; }
  var omega = toDeg(Math.acos(n.elements[0] / n.norm()));
  return n.elements[1] < 0 ? (360 - omega) : omega;
};

Orbit.prototype.argumentOfPeriapsis = function argumentOfPeriapsis() {
  var n = this.nodeLine();
  if (n.norm() === 0) { return 0; }
  var e = this.eccentricity(),
      w = toDeg(Math.acos(n.dot(e) / (n.norm() * e.norm())));
  return n.elements[2] < 0 ? (360 - w) : w;
};

Orbit.prototype.trueAnomaly = function trueAnomaly() {
  var e = this.eccentricity(),
      eNorm = parseFloat(e.norm().toFixed(5)),
      n = this.nodeLine(),
      nNorm = parseFloat(e.norm().toFixed(5)),
      l, u;

  if (eNorm === 0 && nNorm === 0) {
    u = toDeg(Math.acos(Math.min(1, this.r.elements[0] / this.r.norm())));
  } else {
    l = (eNorm === 0) ? n : e;
    u = toDeg(Math.acos(Math.min(1, l.dot(this.r) / (l.norm() * this.r.norm()))));
  }

  return this.r.dot(this.v) < 0 ? (360 - u) : u;
};

Orbit.prototype.periapsis = function periapsis() {
  var h = this.angularMomentum(),
      e = this.eccentricity();
  return (Math.pow(h.norm(), 2) / this.mu) * (1 / (1 + e.norm() * Math.cos(0)));
};

Orbit.prototype.apoapsis = function apoapsis() {
  var h = this.angularMomentum(),
      e = this.eccentricity();
  return (Math.pow(h.norm(), 2) / this.mu) * (1 / (1 + e.norm() * Math.cos(Math.PI)));
};

Orbit.prototype.period = function period() {
  var a = this.semimajorAxis();
  return (2 * Math.PI / Math.sqrt(this.mu)) * Math.sqrt(Math.pow(a, 3));
};

Orbit.prototype.universalAnomaly = function universalAnomaly(dt) {
  var a = this.semimajorAxis(),
      // initial guess of x
      x = Math.sqrt(this.mu) * (dt / a),
      r = this.r,
      v = this.v,
      mu = this.mu,
      f   = function(x) { return UniversalFormulation.f(x, a, r, v, mu, dt); },
      df  = function(x) { return UniversalFormulation.dfdt(x, a, r, v, mu); },
      d2f = function(x) { return UniversalFormulation.d2fdt(x, a, r, v, mu); };


  return Laguerre.solve(x, f, df, d2f);
};

Orbit.prototype.update = function update(dt) {
  var x = this.universalAnomaly(dt),
      a = this.semimajorAxis(),
      z = UniversalFormulation.z(x, a),
      r0 = this.r,
      v0 = this.v,
      mu = this.mu,

      // make sure you use the same `z` for calculating `this.r` and
      // `this.v`. this can be tricky because `z` depends on `this.r`
      // via `a` so we must be careful to not recalculate `z` between
      // updating `this.r` and updating `this.v`.
      r = r0.x(Lagrange.f(x, z, this.r)).add(v0.x(Lagrange.g(x, z, mu, dt))),
      v = r0.x(Lagrange.df(x, z, r, r0, mu)).add(v0.x(Lagrange.dg(x, z, r)));

  return new Orbit(r, v, {
    mu: mu,
    centralBodyRadius: this.centralBodyRadius
  });
};

function toDeg(rad) {
  return rad * (180 / Math.PI);
}

