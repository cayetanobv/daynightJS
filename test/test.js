/*
  Basic usage to compute a given day:

  copyright (c) 2015 by Cayetano Benavent.

  Permission to use, copy, modify, and distribute this software and its documentation
  for any purpose and without fee is hereby granted, provided that the above copyright
  notices appear in all copies and that both the copyright notices and this permission
  notice appear in supporting documentation. THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS.
  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES
  OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION
  WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

var bmsl = require("../dn2geojson");

var delta = 1;
var latmin = -90., latmax = 90., lonmin = -180., lonmax = 180.;

// var year = 2015, month = 9, day = 29, hour = 9, minutes = 0;
var year = 2015, month = 10, day = 22, hour = 12, minutes = 0;
var datetocomp = [year, month, day, hour, minutes];

var res_geojson = bmsl.dn2geojson(datetocomp, delta, latmax, lonmax, latmin, lonmin);

console.log(JSON.stringify(res_geojson, null, " "));
