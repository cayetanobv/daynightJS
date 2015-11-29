/*
  Basic usage to compute now (UTC):
*/

var bmsl = require("../dn2geojson");

var delta = 1;
var latmin = -90., latmax = 90., lonmin = -180., lonmax = 180.;

var datetocomp = [];

var res_geojson = bmsl.dn2geojson(datetocomp, delta, latmax, lonmax, latmin, lonmin);

console.log(JSON.stringify(res_geojson, null, " "));
