/* eslint-env node */
'use strict';

module.exports = {
  getIssuedMoment,
  getDate,
  getTime
};


const utility = require('./utility');
const _ = require('lodash');
const moment = require('moment');

 // given a date string, e.g. 937 AM CST SAT NOV 7 2015, return {day, month, year} in numeric format
function getDate(dateTimeGuess) {
  try {
    // get day
    const dayEnd = dateTimeGuess.length - 5;
    const dayBegin = utility.isNumeric(dateTimeGuess[dateTimeGuess.length - 7]) ?
      dateTimeGuess.length - 7
      : dateTimeGuess.length - 6;
    let day = dateTimeGuess.substring(dayBegin, dayEnd);
    day = day.length === 1 ? 0 + day : day;
    // get month
    const month = 1 + utility.monthsShort.indexOf(dateTimeGuess.substring(dayBegin - 4, dayBegin - 1));
    if (month < 1) {
      throw new Error('getDate failed. Can\'t find month');
    }
    // get year
    const year = dateTimeGuess.substring(dateTimeGuess.length - 4, dateTimeGuess.length);

    // return day, month, year
    return {
      day, month, year
    };
  }
  catch (exception) { throw exception; }
}

// given a date string, e.g. 937 AM CST SAT NOV 7 2015, return {hour, minute, meridiem, timeZone}
function getTime(dateTimeGuess) {
  try {
    // expect that time is either 4 (e.g. 1045) or 3 (e.g. 937) integers long.
    // get index of last integer in time value
    const hourMinuteLastIndex = (function getHourMinuteLastIndex() {
      if (utility.isNumeric(dateTimeGuess[3])) {
        return 3;
      }
      if (utility.isNumeric(dateTimeGuess[2])) {
        return 2;
      }
      return null;
    })();

    if (!hourMinuteLastIndex) {
      throw new Error('getTime failed. Can\'t find hourMinuteLastIndex.');
    }

    // expect that meridiem is always string of length 2, e.g. PM or AM.
    // get meridiem based off hourMinuteLastIndex value
    const meridiem = dateTimeGuess.substring(hourMinuteLastIndex + 2, hourMinuteLastIndex + 4);

    // get hour based off hourMinuteLastIndex value
    let hour = parseInt(dateTimeGuess.substring(0, hourMinuteLastIndex - 1), 10);
    // convert to 24hr format based off meridiem value
    hour = meridiem === 'PM' ? hour + 12 : hour;
    // get minute based off hourMinuteLastIndex value
    const minute = dateTimeGuess.substring(hourMinuteLastIndex - 1, hourMinuteLastIndex + 1);
    // get time zone based off hourMinuteLastIndex value
    let timeZone = _.pick(utility.timeZones, (value, key) => {
      // cast a net for timeZone string, pick out matches found in utility.timeZones
      return dateTimeGuess.substring(hourMinuteLastIndex + 4, hourMinuteLastIndex + 10).indexOf(key) > -1;
    });

    if (!timeZone) {
      throw new Error('getTime failed. Can\'t find timeZone.');
    }

    // timeZone is an object key / value pair with all matches
    // reduce timeZone to the value of the longest key (best match)
    timeZone = timeZone[Object.keys(timeZone).reduce((prev, current) => prev.length > current.length ? prev : current)];

    return {
      hour, minute, meridiem, timeZone
    };
  }
  catch (exception) { throw exception; }
}

/**
 * Returns date/time forecast was issued as a momentjs object.
 * Used to determine the date/time of individual day forecasts, e.g. "REST OF THE NIGHT.."
 *
 * @param {string[]} originalForecastArray - forecast split into an array of lines.
 * @returns {Object} momentjs object representing the moment the forecast was issued.
 */
function getIssuedMoment(originalForecastArray) {
  // try to get date by finding first . and going up 2
  const dateTimeGuess = originalForecastArray[_.findIndex(originalForecastArray, (line) => {
    return line[0] === '.' || line === 'UPDATED';
  }) - 2];

  // try to convert to date
  try {
    const parsedDate = getDate(dateTimeGuess);
    if (!parsedDate) {
      throw new Error('getDate failed');
    }
    const parsedDateTime = Object.assign(getTime(dateTimeGuess), parsedDate);
    const isoString = parsedDateTime.year + '-' + parsedDateTime.month + '-' + parsedDateTime.day + ' ' + parsedDateTime.hour + ':' + parsedDateTime.minute + parsedDateTime.timeZone;
    const issuedMoment = moment(isoString);
    return issuedMoment;
  }
  catch (exception) { throw exception; }
}
