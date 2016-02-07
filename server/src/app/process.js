/* eslint-env node */
'use strict';

module.exports = {
  getForecastTextFromUrl,
  getForecastUrl
};


const request = require('superagent');
const zones = require('../data/zone-links.json');
const RSVP = require('rsvp');
const objectAssign = require('object-assign');
const parseForecastText = require('./parseForecastText').parseForecastText;

function getForecastUrl(zoneId) {
  return zones[zoneId.toLowerCase()] || null;
}

function getForecastTextFromUrl(zoneUrl) {
  const promise = new RSVP.Promise((resolve, reject) => {
    if (zoneUrl === null) {
      reject({
        error: 'Zone Not Found.',
        detail: 'List of valid zones here: http://weather.noaa.gov/pub/data/forecasts/marine/ ' +
        'e.g. for anz050.txt pass anz050',
        raw: null,
        zoneUrl: null
      });
    }

    request
    .get(zoneUrl)
    .end((err, res) => {
      if (!err) {
        try {
          resolve(objectAssign({}, parseForecastText(res.text), {zoneUrl: zoneUrl}));
        } catch (exception) {
          reject({
            error: 'Zone parse failed',
            detail: exception.message,
            raw: res.text,
            zoneUrl: zoneUrl
          });
        }
      } else {
        reject(err);
      }
    });
  });

  return promise;
}
