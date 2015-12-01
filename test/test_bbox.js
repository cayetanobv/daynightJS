/*
  Basic usage to compute now (UTC) with limited bounding box:

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
var latmin = -80., latmax = 80., lonmin = -60., lonmax = 60.;

var datetocomp = [];

var res_geojson = bmsl.dn2geojson(datetocomp, delta, latmax, lonmax, latmin, lonmin);

console.log(JSON.stringify(res_geojson, null, " "));
