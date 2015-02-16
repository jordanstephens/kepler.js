var Laguerre = {}

module.exports = Laguerre;

Laguerre.solve = function solve(guess, fn, dfn, d2fn) {
  var x = guess,
      n = 0;

  do {
    var f = fn(x),
        fPrime = dfn(x),
        fPrimePrime = d2fn(x),
        delta = 2 * Math.sqrt(
          (4 * Math.pow(fPrime, 2)) -
          (5 * f * fPrimePrime)
        ),
        dx = (5 * f) / (fPrime + ((Math.abs(fPrime) / fPrime) * delta));

    x = x - dx;
    n += 1;
  } while (!(dx == 0 || n > 10));

  return x;
};
