import moment from 'moment';
import { reduce, isObject, forEach } from 'lodash';

// given a forecast time, try to find marine forecasts for the same day
const matchMarine = (forecastTime, marine) =>
  reduce(marine, (final, m) => {
    if (isObject(m)
      && typeof m.date === 'number'
      && moment(m.date).date()
      === moment.unix(forecastTime).date()
    ) {
      final[m.order] = m;
      return final;
    }
    return final;
  }, {});

export default function mergeMarine(marine, fullForecast) {
  forEach(fullForecast.order, (timestamp) => {
    fullForecast[timestamp].marine = matchMarine(fullForecast[timestamp].time, marine);
  });
  return fullForecast;
}
