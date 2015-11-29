
/*

Get day and night world geometry and dumps to a GeoJSON file. This module is
partially a port from Python Matplotlib Basemap solar module.


Several functions are ported to javascript from Python Matplotlib Basemap
library, mainly developed by Jeff Whitaker (NOAA - Earth System Research Laboratory).
https://github.com/matplotlib/basemap

Python Matplotlib Basemap original open source license is adopted for this library.

copyright (c) 2015 by Cayetano Benavent.
copyright (c) 2011 by Jeffrey Whitaker.

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


var GeoJSON = require('geojson');


function JulianDayFromDate(date, calendar){
    /*
    creates a Julian Day from a 'datetime-like' object.  Returns the fractional
    Julian Day (resolution 1 second).

    if calendar='standard' or 'gregorian' (default), Julian day follows Julian
    Calendar on and before 1582-10-5, Gregorian calendar after 1582-10-15.

    if calendar='proleptic_gregorian', Julian Day follows gregorian calendar.

    if calendar='julian', Julian Day follows julian calendar.

    Algorithm:
    Meeus, Jean (1998) Astronomical Algorithms (2nd Edition). Willmann-Bell,
    Virginia. p. 63
    */

    // based on redate.py by David Finlayson.
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1;
    var day = date.getUTCDate();
    var hour = date.getUTCHours();
    var minute = date.getUTCMinutes();
    var second = date.getUTCSeconds();

    var A, B, jd;

    // Convert time to fractions of a day
    day = day + hour / 24.0 + minute / 1440.0 + second / 86400.0;

    // Start Meeus algorithm (variables are in his notation)
    if (month < 3){
        month = month + 12;
        year = year - 1;
    }

    A = Math.floor(year / 100);
    jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day - 1524.5;

    // optionally adjust the jd for the switch from
    // the Julian to Gregorian Calendar
    // here assumed to have occurred the day after 1582 October 4
    if (calendar == 'standard' || calendar == 'gregorian') {
        if (jd >= 2299170.5) {
            // 1582 October 15 (Gregorian Calendar)
            B = 2 - A + Math.floor(A / 4);
        } else if (jd < 2299160.5) {
            // 1582 October 5 (Julian Calendar)
            B = 0;
        } else {
            var impossibleDateError = new Error('Impossible date (falls in gap between ' +
                                                'end of Julian calendar and beginning ' +
                                                'of Gregorian calendar');
            throw impossibleDateError;
        }
    } else if (calendar == 'proleptic_gregorian') {
        B = 2 - A + Math.floor(A / 4);
    } else if (calendar == 'julian') {
        B = 0;
    } else {
      var unknownCalendarError = new Error('unknown calendar, must be one of julian, ' +
                                           'standard, gregorian, proleptic_gregorian, ' +
                                           'got ' + calendar);
      throw unknownCalendarError;
    }

    // adjust for Julian calendar if necessary
    jd = jd + B;

    return jd;
    // return [year, month, day, hour, minute, second, A, jd];
}


function epem(date){
    /*
    input: date - datetime object (assumed UTC)
    ouput: gha - Greenwich hour angle, the angle between the Greenwich
           meridian and the meridian containing the subsolar point.
           dec - solar declination.
    */

    var dg2rad = Math.PI / 180.;
    var rad2dg = 1. / dg2rad;

    // compute julian day from UTC datetime object.
    // datetime objects use proleptic gregorian calendar.
    var jday = JulianDayFromDate(date, 'proleptic_gregorian');
    var jd = Math.floor(jday);  // truncate to integer.

    // UTC hour.
    var ut = date.getUTCHours() + date.getUTCMinutes() / 60. + date.getUTCSeconds() / 3600.;

    // calculate number of centuries from J2000
    var t = (jd + (ut / 24.) - 2451545.0) / 36525.;

    // mean longitude corrected for aberration
    var l = (280.460 + 36000.770 * t) % 360;

    // mean anomaly
    var g = 357.528 + 35999.050 * t;

    // ecliptic longitude
    var lm = l + 1.915 * Math.sin(g * dg2rad) + 0.020 * Math.sin(2 * g * dg2rad);

    // obliquity of the ecliptic
    var ep = 23.4393 - 0.01300 * t;

    // equation of time
    var eqt01 = -1.915 * Math.sin(g * dg2rad);
    var eqt02 = 0.020 * Math.sin(2 * g * dg2rad);
    var eqt03 = 2.466 * Math.sin(2 * lm * dg2rad);
    var eqt04 = 0.053 * Math.sin(4 * lm * dg2rad);
    var eqtime = eqt01 - eqt02 + eqt03 - eqt04;

    // Greenwich hour angle
    var gha = 15 * ut - 180 + eqtime;

    // declination of sun
    var dec = Math.asin(Math.sin(ep * dg2rad) * Math.sin(lm * dg2rad)) * rad2dg;

    return [gha, dec];
}

function daynight_terminator(date, lonmin, lonmax, delta) {
    /*
    date is datetime object (assumed UTC).
    nlons is # of longitudes used to compute terminator.
    */

    var dg2rad = Math.PI / 180.

    var minLon = lonmin;
    var maxLon = lonmax;
    var lons = [];
    while (minLon <= maxLon) {
        lons.push(minLon);
        minLon = minLon + delta;
    }

    // compute greenwich hour angle and solar declination
    // from datetime object (assumed UTC).
    var ep = epem(date);
    var tau = ep[0], dec = ep[1];

    // compute day/night terminator from hour angle, declination.
    var lats = [];
    for (ln in lons) {
        lats.push(Math.atan(-Math.cos((lons[ln] + tau) * dg2rad) / Math.tan(dec * dg2rad)) / dg2rad);
    }

    return [lons, lats, tau, dec];
}

function getLatClose(dec, latmax, latmin) {
    /*
    Function to get closing latitude...
    */

    if (dec > 0) {
        // Northern hemisphere summer
        return latmin;
    } else {
        // Southern hemisphere summer
        return latmax;
    }
}

function dn2geojson(datetocomp, delta, latmax, lonmax, latmin, lonmin) {
    /*
    Get day and night world geometry and dumps to a GeoJSON file.
    */

    var calendar = 'standard';

    if (isNaN(delta) || delta <= 0) {
        var deltaError = new Error("Delta argument must be a positive integer...");
        throw deltaError;
    }

    if (isNaN(latmax) || isNaN(lonmax) || isNaN(latmin) || isNaN(lonmin)) {
        var coordError = new Error("Coordinate arguments must be numbers...");
        throw coordError;

    } else {
        if (latmax < 80) {
          latmax = 80;
        } else if (latmax > 90){
          latmax = 90;
        }
        if (latmin > -80) {
          latmin = -80;
        } else if (latmin < -90){
          latmin = -90;
        }
        if (lonmin >= lonmax || lonmax - lonmin < 10) {
          lonmax = 180;
          lonmin = -180;
        }
        if (lonmax > 180) {
          lonmax = 180;
        }
        if (lonmin < -180) {
          lonmin = -180;
        }

        var dt = new Date();

        if (datetocomp.length === 5) {
            var year = datetocomp[0];
            var month = datetocomp[1];
            var day = datetocomp[2];
            var hour = datetocomp[3];
            var minutes = datetocomp[4];

            if ( year || month || day || hour || minutes) {
                dt.setFullYear(year, month, day);
                dt.setHours(hour);
                dt.setMinutes(minutes);
                dt.setSeconds(0);
                dt.setMilliseconds(0);
            }
        }
        var dn_ter = daynight_terminator(dt, lonmin, lonmax, delta);

        var cLons = dn_ter[0];
        var cLats = dn_ter[1];

        var gjs_pl = [];
        var feat_ln = [];

        var i;
        var n = cLons.length;

        for (i = 0; i < n; ++i) {
            feat_ln.push([cLons[i], cLats[i]]);
        }

        var lat_close = getLatClose(dn_ter[3], latmax, latmin);

        // Closing polygon
        feat_ln.push([lonmax, lat_close]);
        feat_ln.push([lonmin, lat_close]);
        feat_ln.push([cLons[0], cLats[0]]);

        gjs_pl.push({'polygon': [feat_ln], 'date': dt})

        var gjsOut_pl = GeoJSON.parse(gjs_pl, {Polygon: 'polygon'});

        return gjsOut_pl;
    }
}

module.exports.dn2geojson = dn2geojson;
