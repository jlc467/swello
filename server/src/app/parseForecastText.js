/* eslint-env node */
'use strict';
module.exports = {
  parseForecastText,
  getForecastObject
};

const objectAssign = require('object-assign');
const utility = require('./utility');
const getIssuedMoment = require('./getIssuedMoment').getIssuedMoment;
const _ = require('lodash');
const moment = require('moment');

function toSentenceCase(text) {
  const rg = /(^\w{1}|\.\s*\w{1})/gi;
  return text.toLowerCase().replace(rg, (toReplace) => {
    return toReplace.toUpperCase();
  });
}

function removeDayString(text) {
  return text.slice(text.indexOf('...') + 3, text.length);
}

function getAdvisory(originalForecastArray) {
  // get index of start of advisory
  const advisoryGuessStart = _.findIndex(originalForecastArray, (line) => _.startsWith(line, '...'));
  // get index of end of advisory
  const advisoryGuessEnd = _.findLastIndex(originalForecastArray, (line) => _.endsWith(line, '...'));
  if (advisoryGuessStart !== null) {
    // create array with just advisory (if one or more exist)
    const advisoryArray = _.slice(originalForecastArray, advisoryGuessStart, advisoryGuessEnd + 1);
    // join lines for advisories spanning multiple lines
    const grouped = advisoryArray.reduce((result, line, index) => {
      if (_.startsWith(line, '...') === true && _.endsWith(line, '...') === true) {
        result.advisoryArray.push(line);
        return result;
      }
      if (_.startsWith(line, '...') === true && _.endsWith(line, '...') === false) {
        result.start = index;
        return result;
      }
      if (_.startsWith(line, '...') === false && _.endsWith(line, '...') === true) {
        result.advisoryArray.push(_.slice(advisoryArray, result.start, index + 1).join(' '));
        return result;
      }
      return result;
    }, { advisoryArray: [], start: null });
    return grouped.advisoryArray.map((line) => {
      return toSentenceCase(_.slice(line, 3, line.length - 3).join(''));
    });
  }
  return false;
}

function getDayByDayArray(originalForecastArray) {
  // get array of indexes representing the start of a new day forecast
  const indexes = originalForecastArray.map((line, index) => {
    if ((line[1] !== '.' && line[0] === '.') || line[0] === '$') {
      return index;
    }
  }).filter((index) => index);

  // 1. slice originalForecastArray with the in-between the start of day and start of the next day
  // 2. join the new array together with a space in-between each line.
  return indexes.map((start, i) => {
    return _.slice(originalForecastArray, start, indexes[i + 1]).join(' ');
  }).slice(0, -1); // slice the end off (empty);
}

function getForecastObject(dayByDayArray, issuedMoment) {
  return dayByDayArray.reduce((days, text, index) => {
    const dayString = text.substring(1, text.indexOf('...'));

    function checkDay(check) {
      return dayString.indexOf(check) > -1;
    }

    function calculateSetDayTo(weekdayIndex, currentDay, today) {
      if (today === true) {
        return weekdayIndex;
      }
      if (weekdayIndex < currentDay) {
        return weekdayIndex + 7;
      }
      return weekdayIndex;
    }

    try {
      let today = false;
      let isNightForecast = dayString.indexOf('NIGHT') > -1 ? true : false;
      let weekdayIndex = _.findIndex(utility.weekdays, checkDay);
      weekdayIndex = weekdayIndex === -1 ? _.findIndex(utility.weekdaysShort, checkDay) : weekdayIndex;
      if (weekdayIndex === -1) {
        if (utility.todayAliasesIsNightTime[dayString] !== null) {
          weekdayIndex = issuedMoment.day(); // sets index as forecast day
          isNightForecast = utility.todayAliasesIsNightTime[dayString];
          today = true;
        } else {
          throw new Error('getForecastObject failed. Can\'t find weekdayIndex');
        }
      }
      const weekday = utility.weekdays[weekdayIndex];
      const order = index + 1;
      const setDayTo = calculateSetDayTo(weekdayIndex, issuedMoment.day(), today);
      const forecastMoment = new moment(issuedMoment);
      forecastMoment.day(setDayTo);
      if (isNightForecast) {
        forecastMoment.hour(17);
      } else {
        forecastMoment.hour(9);
      }
      const date = forecastMoment.valueOf();
      days[order] = {
        order, date, dayString, weekday, isNightForecast, forecastMoment,
        text: toSentenceCase(removeDayString(text))
      };
    } catch (exception) {
      throw exception;
    } finally {
      return days;
    }
  }, {});
}

function parseForecastText(text) {
  try {
    const originalForecastArray = text.split('\n');
    const dayByDayArray = getDayByDayArray(originalForecastArray);
    const issuedMoment = getIssuedMoment(originalForecastArray);
    const advisory = getAdvisory(originalForecastArray);
    const forecasts = getForecastObject(dayByDayArray, issuedMoment);
    return objectAssign({}, forecasts, {
      advisory,
      issuedMoment
    });
  } catch (exception) {
    throw exception;
  }
}
