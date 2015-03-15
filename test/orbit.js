require("sylvester");

var Kepler = require("../lib/kepler"),
    expect = require("chai").expect;

describe("Orbit", function() {
  describe("Calculating orbital elements from state vectors", function() {
    var orbit;

    before(function() {
      var r = $V([-6045, -3490, 2500]),
          v = $V([-3.457, 6.618, 2.533]);

      orbit = new Kepler.Orbit(r, v);
    });

    it("angularMomentum", function() {
      var actual = orbit.angularMomentum(),
          expected = $V([-25385.17, 6669.485, -52070.74]);
      expect(actual.eql(expected)).to.be.true;
    });

    it("radialVelocity", function() {
      var actual = orbit.radialVelocity(),
          expected = 0.55747;
      expect(expected).to.equal(toFixed(actual, 5));
    });

    it("eccentricity", function() {
      var actual = orbit.eccentricity(),
          expected = $V([-0.091604, -0.142207, 0.026443]);
      expect(actual.eql(expected)).to.be.true;
    });

    it("semimajorAxis", function() {
      var actual = orbit.semimajorAxis(),
          expected = 8788.09512;
      expect(expected).to.equal(toFixed(actual, 5));
    });

    it("semiminorAxis", function() {
      var actual = orbit.semiminorAxis(),
          expected = 8658.33143;
      expect(expected).to.equal(toFixed(actual, 5));
    });

    it("semilatusRectum", function() {
      var actual = orbit.semilatusRectum(),
          expected = 8530.48382;
      expect(expected).to.equal(toFixed(actual, 5));
    });

    it("inclination", function() {
      var actual = orbit.inclination(),
          expected = 153.24923;
      expect(expected).to.equal(toFixed(actual, 5));
    });

    it("nodeLine", function() {
      var actual = orbit.nodeLine(),
          expected = $V([-6669.485, -25385.17, 0.0]);
      expect(actual.eql(expected)).to.be.true;
    });

    it("rightAscension", function() {
      var actual = orbit.rightAscension(),
          expected = 255.27929;
      expect(expected).to.equal(toFixed(actual, 5));
    });

    it("argumentOfPeriapsis", function() {
      var actual = orbit.argumentOfPeriapsis(),
          expected = 20.06832;
      expect(expected).to.equal(toFixed(actual, 5));
    });

    it("trueAnomaly", function() {
      var actual = orbit.trueAnomaly(),
          expected = 28.44563;
      expect(expected).to.equal(toFixed(actual, 5));
    });

    it("apoapsis", function() {
      var actual = orbit.apoapsis(),
          expected = 10292.7255;
      expect(expected).to.equal(toFixed(actual, 5));
    });

    it("periapsis", function() {
      var actual = orbit.periapsis(),
          expected = 7283.46473;
      expect(expected).to.equal(toFixed(actual, 5));
    });

    it("period", function() {
      var actual = orbit.period(),
          expected = 8198.85762;
      expect(expected).to.equal(toFixed(actual, 5));
    });
  });

  describe("Updating state after dt", function() {
    var orbit;

    beforeEach(function() {
      var r = $V([7000, -12124, 0]),
          v = $V([2.6679, 4.6210, 0]);

      orbit = new Kepler.Orbit(r, v);
    });

    it("universalAnomaly", function() {
      var actual = orbit.universalAnomaly(3600),
          expected = 253.53449;
      expect(expected).to.equal(toFixed(actual, 5));
    });

    it("update", function() {
      orbit = orbit.update(3600);

      var rExpected = $V([-3297.768625, 7413.396645, 0.0]),
          vExpected = $V([-8.297603, -0.9640449, -0.0]);

      expect(orbit.r.eql(rExpected)).to.be.true;
      expect(orbit.v.eql(vExpected)).to.be.true;
    });
  });

  describe("Set state with common params", function() {
    var orbit;

    beforeEach(function() {
      // values taken from Orbital Mechanics for Engineering Students, Example 4.7
      orbit = Kepler.Orbit.fromParams({
        semilatusRectum: 16056.196688409433,
        eccentricity: 1.4,
        inclination: 30,
        argumentOfPeriapsis: 60,
        rightAscension: 40,
        trueAnomaly: 30
      });
    });

    it("state", function() {
      var rExpected = $V([-4039.895923, 4814.560480, 3628.624702]),
          vExpected = $V([-10.385987, -4.771921, 1.743875]);

      expect(orbit.r.eql(rExpected)).to.be.true;
      expect(orbit.v.eql(vExpected)).to.be.true;
    });
  });

  describe("Set state with apogee and perigee", function() {
    var orbit;

    beforeEach(function() {
      // values taken from Orbital Mechanics for Engineering Students, Example 4.7
      orbit = Kepler.Orbit.fromParams({
        apogee: 416,
        perigee: 405,
        inclination: 51.65,
        rightAscension: 304.0847,
        argumentOfPeriapsis: 117.7713
      });
    });

    it("state", function() {
      var rExpected = $V([1311.563646, 4699.598648, 4701.881415]),
          vExpected = $V([-5.641883, 4.379639, -2.8037407]);

      expect(orbit.r.eql(rExpected)).to.be.true;
      expect(orbit.v.eql(vExpected)).to.be.true;
    });
  });
});

function toFixed(num, precision) {
  return Number(num.toFixed(precision));
}
