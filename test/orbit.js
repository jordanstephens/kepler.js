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
      var actual = orbit.radialVelocity().toFixed(5),
          expected = 0.55747;
      expect(actual == expected).to.be.true;
    });

    it("eccentricity", function() {
      var actual = orbit.eccentricity(),
          expected = $V([-0.091604, -0.142207, 0.026443]);
      expect(actual.eql(expected)).to.be.true;
    });

    it("semimajorAxis", function() {
      var actual = orbit.semimajorAxis().toFixed(5),
          expected = 8788.09512;
      expect(actual == expected).to.be.true;
    });

    it("semilatusRectum", function() {
      var actual = orbit.semilatusRectum().toFixed(5),
          expected = 8530.48382;
      expect(actual == expected).to.be.true;
    });

    it("inclination", function() {
      var actual = orbit.inclination().toFixed(5),
          expected = 153.24923;
      expect(actual == expected).to.be.true;
    });

    it("nodeLine", function() {
      var actual = orbit.nodeLine(),
          expected = $V([-6669.485, -25385.17, 0.0]);
      expect(actual.eql(expected)).to.be.true;
    });

    it("rightAscension", function() {
      var actual = orbit.rightAscension().toFixed(5),
          expected = 255.27929;
      expect(actual == expected).to.be.true;
    });

    it("argumentOfPeriapsis", function() {
      var actual = orbit.argumentOfPeriapsis().toFixed(5),
          expected = 20.06832;
      expect(actual == expected).to.be.true;
    });

    it("trueAnomaly", function() {
      var actual = orbit.trueAnomaly().toFixed(5),
          expected = 28.44563;
      expect(actual == expected).to.be.true;
    });

    it("apoapsis", function() {
      var actual = orbit.apoapsis().toFixed(5),
          expected = 10292.7255;
      expect(actual == expected).to.be.true;
    });

    it("periapsis", function() {
      var actual = orbit.periapsis().toFixed(5),
          expected = 7283.46473;
      expect(actual == expected).to.be.true;
    });

    it("period", function() {
      var actual = orbit.period().toFixed(5),
          expected = 8198.85762;
      expect(actual == expected).to.be.true;
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
      var actual = orbit.universalAnomaly(3600).toFixed(5),
          expected = 253.53449;
      expect(actual == expected).to.be.true;
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

