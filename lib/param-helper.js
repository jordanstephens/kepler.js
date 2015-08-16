require("es6-object-assign").polyfill();

var intersect = require("intersect"),
    arrayIsEqual = require("array-equal"),
    constants = require("./constants");

var ParamHelper = {};

module.exports = ParamHelper;

var MINIMUM_PARAM_SETS = [
  ["semimajorAxis", "eccentricity"],
  ["semilatusRectum", "eccentricity"],
  ["apogee", "perigee"]
];

var DEFAULT_PARAMS = {
  inclination: 0.0,
  argumentOfPeriapsis: 0.0,
  rightAscension: 0.0,
  trueAnomaly: 0.0,
  eccentricity: 0.0
};

ParamHelper.stateFromParams = function stateFromParams(params) {
  var params = expandedParams(params)
      r_p = perifocalPosition(
        params.angularMomentum,
        params.eccentricity,
        params.trueAnomaly,
        params.mu
      ),
      v_p = perifocalVelocity(
        params.angularMomentum,
        params.eccentricity,
        params.trueAnomaly,
        params.mu
      ),
      q = transformMatrix(
        params.argumentOfPeriapsis,
        params.inclination,
        params.rightAscension
      );
  return {
    r: q.x(r_p),
    v: q.x(v_p)
  };
};

function expandedParams(params) {
  params = baseParams(params);

  var paramKeys = Object.keys(params);

  if (paramKeys.indexOf("apogee") !== -1 && paramKeys.indexOf("perigee") !== -1) {
    params.semimajorAxis = semimajorAxisFromApogeeAndPerigee(params.apogee, params.perigee, params.centralBodyRadius);
    params.eccentricity = eccentricityFromSemimajorAxisAndPerigee(params.semimajorAxis, params.perigee, params.centralBodyRadius);
  } else if (paramKeys.indexOf("semilatusRectum") !== -1) {
    params.semimajorAxis = semimajorAxisFromSemilatusRectumAndEccentricity(params.semilatusRectum, params.eccentricity);
  }

  if (paramKeys.indexOf("semilatusRectum") === -1) {
    params.semilatusRectum = semilatusRectumFromSemimajorAxisAndEccentricity(params.semimajorAxis, params.eccentricity);
  }

  params.angularMomentum = angularMomentumFromSemilatusRectum(params.semilatusRectum);

  return params;
};

function perifocalPosition(angularMomentum, eccentricity, trueAnomaly, mu) {
  var h = angularMomentum,
      e = eccentricity,
      theta = toRad(trueAnomaly);

  return (
    $V([Math.cos(theta), Math.sin(theta), 0]).x(
      (Math.pow(h, 2) / mu) *
      (1 / (1 + (e * Math.cos(theta))))
    )
  );
};

function perifocalVelocity(angularMomentum, eccentricity, trueAnomaly, mu) {
  var h = angularMomentum,
      e = eccentricity,
      theta = toRad(trueAnomaly);

  return (
    $V([-Math.sin(theta), e + Math.cos(theta), 0]).x(
      (mu / h)
    )
  );
};

function transformMatrix(argumentOfPeriapsis, inclination, rightAscension) {
    var w = toRad(argumentOfPeriapsis),
        i = toRad(inclination),
        omega = toRad(rightAscension),

        sin_omega = Math.sin(omega),
        cos_omega = Math.cos(omega),
        sin_i = Math.sin(i),
        cos_i = Math.cos(i),
        sin_w = Math.sin(w),
        cos_w = Math.cos(w);

    return $M([
      [-sin_omega * cos_i * sin_w + (cos_omega * cos_w),
       -sin_omega * cos_i * cos_w - (cos_omega * sin_w),
       sin_omega * sin_i],
      [cos_omega * cos_i * sin_w + (sin_omega * cos_w),
       cos_omega * cos_i * cos_w - (sin_omega * sin_w),
       -cos_omega * sin_i],
      [sin_i * sin_w,
       sin_i * cos_w,
       cos_i]
    ]);
};

function baseParams(params) {
  var paramSet = MINIMUM_PARAM_SETS.find(function(rp) {
    var intersection = intersect(Object.keys(params), rp);
    return arrayIsEqual(intersection, rp);
  });

  if (!paramSet) {
    throw new Error("Invalid parameter set");
  }

  params.mu = constants.MU;
  params.centralBodyRadius = constants.EARTH_RADIUS;

  return Object.assign({}, DEFAULT_PARAMS, params);
}

function angularMomentumFromSemilatusRectum(semilatusRectum) {
  return Math.sqrt(semilatusRectum * constants.MU);
}

function semilatusRectumFromSemimajorAxisAndEccentricity(semimajorAxis, eccentricity) {
  return semimajorAxis * (1 - (Math.pow(eccentricity, 2)));
}

function semimajorAxisFromSemilatusRectumAndEccentricity(semilatusRectum, eccentricity) {
  return semilatusRectum / (1 - Math.pow(eccentricity, 2));
}

function semimajorAxisFromApogeeAndPerigee(apogee, perigee, centralBodyRadius) {
  return ((centralBodyRadius * 2) + apogee + perigee) / 2.0;
}

function eccentricityFromSemimajorAxisAndPerigee(semimajorAxis, perigee, centralBodyRadius) {
  return (semimajorAxis / (centralBodyRadius + perigee)) - 1;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

