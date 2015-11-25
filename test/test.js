

var bmsl = require("../dn2geojson");

var delta = 1;
var latmin = -90., latmax = 90., lonmin = -180., lonmax = 180.;
var year, month, day, hour, minutes;

// year = 2015, month = 9, day = 29, hour = 9, minutes = 0;
// year = 2015, month = 10, day = 22, hour = 12, minutes = 0;

var res_geojson = bmsl.dn2geojson(year, month, day, hour, minutes, delta, latmax, lonmax, latmin, lonmin);

console.log(JSON.stringify(res_geojson, null, " "));
