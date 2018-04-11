const Map = function (value, smin, smax, emin, emax) {
  return emin + ((value - smin) / (smax - smin)) * (emax - emin)
}

export {
  Map
}