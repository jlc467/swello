/* eslint-env node */
'use strict';

module.exports = {
  getForecastFromCoords,
  getDayForecastFromCoordsAndTime
};

const RSVP = require('rsvp');
const Forecast = require('forecast.io');
const config = require('../../config/server.js');
const options = {
  APIKey: config.FORECASTIO_KEY,
  timeout: config.FORECASTIO_TIMEOUT
};


const forecast = new Forecast(options);

// for full forecast
function getForecastFromCoords(coords) {
  const queryString = {
    exclude: 'minutely,flags,alerts',
    extend: 'hourly'
  };
  const promise = new RSVP.Promise(function promise(resolve, reject) {
    forecast.get(coords.lat, coords.long, queryString, (err, res, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
  return promise;
}

// for current forecast
function getDayForecastFromCoordsAndTime(coords, time) {
  const queryString = {
    exclude: 'daily,minutely,hourly,flags,alerts'
  };
  const promise = new RSVP.Promise(function promise(resolve, reject) {
    forecast.getAtTime(coords.lat, coords.long, time, queryString, (err, res, data) => {
      if (err) reject(err);
      console.log(res.statusCode, data);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve(data);
      } else {
        reject({ code: res.statusCode });
      }
    });
  });
  return promise;
}
