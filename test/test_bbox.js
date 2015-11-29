/*
  Basic usage to compute now (UTC) with limited bounding box:
*/


var bmsl = require("../dn2geojson");

var delta = 1;
var latmin = -80., latmax = 80., lonmin = -60., lonmax = 60.;

var datetocomp = [];

var res_geojson = bmsl.dn2geojson(datetocomp, delta, latmax, lonmax, latmin, lonmin);

console.log(JSON.stringify(res_geojson, null, " "));
