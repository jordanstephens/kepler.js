# Kepler.js

[![Build Status](https://travis-ci.org/jordanstephens/kepler.js.svg?branch=master)](https://travis-ci.org/jordanstephens/kepler.js)

A package for working with two-body [Keplerian Orbits][0].

## Installation

Release pending, but you can source it in your package.json from Github for now.

**package.json**

```javascript
{
  "name": "my-package",
  "dependencies": {
    "kepler.js": "jordanstephens/kepler.js"
  }
}
```

## Usage

### Defining an Orbit

The easiest way to define an orbit is with [common orbital elements][1].

```javascript
var qzss = Kepler.Orbit.fromParams({
  semimajorAxis: 42164, // km
  eccentricity: 0.075,
  inclination: 43, // deg
  rightAscension: 195, // deg
  argumentOfPeriapsis: 270 // deg
});
```

*QZSS orbital parameters from [Wikipedia][2].*

You can also use more colloquial elements like `perigee` and `apogee` instead of `semimajorAxis` and `eccentricity`.

```javascript
var iss = Kepler.Orbit.fromParams({
  apogee: 426.9, // km
  perigee: 416.2, // km
  inclination: 51.65, // deg
  rightAscension: 304.1, // deg
  argumentOfPeriapsis: 117.8 // deg
});
```

*ISS orbital parameters from [Wolfram Alpha][3].*

Or you can use *position* (`r`) and *velocity* (`v`) vectors.

```javascript
var r = [-6045, -3490, 2500],
    v = [-3.457, 6.618, 2.533],
    orbit = new Kepler.Orbit(r, v);
```

### Orbital Attributes

Defining an orbit gives you access to the object's current *position* (`r`) and *velocity* (`v`) vectors along with many other attributes, including:

* `semimajorAxis`
* `semilatusRectum`
* `apoapsis`
* `periapsis`
* `eccentricity`
* `angularMomentum`
* `radialVelocity`
* `inclination`
* `rightAscension`
* `argumentOfPeriapsis`
* `trueAnomaly`
* `period`

### Updating an Orbit After `dt`

Once you have an initial orbit defined, you can get updated *position* (`r`) and *velocity* (`v`) vectors after a period of time (in seconds) has passed.

```javascript
iss.r // => [4427.6294614883145, 662.2433879237291, 5103.355851378229]
iss.v // => [-3.000020372892516, 6.843005359324254, 1.7091866273043546]

// Update vectors after 45 minutes have passed
iss.update!(60 * 45)

iss.r // => [-4662.9620885090435, -88.56494596532605, -4943.141439770972]
iss.v // => [2.5073027532818064, -6.876096362825007, -2.248327189819066]
```

## Caveats

* Only point objects are considered in a two-body environment.
* Perturbations due to atmospheric drag, solar radiation, etc are not considered.
* Nodal precession is not considered.

## Tests

Tests can be run with npm

    $ npm test

*Most of the specs contain values used in examples found in [Orbital Mechanics for Engineering Students][4].*

[0]: http://en.wikipedia.org/wiki/Kepler_orbit
[1]: http://en.wikipedia.org/wiki/Orbital_elements
[2]: http://en.wikipedia.org/wiki/Quasi-Zenith_Satellite_System
[3]: http://www.wolframalpha.com/input/?i=ISS+orbit
[4]: http://booksite.elsevier.com/9780123747785/
