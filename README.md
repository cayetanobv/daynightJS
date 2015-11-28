# DaynightJS
Get day and night world geometry and dumps to a GeoJSON file. This module is
partially a port to javascript from Python Matplotlib Basemap solar module.

Several functions are ported from Python Matplotlib Basemap library, mainly
developed by Jeff Whitaker (NOAA - Earth System Research Laboratory).
https://github.com/matplotlib/basemap

## Usage
Basic usage to compute a given day:
```javascript
var bmsl = require("./dn2geojson");

var delta = 1;
var latmin = -90., latmax = 90., lonmin = -180., lonmax = 180.;
var year, month, day, hour, minutes;

year = 2015, month = 9, day = 29, hour = 9, minutes = 0;

var res_geojson = bmsl.dn2geojson(year, month, day, hour, minutes, delta, latmax, lonmax, latmin, lonmin);

console.log(JSON.stringify(res_geojson, null, " "));
```
Basic usage to compute now (UTC):
```javascript
var bmsl = require("./dn2geojson");

var delta = 1;
var latmin = -90., latmax = 90., lonmin = -180., lonmax = 180.;
var year, month, day, hour, minutes;

var res_geojson = bmsl.dn2geojson(year, month, day, hour, minutes, delta, latmax, lonmax, latmin, lonmin);

console.log(JSON.stringify(res_geojson, null, " "));
```
Basic usage to compute now (UTC) with limited bounding box:
```javascript
var bmsl = require("./dn2geojson");

var delta = 1;
var latmin = -80., latmax = 80., lonmin = -60., lonmax = 60.;
var year, month, day, hour, minutes;

var res_geojson = bmsl.dn2geojson(year, month, day, hour, minutes, delta, latmax, lonmax, latmin, lonmin);

console.log(JSON.stringify(res_geojson, null, " "));
```

## Requirements
- Geojson.

For node, use npm:
```
$ npm install geojson
```

## About author
Developed by Cayetano Benavent.
GIS Analyst at Geographica.

http://www.geographica.gs


## License
Permission to use, copy, modify, and distribute this software and its documentation
for any purpose and without fee is hereby granted, provided that the above copyright
notices appear in all copies and that both the copyright notices and this permission
notice appear in supporting documentation. THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS.
IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES
OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION
WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
