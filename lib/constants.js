require("sylvester");

var Constants = {};

module.exports = Constants;

Constants.EARTH_RADIUS = 6371.0;
Constants.MU = 398600.0;

Constants.I = $V([1, 0, 0]);
Constants.J = $V([0, 1, 0]);
Constants.K = $V([0, 0, 1]);
